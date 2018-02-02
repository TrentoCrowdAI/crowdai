import React, {Component} from 'react';
import {Container, Grid, Divider} from 'semantic-ui-react';
import {Provider, connect} from 'react-redux';
import {BrowserRouter as Router, Route, withRouter} from 'react-router-dom';

import './App.css';
import Instructions from 'src/components/Instructions';
import FilterTask from 'src/components/FilterTask';
import QuestionForm from 'src/components/question-form/QuestionForm';
import store from './store';

/**
 * Main component.
 */
class ConnectedApp extends Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <Container>
        <Grid.Row centered>
          <Instructions />
        </Grid.Row>

        <Grid.Row>
          {this.props.hasAcceptedHit && ( // eslint-disable-line react/prop-types
            <Divider as="h4" className="header" horizontal style={{textTransform: 'uppercase', marginTop: 20}}>
              Task
            </Divider>
          )}
          <QuestionForm>
            <FilterTask />
          </QuestionForm>
        </Grid.Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit
});

const mapDispatchToProps = dispatch => ({});

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
