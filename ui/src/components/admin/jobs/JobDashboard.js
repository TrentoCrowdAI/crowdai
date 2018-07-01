import React from 'react';
import {Step, Icon, Segment, Grid, Form, Statistic, Header, Message, Dimmer, Loader} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';
import JobParameters from './JobParameters';
import HitInformation from './HitInformation';
import JobDashboardButtons from './JobDashboardButtons';
import {isExpertMode} from 'src/utils';
import JobResults from './JobResults';
import PriceLossChart from './PriceLossChart';
import JobSimpleEstimations from './JobSimpleEstimations';
import {JobStatus} from 'src/utils/constants';
import JobInformation from './JobInformation';

class JobDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 'process',
      showSuccessMsg: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAggregationChange = this.handleAggregationChange.bind(this);
  }
  render() {
    return (
      <Grid style={{margin: '10px'}}>
        <Grid.Row>
          <Grid.Column>{this.renderJobInformation()}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Step.Group attached="top">
              <Step active={this.state.activeStep === 'process'} onClick={() => this.setStep('process')}>
                <Step.Content>
                  <Step.Title>Process</Step.Title>
                </Step.Content>
              </Step>

              <Step active={this.state.activeStep === 'results'} onClick={() => this.setStep('results')}>
                <Step.Content>
                  <Step.Title>Results</Step.Title>
                </Step.Content>
              </Step>
            </Step.Group>

            <Segment attached>
              {this.state.activeStep === 'process' ? this.renderProcess() : this.renderFinalResults()}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  renderJobInformation() {
    return <JobInformation job={this.props.item} loading={this.props.loading} />;
  }

  renderProcess() {
    const {item} = this.props;

    return (
      <Form error={this.props.error !== undefined} success={this.props.saved} loading={this.props.loading}>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <h4 style={{textAlign: 'center'}}>Estimated results</h4>
              <hr />
              {isExpertMode(this.props.profile) ? this.renderExpertEstimations() : this.renderAuthorsEstimations()}
            </Grid.Column>
            <Grid.Column>
              <h4 style={{textAlign: 'center'}}>Actual results</h4>
              <hr />
              <div hidden={!isExpertMode(this.props.profile)} style={{marginBottom: '20px'}}>
                {this.renderAggregationStrategySelector()}
              </div>
              <JobResultSummary jobState={this.props.jobState} job={item} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="10" style={{marginLeft: 'auto', marginRight: 'auto'}}>
              {this.props.error && (
                <Message
                  error
                  header="Error"
                  content={this.props.error.message || 'An error ocurred, please try again.'}
                />
              )}
            </Grid.Column>
          </Grid.Row>

          {this.props.jobState.hit && (
            <Grid.Row centered>
              <Grid.Column width="10">
                <HitInformation
                  hit={this.props.jobState.hit}
                  loading={this.props.jobStateLoading}
                  showMeta={item.data.status !== JobStatus.DONE}
                />
              </Grid.Column>
            </Grid.Row>
          )}

          <JobDashboardButtons job={item} jobState={this.props.jobState} />
        </Grid>
      </Form>
    );
  }

  renderAggregationStrategySelector() {
    const {taskAssignmentStrategy} = this.props.item;
    const {aggregationStrategies} = this.props;

    if (taskAssignmentStrategy && taskAssignmentStrategy.aggregation) {
      // we do not display the Aggregations dropdown if the task assignment strategy performs aggregation.
      return null;
    }
    return (
      <Form.Select
        label="Aggregation strategy"
        name="data.aggregationStrategy"
        value={this.props.item.data.aggregationStrategy}
        options={aggregationStrategies.map(s => ({text: s.name, value: Number(s.id)}))}
        onChange={this.handleAggregationChange}
      />
    );
  }

  renderExpertEstimations() {
    const {item, estimationsLoading, estimationsPolling} = this.props;
    const isLoading = estimationsLoading || estimationsPolling;

    return (
      <div>
        {!isLoading &&
          item.data.estimations && (
            <PriceLossChart
              style={{width: '500px', marginLeft: 'auto', marginRight: 'auto'}}
              data={item.data.estimations}
              onPointClick={point => this.props.setSelectedParameter(point)}
            />
          )}
        {isLoading && (
          <Segment style={{height: '300px'}}>
            <Dimmer active inverted>
              <Loader inverted>Computing estimations</Loader>
            </Dimmer>
          </Segment>
        )}
        <Header as="h2" content="Parameters" textAlign="center" />
        <JobParameters item={item} />
      </div>
    );
  }

  renderAuthorsEstimations() {
    const {item, estimationsLoading, estimationsPolling} = this.props;
    const isLoading = estimationsLoading || estimationsPolling;
    return (
      <React.Fragment>
        {!isLoading && item.data.estimations && <JobSimpleEstimations data={item.data.estimations[0]} />}
        {isLoading && (
          <Segment style={{height: '200px'}}>
            <Dimmer active inverted>
              <Loader inverted>Computing estimations</Loader>
            </Dimmer>
          </Segment>
        )}
      </React.Fragment>
    );
  }

  renderFinalResults() {
    return (
      <Form>
        <div hidden={!isExpertMode(this.props.profile)} style={{marginBottom: '20px'}}>
          {this.renderAggregationStrategySelector()}
        </div>
        <JobResults job={this.props.item} />
      </Form>
    );
  }

  componentDidMount() {
    let {jobId} = this.props.match.params;
    this.props.fetchItem(jobId);
    this.props.fetchJobState(jobId);
    this.props.fetchAggregationStrategies();
    this.props.cleanResults(jobId);
    this.props.pollJobEstimationsStatus(jobId);
  }

  componentDidUpdate() {
    const {item} = this.props;

    if (item.data.status === JobStatus.PUBLISHED && !this.props.polling) {
      this.props.pollJobState(item.id);
    }
  }

  componentWillUnmount() {
    this.props.pollJobStateDone();
    this.props.cleanJobState();
    this.props.cleanState();
    this.props.setSelectedParameter();
  }

  setStep(activeStep) {
    this.setState({
      ...this.state,
      activeStep
    });
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }

  handleAggregationChange(e, {name, value}) {
    this.handleChange(e, {name, value});
    console.log('POST /aggregation', name, value);
  }
}

const JobResultSummary = ({jobState, job}) => {
  const {results} = jobState;
  return (
    <Statistic.Group widths="3">
      <Statistic>
        <Statistic.Value>
          <Icon name="check" />
          {results.in}
        </Statistic.Value>
        <Statistic.Label>Papers IN</Statistic.Label>
      </Statistic>

      <Statistic>
        <Statistic.Value>
          <Icon name="remove" />
          {results.out}
        </Statistic.Value>
        <Statistic.Label>Papers OUT</Statistic.Label>
      </Statistic>

      <Statistic>
        <Statistic.Value>
          <Icon name="question" />
          {results.stopped}
        </Statistic.Value>
        <Statistic.Label>Papers unclassified</Statistic.Label>
      </Statistic>

      <Statistic style={{marginLeft: 'auto', marginRight: 'auto'}}>
        <Statistic.Value>
          <Icon name="dollar" />
          {job.totalCost && job.totalCost.toFixed(2)}
        </Statistic.Value>
        <Statistic.Label>Total cost</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  );
};

JobResultSummary.propTypes = {
  jobState: PropTypes.object,
  job: PropTypes.object
};

JobDashboard.propTypes = {
  item: PropTypes.object,
  match: PropTypes.object,
  fetchItem: PropTypes.func,
  loading: PropTypes.bool,
  saved: PropTypes.bool,
  error: PropTypes.object,
  setInputValue: PropTypes.func,
  pollJobState: PropTypes.func,
  polling: PropTypes.bool,
  jobState: PropTypes.object,
  pollJobStateDone: PropTypes.func,
  fetchJobState: PropTypes.func,
  cleanJobState: PropTypes.func,
  jobStateLoading: PropTypes.bool,
  cleanState: PropTypes.func,
  profile: PropTypes.object,
  fetchResults: PropTypes.func,
  aggregationStrategies: PropTypes.arrayOf(PropTypes.object),
  fetchAggregationStrategies: PropTypes.func,
  cleanResults: PropTypes.func,
  setSelectedParameter: PropTypes.func,
  pollJobEstimationsStatus: PropTypes.func,
  estimationsLoading: PropTypes.bool,
  estimationsPolling: PropTypes.bool
};

const mapStateToProps = state => ({
  item: state.job.form.item,
  loading: state.job.form.loading,
  error: state.job.form.error,
  saved: state.job.form.saved,
  polling: state.job.state.polling,
  jobState: state.job.state.item,
  jobStateLoading: state.job.state.loading,
  profile: state.profile.item,
  aggregationStrategies: state.job.aggregationStrategies.strategies,
  estimationsLoading: state.job.jobEstimations.loading,
  estimationsPolling: state.job.jobEstimations.polling
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(actions.submit()),
  cleanState: () => dispatch(actions.cleanState()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value)),
  fetchItem: id => dispatch(actions.fetchItem(id)),
  fetchJobState: id => dispatch(actions.fetchJobState(id)),
  pollJobState: id => dispatch(actions.pollJobState(id)),
  pollJobStateDone: () => dispatch(actions.pollJobStateDone()),
  cleanJobState: () => dispatch(actions.cleanJobState()),
  fetchResults: id => dispatch(actions.fetchResults(id)),
  cleanResults: id => dispatch(actions.cleanResults(id)),
  fetchAggregationStrategies: () => dispatch(actions.fetchAggregationStrategies()),
  setSelectedParameter: parameter => dispatch(actions.setSelectedParameter(parameter)),
  pollJobEstimationsStatus: id => dispatch(actions.pollJobEstimationsStatus(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboard);
