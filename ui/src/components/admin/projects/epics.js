import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {actionTypes, actions} from './actions';
import {requestersApi} from 'src/utils/axios';
import {flattenError} from 'src/utils';
import {actions as historyActions} from 'src/components/core/history/actions';
import {actions as toastActions} from 'src/components/core/toast/actions';
import ToastTypes from 'src/components/core/toast/types';
import config from 'src/config/config.json';

const getProjects = (action$, store) =>
  action$.ofType(actionTypes.FETCH_PROJECTS).switchMap(action => {
    return Observable.defer(() => requestersApi.get('projects'))
      .mergeMap(response => Observable.of(actions.fetchProjectsSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchProjectsError(flattenError(error))));
  });

const saveProject = (action$, store) =>
  action$.ofType(actionTypes.SUBMIT).switchMap(action => {
    const {item} = store.getState().project.form;
    const profile = store.getState().profile.item;
    item.requester_id = profile.id;

    return Observable.defer(
      () => (item.id ? requestersApi.put(`projects/${item.id}`, item) : requestersApi.post('projects', item))
    )
      .mergeMap(response =>
        Observable.concat(
          Observable.of(toastActions.show({message: 'Project created!', type: ToastTypes.SUCCESS})),
          Observable.of(actions.submitSuccess()),
          Observable.of(actions.pollProject(response.data.id)),
          Observable.of(historyActions.push('/admin/projects'))
        )
      )
      .catch(error => {
        let err = flattenError(error);
        let msg = err.message || 'Changes not saved. Please try again.';
        return Observable.concat(
          Observable.of(actions.submitError(err)),
          Observable.of(toastActions.show({message: msg, type: ToastTypes.ERROR}))
        );
      });
  });

const fetchProject = (action$, store) =>
  action$.ofType(actionTypes.FETCH_ITEM).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`projects/${action.id}`))
      .mergeMap(response => Observable.of(actions.fetchItemSuccess(response.data)))
      .catch(error => Observable.of(actions.fetchItemError(flattenError(error))));
  });

const fetchProjectState = (action$, store) =>
  action$.ofType(actionTypes.FETCH_PROJECT_STATE).switchMap(action => {
    return Observable.defer(() => requestersApi.get(`projects/${action.id}`))
      .mergeMap(response => {
        let project = response.data;

        if (project.data.itemsCreated && project.data.filtersCreated && project.data.testsCreated) {
          return Observable.concat(
            Observable.of(actions.pollProjectDone()),
            Observable.of(
              toastActions.show({
                header: `Project ${project.data.name} `,
                message: 'The items, filters, and tests CSV files have been processed correctly.',
                type: ToastTypes.INFO,
                dismissAfter: 5000
              })
            )
          );
        }
        return Observable.of(actions.fetchProjectStateSuccess());
      })
      .catch(error => {
        return Observable.concat(
          Observable.of(actions.fetchProjectStateError(error)),
          Observable.of(
            toastActions.show({
              message: `An error ocurred while checking the state of project with id ${action.id}`,
              type: ToastTypes.ERROR,
              dismissAfter: 5000
            })
          ),
          Observable.of(actions.pollProjectDone())
        );
      });
  });

const pollProject = (action$, store) =>
  action$.ofType(actionTypes.POLL_PROJECT).switchMap(action => {
    return Observable.concat(
      Observable.of(actions.fetchProjectState(action.id)),
      Observable.interval(config.polling.project)
        .takeUntil(action$.ofType(actionTypes.POLL_PROJECT_DONE))
        .mergeMap(() => Observable.of(actions.fetchProjectState(action.id)))
    );
  });

export default combineEpics(getProjects, saveProject, fetchProject, pollProject, fetchProjectState);
