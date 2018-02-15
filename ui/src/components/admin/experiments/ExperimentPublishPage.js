import React from 'react';
import {Container, Grid, Form, Header, Message, Button, Loader, Dimmer} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ExperimentForm from './ExperimentForm';
import {actions} from './actions';

class ExperimentPublishPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    let {item} = this.props;
    console.log(item.published);

    return (
      <React.Fragment>
        <Container>
          <Dimmer active={this.props.loading} inverted>
            <Loader content="Loading" />
          </Dimmer>
          <Grid container centered>
            <Grid.Row>
              <Grid.Column width="4">
                <h1>Publish Experiment</h1>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width="10">
                <ExperimentForm summary />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width="10">
                <Header content="HIT configuration" />
                <Form
                  error={this.props.error !== undefined}
                  success={this.props.published}
                  onSubmit={() => this.props.publish()}>
                  <Form.TextArea
                    label="Description"
                    name="description"
                    value={item.description}
                    placeholder="HIT description"
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Group>
                    <Form.Input
                      width={6}
                      label="Assignment duration (in seconds)"
                      name="assignmentDurationInSeconds"
                      value={item.assignmentDurationInSeconds}
                      placeholder="120"
                      onChange={this.handleChange}
                      required
                    />
                    <Form.Input
                      width={5}
                      label="Lifetime (in seconds)"
                      name="lifetimeInSeconds"
                      value={item.lifetimeInSeconds}
                      placeholder="120"
                      onChange={this.handleChange}
                      required
                    />
                    <Form.Input
                      width={5}
                      label="Max. assignments"
                      name="maxAssignments"
                      value={item.maxAssignments}
                      placeholder="10"
                      onChange={this.handleChange}
                      type="number"
                      min="1"
                      required
                    />
                  </Form.Group>

                  <div style={{marginBottom: '10px'}}>
                    {this.props.error && (
                      <Message
                        error
                        header="Error"
                        content={this.props.error.message || 'Experiment not published. Please try again.'}
                      />
                    )}
                    {this.props.published && <Message success header="Success" content="Published!" />}
                  </div>

                  <Button floated="right" positive>
                    Publish
                  </Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }

  componentDidMount() {
    const {experimentId} = this.props.match.params;

    if (experimentId) {
      this.props.fetchItem(experimentId);
    }
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }
}

ExperimentPublishPage.propTypes = {
  match: PropTypes.object,
  fetchItem: PropTypes.func,
  item: PropTypes.object,
  setInputValue: PropTypes.func,
  error: PropTypes.object,
  loading: PropTypes.bool,
  published: PropTypes.bool,
  publish: PropTypes.func
};

const mapStateToProps = state => ({
  item: state.experiment.form.item,
  loading: state.experiment.form.loading,
  error: state.experiment.form.error,
  published: state.experiment.form.item.published
});

const mapDispatchToProps = dispatch => ({
  fetchItem: id => dispatch(actions.fetchItem(id)),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value)),
  publish: () => dispatch(actions.publish())
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentPublishPage);
