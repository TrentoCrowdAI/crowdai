import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';
import Papa from 'papaparse';

import {actionTypes, actions} from './actions';
import axios, {requestersApi} from 'src/utils/axios';
import {flattenError, isExpertMode} from 'src/utils';
import config from 'src/config/config.json';
import {actions as historyActions} from 'src/components/core/history/actions';
import {actions as toastActions} from 'src/components/core/toast/actions';
import ToastTypes from 'src/components/core/toast/types';
import {JobEstimationStatus} from 'src/utils/constants';

const getJobs = (action$, store) =>
  action$.ofType(actionTypes.FETCH_JOBS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('jobs'))
      .mergeMap(response => Observable.of(actions.fetchJobsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchJobsError(flattenError(error))));
  });

const saveJob = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().job.form;
    const profile = store.getState().profile.item;
    item.requester_id = profile.id;
    item.data.taskAssignmentStrategy = Number(item.data.taskAssignmentStrategy);
    // we check if the user fill in the priors in the Filters Knowledge tab.
    const priorsOk = Object.values(item.data.priors).filter(f => f === '').length === 0;

    if (!priorsOk) {
      return Observable.concat(
        Observable.of(
          toastActions.show({
            message: 'Please fill in the values in the Filters Knowledge section',
            type: ToastTypes.WARNING
          })
        ),
        Observable.of(actions.submitSuccess())
      );
    }
    return Observable.defer(
      () => (item.id ? requestersApi.put(`/jobs/${item.id}`, item) : requestersApi.post('/jobs', item))
    )
      .mergeMap(response => {
        let msg = 'The CSV files are now being processed.';
        let actionsToConcat = [Observable.of(actions.submitSuccess())];
        let jobSaved = response.data;

        if (
          jobSaved.data.itemsUrl === item.data.itemsUrl &&
          jobSaved.data.testsUrl === item.data.testsUrl &&
          jobSaved.data.filtersUrl === item.data.filtersUrl &&
          jobSaved.project_id === item.project_id &&
          item.id
        ) {
          msg = 'The job was saved correctly.';
        } else {
          actionsToConcat.push(Observable.of(actions.checkCSVCreation(jobSaved)));
        }
        actionsToConcat.push(
          Observable.of(
            toastActions.show({
              header: 'Job saved',
              message: msg,
              type: ToastTypes.SUCCESS
            })
          )
        );
        if (action.redirect) {
          actionsToConcat.push(Observable.of(historyActions.push('/admin/jobs')));
        }

        if (action.onSuccessExtraAction && typeof action.onSuccessExtraAction === 'function') {
          actionsToConcat.push(Observable.of(action.onSuccessExtraAction()));
        }
        return Observable.concat(...actionsToConcat);
      })
      .catch(error => {
        let err = flattenError(error);
        let msg = err.message || 'Changes not saved. Please try again.';
        return Observable.concat(
          Observable.of(actions.submitError(err)),
          Observable.of(toastActions.show({message: msg, type: ToastTypes.ERROR}))
        );
      });
  });

const fetchJob = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(
      () => (action.isWorker ? axios.get(`jobs/${action.id}`) : requestersApi.get(`jobs/${action.id}`))
    )
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

const publishJob = (action$, store) =>
  action$.ofType(actionTypes.PUBLISH_JOB).switchMap(action => {
    const {item} = store.getState().job.form;
    const config = {timeout: 20000};
    actions.pollJobStateDone();
    return Observable.defer(() => requestersApi.post(`jobs/${item.id}/publish`, {}, config))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(toastActions.show({message: 'Published!', type: ToastTypes.SUCCESS})),
          Observable.of(actions.publishSuccess(response.data)),
          Observable.of(actions.pollJobState(item.id))
        )
      )
      .catch(error => {
        let err = flattenError(error);
        return Observable.concat(
          Observable.of(actions.publishError(err)),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

const fetchJobState = (action$, store) =>
  action$.ofType(actionTypes.FETCH_JOB_STATE).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`jobs/${action.id}/state`))
      .mergeMap(response => Observable.of(actions.fetchJobStateSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchJobStateError(flattenError(error))));
  });

const pollJobState = (action$, store) =>
  action$.ofType(actionTypes.FETCH_JOB_STATE_POLLED).switchMap(action => {
    return Observable.concat(
      Observable.of(actions.fetchJobState(action.id)),
      Observable.interval(config.polling.jobState)
        .takeUntil(action$.ofType(actionTypes.FETCH_JOB_STATE_POLLED_DONE))
        .mergeMap(() => {
          return Observable.concat(
            Observable.of(actions.fetchJobState(action.id)),
            Observable.of(actions.fetchItem(action.id))
          );
        })
    );
  });

const copyJob = (action$, store) =>
  action$.ofType(actionTypes.COPY_JOB).switchMap(action => {
    return Observable.defer(() => requestersApi.post(`jobs/${action.id}/copy`))
      .mergeMap(response =>
        Observable.concat(
          Observable.of(toastActions.show({message: 'Copy created!', type: ToastTypes.SUCCESS})),
          Observable.of(actions.copyJobSuccess(response.data)),
          Observable.of(actions.fetchItem(response.data.id)),
          Observable.of(historyActions.push(`/admin/screenings/${response.data.id}/edit`))
        )
      )
      .catch(error => Observable.of(actions.copyJobError(flattenError(error))));
  });

const checkCSVCreation = (action$, store) =>
  action$.ofType(actionTypes.CHECK_CSV_CREATION).switchMap(action => {
    return Observable.concat(
      pollCSV(action.job, store),
      Observable.interval(config.polling.jobCheckCSV)
        .takeUntil(action$.ofType(actionTypes.CHECK_CSV_CREATION_DONE))
        .mergeMap(() => pollCSV(action.job, store))
    );
  });

const fetchFiltersCSV = (action$, store) =>
  action$.ofType(actionTypes.FETCH_FILTERS_CSV).switchMap(action => {
    return Observable.defer(() => requestersApi.get('/csv-preview', {params: {url: action.url}}))
      .mergeMap(response => {
        let rsp = Papa.parse(response.data.trim(), {header: true});
        let count = 0;
        let criteria = rsp.data.map(f => ({label: `C${++count}`, description: f.filterDescription}));
        return Observable.of(actions.fetchFiltersCSVSuccess(criteria));
      })
      .catch(error => {
        let err = flattenError(error);
        return Observable.concat(
          Observable.of(actions.fetchFiltersCSVError(err)),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

function pollCSV(job, store) {
  const profile = store.getState().profile.item;
  return Observable.defer(() => requestersApi.get(`jobs/${job.id}/check-csv`))
    .mergeMap(response => {
      let status = response.data;

      if (status.itemsCreated && status.testsCreated) {
        // we start the estimation because it takes time.
        const single = !isExpertMode(profile); // Researchers => single=false, Authors => single=true
        return Observable.concat(
          Observable.of(actions.checkCSVCreationDone()),
          Observable.of(actions.computeJobEstimations(job.id, single)),
          Observable.of(
            toastActions.show({
              header: `Job ${job.data.name} `,
              message: 'The CSV files have been processed correctly.',
              type: ToastTypes.INFO,
              dismissAfter: 5000
            })
          )
        );
      }
      return Observable.of(actions.checkCSVCreationSuccess(status));
    })
    .catch(error => {
      return Observable.concat(
        Observable.of(actions.checkCSVCreationError(error)),
        Observable.of(
          toastActions.show({
            message: `An error ocurred while checking the CSVs status of job with id ${job.id}`,
            type: ToastTypes.ERROR,
            dismissAfter: 5000
          })
        ),
        Observable.of(actions.checkCSVCreationDone())
      );
    });
}

const fetchTaskAssignmentStrategies = (action$, store) =>
  action$.ofType(actionTypes.FETCH_TASK_ASSIGNMENT_STRATEGIES).switchMap(action => {
    return Observable.defer(() => requestersApi.get('task-assignment-strategies'))
      .mergeMap(response => Observable.of(actions.fetchTaskAssignmentStrategiesSuccess(response.data)))
      .catch(error => {
        let err = flattenError(error);
        return Observable.concat(
          Observable.of(actions.fetchTaskAssignmentStrategiesError(err)),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

const fetchResults = (action$, store) =>
  action$.ofType(actionTypes.FETCH_RESULTS).switchMap(action => {
    return Observable.defer(() =>
      requestersApi.get(`jobs/${action.jobId}/results`, {params: {page: action.page, pageSize: 10}})
    )
      .mergeMap(response => Observable.of(actions.fetchResultsSuccess(response.data)))
      .catch(error => {
        let err = flattenError(error);
        return Observable.concat(
          Observable.of(actions.fetchResultsError(err)),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

const fetchAggregationStrategies = (action$, store) =>
  action$.ofType(actionTypes.FETCH_AGGREGATION_STRATEGIES).switchMap(action => {
    return Observable.defer(() => requestersApi.get('aggregation-strategies'))
      .mergeMap(response => Observable.of(actions.fetchAggregationStrategiesSuccess(response.data)))
      .catch(error => {
        let err = flattenError(error);
        return Observable.concat(
          Observable.of(actions.fetchAggregationStrategiesError(err)),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

const computeJobEstimations = (action$, store) =>
  action$.ofType(actionTypes.COMPUTE_JOB_ESTIMATIONS).switchMap(action => {
    return Observable.defer(() => requestersApi.post(`/jobs/${action.jobId}/estimates`, {single: action.single}))
      .mergeMap(response => {
        let toConcat = [Observable.of(actions.computeJobEstimationsSuccess(action.jobId, response.data))];

        if (action.onSuccessAction && typeof action.onSuccessAction === 'function') {
          toConcat.push(Observable.of(action.onSuccessAction()));
        }
        return Observable.concat(...toConcat);
      })
      .catch(error => {
        let err = flattenError(error);

        if (err.message === 'The job should specify Filters Knowledge') {
          err.message = `${err.message}. Please edit the job to add the priors (using Filters Knowledge tab)`;
        }
        return Observable.concat(
          Observable.of(actions.computeJobEstimationsError(err)),
          Observable.of(toastActions.show({message: err.message, type: ToastTypes.ERROR}))
        );
      });
  });

const fetchJobEstimationsStatus = (action$, store) =>
  action$.ofType(actionTypes.FETCH_JOB_ESTIMATIONS_STATUS).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`jobs/${action.jobId}/estimates-status`))
      .mergeMap(response => {
        let rsp = response.data;
        let actionsToConcat = [Observable.of(actions.fetchJobEstimationsStatusSuccess(action.jobId, response.data))];

        if (rsp.status === JobEstimationStatus.DONE || rsp.status === JobEstimationStatus.NONE) {
          actionsToConcat.push(Observable.of(actions.pollJobEstimationsStatusDone(action.jobId)));
          actionsToConcat.push(Observable.of(actions.fetchItem(action.jobId)));
        }
        return Observable.concat(...actionsToConcat);
      })
      .catch(error => Observable.of(actions.fetchJobEstimationsStatusError(flattenError(error))));
  });

const pollJobEstimationsStatus = (action$, store) =>
  action$.ofType(actionTypes.CHECK_JOB_ESTIMATIONS_STATUS_POLLED).switchMap(action => {
    return Observable.concat(
      Observable.of(actions.fetchJobEstimationsStatus(action.jobId)),
      Observable.interval(config.polling.jobState)
        .takeUntil(action$.ofType(actionTypes.CHECK_JOB_ESTIMATIONS_STATUS_POLLED_DONE))
        .mergeMap(() => {
          return Observable.of(actions.fetchJobEstimationsStatus(action.jobId));
        })
    );
  });

export default combineEpics(
  getJobs,
  saveJob,
  fetchJob,
  publishJob,
  fetchJobState,
  pollJobState,
  copyJob,
  checkCSVCreation,
  fetchFiltersCSV,
  fetchTaskAssignmentStrategies,
  fetchResults,
  fetchAggregationStrategies,
  computeJobEstimations,
  fetchJobEstimationsStatus,
  pollJobEstimationsStatus
);
