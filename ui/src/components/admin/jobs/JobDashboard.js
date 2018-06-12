import React from 'react';
import {
  Step,
  Icon,
  Segment,
  Grid,
  Form,
  Button,
  Statistic,
  Header,
  Image,
  Accordion,
  Message,
  List,
  Label
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import lossPrice from 'src/images/lossprice.png';
import {actions} from './actions';
import {AggregationStrategies, JobStatus} from 'src/utils/constants';
import JobParameters from './JobParameters';
import HitInformation from './HitInformation';
import JobDashboardButtons from './JobDashboardButtons';
import {isExpertMode} from 'src/utils';

class JobDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 'process',
      activeIndex: {},
      aggregationStrategy: 'ds',
      showSuccessMsg: true
    };
    this.handleAccordionClick = this.handleAccordionClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    const {item} = this.props;

    return (
      <Segment loading={this.props.loading}>
        <Header as="h3">
          Job Information
          <Label horizontal color={jobStatusColors[item.data.status]}>
            {item.data.status}
          </Label>
        </Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width="8">
              <List divided relaxed>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Name</List.Header>
                    <List.Description as="p">{item.data.name}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Description</List.Header>
                    <List.Description as="p">{item.data.description}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width="8">
              <List divided relaxed>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Number of papers</List.Header>
                    <List.Description as="p">{item.itemsCount}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Number of filters</List.Header>
                    <List.Description as="p">{item.criteria.length}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
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
              <Statistic.Group widths="3">
                <Statistic>
                  <Statistic.Value>
                    <Icon name="check" /* color="green"*/ />
                    10
                  </Statistic.Value>
                  <Statistic.Label>Papers IN</Statistic.Label>
                </Statistic>

                <Statistic>
                  <Statistic.Value>
                    <Icon name="remove" /* color="red"*/ />
                    8
                  </Statistic.Value>
                  <Statistic.Label>Papers OUT</Statistic.Label>
                </Statistic>

                <Statistic>
                  <Statistic.Value>
                    <Icon name="question" /* color="orange"*/ />
                    2
                  </Statistic.Value>
                  <Statistic.Label>Papers unclassified</Statistic.Label>
                </Statistic>

                <Statistic style={{marginLeft: 'auto', marginRight: 'auto'}}>
                  <Statistic.Value>
                    <Icon name="dollar" /* color="blue"*/ />
                    20
                  </Statistic.Value>
                  <Statistic.Label>Total cost</Statistic.Label>
                </Statistic>
              </Statistic.Group>
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

    if (taskAssignmentStrategy && taskAssignmentStrategy.aggregation) {
      // we do not display the Aggregations dropdown if the task assignment strategy performs aggregation.
      return null;
    }
    return (
      <Form.Select
        label="Aggregation strategy"
        value={this.state.aggregationStrategy}
        options={Object.entries(AggregationStrategies).map(([key, val]) => ({text: val, value: key}))}
        onChange={(e, {value}) => this.setState({...this.state, aggregationStrategy: value})}
      />
    );
  }

  renderExpertEstimations() {
    const {item} = this.props;

    return (
      <div>
        <Image src={lossPrice} style={{width: '400px', marginLeft: 'auto', marginRight: 'auto'}} />
        <Header as="h2" content="Parameters" textAlign="center" />
        <JobParameters item={item} />
      </div>
    );
  }

  renderAuthorsEstimations() {
    return (
      <Statistic.Group widths="2">
        <Statistic>
          <Statistic.Value>
            <Icon
              name="calculator"
              size="small"
              style={{
                verticalAlign: 'top',
                marginTop: '8px',
                marginRight: '2px'
              }}
            />
            0.40
          </Statistic.Value>
          <Statistic.Label>Estimated precision</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <Icon
              name="calculator"
              size="small"
              style={{
                verticalAlign: 'top',
                marginTop: '8px',
                marginRight: '2px'
              }}
            />
            0.80
          </Statistic.Value>
          <Statistic.Label>Estimated price ratio</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  }

  renderFinalResults() {
    let results = [
      {
        votes: {
          C1: {in: 2, out: 1},
          C2: {in: 1, out: 0},
          C3: {in: 2, out: 1}
        },
        pout: 0.15,
        in: true
      },
      {
        votes: {
          C1: {in: 1, out: 2},
          C2: {in: 1, out: 2},
          C3: {in: 1, out: 2}
        },
        pout: 0.99,
        in: false,
        reason: 'not on 75+ older adults'
      },
      {
        votes: {
          C1: {in: 2, out: 1},
          C2: {in: 1, out: 2},
          C3: {in: 2, out: 1}
        },
        pout: 0.03,
        in: true
      }
    ];

    return (
      <Form>
        <div hidden={!isExpertMode(this.props.profile)} style={{marginBottom: '20px'}}>
          {this.renderAggregationStrategySelector()}
        </div>
        <Accordion style={{width: '100%'}} styled exclusive={false}>
          {[1, 2, 3].map((paper, idx) => (
            <div key={idx}>
              <Accordion.Title active={this.state.activeIndex[idx]} index={idx} onClick={this.handleAccordionClick}>
                <Icon name="dropdown" />
                Paper #{paper}
                <Icon
                  name={results[idx].in ? 'check' : 'remove'}
                  color={results[idx].in ? 'green' : 'red'}
                  style={{marginLeft: '10px'}}
                />
                <span style={{marginLeft: '10px'}}>P(OUT) = {results[idx].pout}</span>
                {!results[idx].in && <span style={{marginLeft: '10px'}}>Reason: {results[idx].reason}</span>}
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndex === idx} style={{textAlign: 'center'}}>
                {['C1', 'C2', 'C3'].map(f => (
                  <div key={f} style={{display: 'inline-block', marginRight: '10px'}}>
                    <Header size="large" content={f} textAlign="center" />
                    <Button
                      size="mini"
                      content="IN"
                      icon="check"
                      label={{basic: true, pointing: 'left', content: results[idx].votes[f].in}}
                    />
                    <Button
                      basic
                      size="mini"
                      content="OUT"
                      icon="remove"
                      label={{as: 'a', basic: true, pointing: 'left', content: results[idx].votes[f].out}}
                    />
                  </div>
                ))}
              </Accordion.Content>
            </div>
          ))}
        </Accordion>
      </Form>
    );
  }

  componentDidMount() {
    let {jobId} = this.props.match.params;
    this.props.fetchItem(jobId);
    this.props.fetchJobState(jobId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {item} = this.props;

    if (item.data.status === JobStatus.PUBLISHED && !this.props.polling) {
      this.props.pollJobState(item.id);
    }
  }

  componentWillUnmount() {
    this.props.pollJobStateDone();
    this.props.cleanJobState();
    this.props.cleanState();
  }

  setStep(activeStep) {
    this.setState({
      ...this.state,
      activeStep
    });
  }

  handleAccordionClick(e, {index}) {
    const {activeIndex} = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({
      ...this.state,
      activeIndex: newIndex
    });
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }
}

const jobStatusColors = {
  [JobStatus.PUBLISHED]: 'green',
  [JobStatus.NOT_PUBLISHED]: 'grey',
  [JobStatus.DONE]: 'blue'
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
  profile: PropTypes.object
};

const mapStateToProps = state => ({
  item: state.job.form.item,
  loading: state.job.form.loading,
  error: state.job.form.error,
  saved: state.job.form.saved,
  polling: state.job.state.polling,
  jobState: state.job.state.item,
  jobStateLoading: state.job.state.loading,
  profile: state.profile.item
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(actions.submit()),
  cleanState: () => dispatch(actions.cleanState()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value)),
  fetchItem: id => dispatch(actions.fetchItem(id)),
  fetchJobState: id => dispatch(actions.fetchJobState(id)),
  pollJobState: id => dispatch(actions.pollJobState(id)),
  pollJobStateDone: () => dispatch(actions.pollJobStateDone()),
  cleanJobState: () => dispatch(actions.cleanJobState())
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboard);
