import React, {Component} from 'react';
import {Container, Grid, Divider} from 'semantic-ui-react';
import {Provider, connect} from 'react-redux';
import {BrowserRouter as Router, Route, withRouter} from 'react-router-dom';
import queryString from 'query-string';

import './App.css';
import store from './store';
import Instructions from 'src/components/Instructions';
import FilterTask from 'src/components/FilterTask';
import QuestionForm from 'src/components/question-form/QuestionForm';
import WelcomePage from 'src/components/WelcomePage';
import {actions} from 'src/components/question-form/actions';
import RewardWidget from 'src/components/reward-widget/RewardWidget';
import config from 'src/config/config.json';

/**
 * Main component.
 */
class ConnectedApp extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <Container>
        <Route path={'/welcome'} component={WelcomePage} />

        <Route
          path={'/task'}
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
                  <Divider as="h4" className="header" horizontal style={{textTransform: 'uppercase', marginTop: 20}}>
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
      </Container>
    );
  }

  componentWillMount() {
    /* eslint-disable */
    const qs = queryString.parse(this.props.location.search);
    this.props.setCurrentSession(qs);
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

  setCurrentSession: ({hitId, assignmentId, workerId}) =>
    dispatch(actions.setCurrentSession(hitId, assignmentId, workerId))
});

const ConnectedAppWrapper = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectedApp));

class App extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <Provider store={store}>
        <Router basename={config.routesBaseUrl}>
          <Route path={'/'} component={ConnectedAppWrapper} />
        </Router>
      </Provider>
    );
  }
}

export default App;
