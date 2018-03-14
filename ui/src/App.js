import React, {Component} from 'react';
import {Container, Grid, Divider} from 'semantic-ui-react';
import {Provider, connect} from 'react-redux';
import {HashRouter as Router, Route, withRouter, Switch} from 'react-router-dom';
import queryString from 'query-string';

import './App.css';
import store from './store';
import Instructions from 'src/components/question-form/Instructions';
import FilterTask from 'src/components/question-form/FilterTask';
import QuestionForm from 'src/components/question-form/QuestionForm';
import WelcomePage from 'src/components/question-form/WelcomePage';
import {actions} from 'src/components/question-form/actions';
import RewardWidget from 'src/components/reward-widget/RewardWidget';
import DashboardContainer from 'src/components/admin/dashboard/DashboardContainer';
import Login from 'src/components/admin/login/Login';

import SimpleLineChart from 'src/components/charts/SimpleLineChart'

/**
 * Main component.
 */
class ConnectedApp extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={DashboardContainer} />
        </Switch>

        <Container>
          <Switch>
            <Route path={'/charting'} component={SimpleLineChart} />
            <Route path={'/welcome/:experimentId'} component={WelcomePage} />
            <Route
              path={'/task/:experimentId'}
              render={props => (
                <React.Fragment>
                  <Grid.Row
                    style={{
                      textAlign: 'right',
                      marginBottom: '-3rem'
                    }}>
                    <RewardWidget />
                  </Grid.Row>
                  <Grid.Row centered>
                    <Instructions />
                  </Grid.Row>

                  <Grid.Row>
                    {props.hasAcceptedHit && ( // eslint-disable-line react/prop-types
                      <Divider
                        as="h4"
                        className="header"
                        horizontal
                        style={{textTransform: 'uppercase', marginTop: 20}}>
                        Task
                      </Divider>
                    )}
                    <QuestionForm>
                      <FilterTask />
                    </QuestionForm>
                  </Grid.Row>
                </React.Fragment>
              )}
            />
          </Switch>
        </Container>
      </React.Fragment>
    );
  }

  componentWillMount() {
    /* eslint-disable */
    const qs = queryString.parse(this.props.location.search);
    const experimentId = this.props.location.pathname.split('/').pop();
    this.props.setCurrentSession({ ...qs, experimentId });
    this.props.setWorkerAcceptedHit(this.hasAcceptedHit(qs));
    /* eslint-enable */
  }

  hasAcceptedHit(qs) {
    const {assignmentId, hitId, workerId} = qs;

    return (
      assignmentId !== undefined &&
      assignmentId !== 'ASSIGNMENT_ID_NOT_AVAILABLE' &&
      hitId !== undefined &&
      workerId !== undefined
    );
  }
}

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit
});

const mapDispatchToProps = dispatch => ({
  setWorkerAcceptedHit: accepted => dispatch(actions.setWorkerAcceptedHit(accepted)),

  setCurrentSession: ({hitId, assignmentId, workerId, experimentId}) =>
    dispatch(actions.setCurrentSession(hitId, assignmentId, workerId, experimentId))
});

const ConnectedAppWrapper = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectedApp));

class App extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route path={'/'} component={ConnectedAppWrapper} />
        </Router>
      </Provider>
    );
  }
}

export default App;
