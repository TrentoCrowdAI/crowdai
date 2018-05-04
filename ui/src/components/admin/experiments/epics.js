import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';
import Papa from 'papaparse';

import {actionTypes, actions} from './actions';
import axios, {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';
import config from 'src/config/config.json';
import {actions as historyActions} from 'src/components/core/history/actions';
import {actions as toastActions} from 'src/components/core/toast/actions';
import ToastTypes from 'src/components/core/toast/types';

const getExperiments = (action$, store) =>
  action$.ofType(actionTypes.FETCH_EXPERIMENTS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('jobs'))
      .mergeMap(response => Observable.of(actions.fetchExperimentsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchExperimentsError(flattenError(error))));
  });

const saveExperiment = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().experiment.form;
    const profile = store.getState().profile.item;
    item.requester_id = profile.id;
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
        actionsToConcat.push(Observable.of(historyActions.push('/admin/jobs')));
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

const fetchExperiment = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(
      () => (action.isWorker ? axios.get(`jobs/${action.id}`) : requestersApi.get(`jobs/${action.id}`))
    )
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

const publishExperiment = (action$, store) =>
  action$.ofType(actionTypes.PUBLISH_EXPERIMENT).switchMap(action => {
    const {item} = store.getState().experiment.form;
    const config = {timeout: 10000};
    return Observable.defer(() => requestersApi.post(`jobs/${item.id}/publish`, {}, config))
      .mergeMap(response => Observable.of(actions.publishSuccess(response.data)))
      .catch(error => Observable.of(actions.publishError(flattenError(error))));
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
        .mergeMap(() => Observable.of(actions.fetchJobState(action.id)))
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
      pollCSV(action.job),
      Observable.interval(config.polling.jobCheckCSV)
        .takeUntil(action$.ofType(actionTypes.CHECK_CSV_CREATION_DONE))
        .mergeMap(() => pollCSV(action.job))
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
        let msg = err.message || 'Please try again.';
        return Observable.concat(
          Observable.of(actions.fetchFiltersCSVError(err)),
          Observable.of(toastActions.show({message: msg, type: ToastTypes.ERROR}))
        );
      });
  });

function pollCSV(job) {
  return Observable.defer(() => requestersApi.get(`jobs/${job.id}/check-csv`))
    .mergeMap(response => {
      let status = response.data;

      if (status.itemsCreated && status.testsCreated) {
        return Observable.concat(
          Observable.of(actions.checkCSVCreationDone()),
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

export default combineEpics(
  getExperiments,
  saveExperiment,
  fetchExperiment,
  publishExperiment,
  fetchJobState,
  pollJobState,
  copyJob,
  checkCSVCreation,
  fetchFiltersCSV
);
