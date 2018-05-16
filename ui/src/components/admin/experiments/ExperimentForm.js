import React from 'react';
import {
  Form,
  Button,
  Grid,
  Message,
  Icon,
  Step,
  Segment,
  Radio,
  Checkbox,
  Header,
  Dimmer,
  Loader
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import validUrl from 'valid-url';

import {actions} from './actions';
import FormContainer from 'src/components/core/form/FormContainer';
import {
  FileFormats,
  CrowdsourcingStrategies,
  AbstractPresentationTechniques,
  LabelOptions,
  JobStatus
} from 'src/utils/constants';

class ExperimentForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      expertMode: true,
      activeStep: 'info'
    };
  }

  render() {
    const {jobId} = this.props.match.params;
    const {item} = this.props;

    if (item.id === jobId && item.data.status !== JobStatus.NOT_PUBLISHED) {
      return <Redirect to={'/admin/screenings/'} />;
    }

    return (
      <FormContainer title={jobId ? 'Edit job' : 'New job'}>
        <Form
          error={this.props.error !== undefined}
          loading={this.props.loading}
          success={this.props.saved}
          onSubmit={() => this.props.submit()}>
          <div style={{marginBottom: 20}}>
            <Step.Group attached="top">
              <Step active={this.state.activeStep === 'info'} onClick={() => this.setStep('info')}>
                <Icon name="setting" />
                <Step.Content>
                  <Step.Title>Job details</Step.Title>
                </Step.Content>
              </Step>

              <Step active={this.state.activeStep === 'criteria'} onClick={() => this.setStep('criteria')}>
                <Icon name="filter" />
                <Step.Content>
                  <Step.Title>Criteria knowledge</Step.Title>
                </Step.Content>
              </Step>
            </Step.Group>

            <Segment attached>
              {this.state.activeStep === 'info' ? this.renderExperimentInformation() : this.renderCriteriaKnowledge()}
            </Segment>
          </div>

          {this.props.error && (
            <Message
              error
              header="Error"
              content={this.props.error.message || 'Changes not saved. Please try again.'}
            />
          )}
          {this.props.saved && <Message success header="Success" content="Changes saved!" />}
          <Button floated="right" positive>
            Save
          </Button>
          <Button floated="right" type="button" onClick={() => this.props.history.push('/admin/screenings')}>
            Cancel
          </Button>
        </Form>
      </FormContainer>
    );
  }

  renderExperimentInformation() {
    const {item} = this.props;

    return (
      <React.Fragment>
        <Segment>
          <Header as="h3">Basic information</Header>

          <Form.Group widths="equal">
            <Form.Input
              label="Name"
              name="data.name"
              value={item.data.name}
              placeholder="Job name, as it will appear on Amazon Mechanical Turk"
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.TextArea
            label="Description"
            name="data.description"
            placeholder="The screening description, as it will appear on Amazon Mechanical Turk"
            value={item.data.description}
            onChange={this.handleChange}
          />

          <Form.Group>
            <Form.Input
              width={12}
              label="Informed Consent URL"
              name="data.consentUrl"
              value={item.data.consentUrl}
              placeholder="URL to consent file"
              onChange={this.handleChange}
              required
            />

            <Form.Select
              width={6}
              label="Format"
              name="data.consentFormat"
              value={item.data.consentFormat}
              options={Object.values(FileFormats).map(v => ({text: v, value: v}))}
              onChange={this.handleChange}
            />
          </Form.Group>

          {this.renderProjecInformation()}
        </Segment>

        {this.renderCriteriaSection()}

        <Segment>
          <Header as="h3">Task design</Header>
          <Form.Group widths="equal">
            <Form.Select
              label="Smart abstract presentation technique"
              name="data.abstractPresentationTechnique"
              value={item.data.abstractPresentationTechnique}
              options={Object.entries(AbstractPresentationTechniques).map(([key, val]) => ({text: val, value: key}))}
              onChange={this.handleChange}
            />
            <Form.Select
              label="Label options"
              name="data.labelOptions"
              value={item.data.labelOptions}
              options={Object.entries(LabelOptions).map(([key, val]) => ({text: val, value: key}))}
              onChange={this.handleChange}
            />
          </Form.Group>

          {this.state.expertMode && (
            <Form.Select
              label="Task assignment strategy"
              name="data.crowdsourcingStrategy"
              value={item.data.crowdsourcingStrategy}
              options={Object.entries(CrowdsourcingStrategies).map(([key, val]) => ({text: val, value: key}))}
              onChange={this.handleChange}
            />
          )}
        </Segment>

        {this.renderParametersSection()}
        {this.renderHitSection()}
      </React.Fragment>
    );
  }

  renderProjecInformation() {
    const {item} = this.props;

    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <Form.Input
            label="Items URL"
            name="data.itemsUrl"
            value={item.data.itemsUrl}
            placeholder="URL to items CSV file"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            label="Filters URL"
            name="data.filtersUrl"
            value={item.data.filtersUrl}
            placeholder="URL to filters CSV file"
            onChange={this.handleChange}
            required
          />

          <Form.Input
            label="Tests URL"
            name="data.testsUrl"
            value={item.data.testsUrl}
            placeholder="URL to tests CSV file"
            onChange={this.handleChange}
            required
          />
        </Form.Group>
      </React.Fragment>
    );
  }

  renderCriteriaSection() {
    const {item} = this.props;
    const {criteria} = item;

    return (
      <Segment>
        <Dimmer active={item.criteriaLoading} inverted>
          <Loader>Loading criteria from CSV...</Loader>
        </Dimmer>
        <Header as="h3">Criteria</Header>
        <Form.Field>
          <Radio
            disabled={(criteria && criteria.length === 1) || true}
            label="Ask to each worker multiple criteria"
            name="data.multipleCriteria"
            value={1}
            checked={item.data.multipleCriteria}
            onChange={(e, {name, value}) => this.handleChange(e, {name, value: !!value})}
          />
        </Form.Field>
        <div style={{marginBottom: '1em', marginLeft: '2em'}}>
          {criteria &&
            criteria.map((c, idx) => (
              <Form.Field key={c.id || idx}>
                <Checkbox
                  label={`(${c.label || c.data.label}) ${c.description || c.data.description}`}
                  onChange={this.toggle}
                  checked={this.state.checked}
                  disabled={!item.data.multipleCriteria}
                />
              </Form.Field>
            ))}
        </div>

        <Form.Field>
          <Radio
            label="Ask to each worker one criterion only"
            name="data.multipleCriteria"
            value={0}
            checked={!item.data.multipleCriteria}
            onChange={(e, {name, value}) => this.handleChange(e, {name, value: !!value})}
          />
        </Form.Field>

        <Form.Field style={{marginTop: '2em', marginBottom: '2em'}}>
          <Checkbox
            label="Assist me in criteria quality analysis"
            name="data.criteriaQualityAnalysis"
            checked={item.data.criteriaQualityAnalysis}
            onChange={(e, {name, value}) => this.handleChange(e, {name, value: !item.data.criteriaQualityAnalysis})}
          />
        </Form.Field>

        {criteria &&
          criteria.map((c, idx) => {
            let label = c.label || c.data.label;
            return (
              <div key={idx}>
                <Header as="h5">
                  ({label}) {c.description || c.data.description}
                </Header>

                <Form.Group>
                  <Form.Input
                    width={10}
                    label="Task instructions URL"
                    name={`data.instructions[${label}].taskInstructionsUrl`}
                    value={item.data.instructions[label] ? item.data.instructions[label].taskInstructionsUrl : ''}
                    placeholder="URL to file"
                    onChange={this.handleChange}
                    required
                  />

                  <Form.Select
                    width={6}
                    label="Format"
                    name={`data.instructions[${label}].format`}
                    value={
                      item.data.instructions[label] ? item.data.instructions[label].format : FileFormats.PLAIN_TEXT
                    }
                    options={Object.values(FileFormats).map(v => ({text: v, value: v}))}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </div>
            );
          })}
      </Segment>
    );
  }

  renderCriteriaKnowledge() {
    const {item} = this.props;
    return (
      <Grid columns="1">
        <Grid.Row>
          <Grid.Column>
            <Form.Input
              type="number"
              label="(C1) Are technology and/or technological solutions involved?"
              name="c1"
              value={item.c1}
              onChange={this.handleChange}
              min="0"
              max="100"
              placeholder="% of papers you think would meet the criteria"
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Input
              type="number"
              label="(C2) Are the elderly involved?"
              name="c2"
              value={item.c2}
              onChange={this.handleChange}
              min="0"
              max="100"
              placeholder="% of papers you think would meet the criteria"
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Input
              type="number"
              label="(C3) Is it related to loneliness, social isolation, or social connectedness reason?"
              name="c3"
              value={item.c2}
              onChange={this.handleChange}
              min="0"
              max="100"
              placeholder="% of papers you think would meet the criteria"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  renderParametersSection() {
    const {item} = this.props;

    if (!this.state.expertMode) {
      return;
    }
    return (
      <Segment>
        <Header as="h3">Parameters</Header>
        <Form.Group widths="equal">
          <Form.Input
            label="Max. #tasks per worker"
            name="data.maxTasksRule"
            value={item.data.maxTasksRule}
            onChange={this.handleChange}
            type="number"
            min="1"
            required
          />

          <Form.Input
            label="Min. #tasks per worker"
            name="data.minTasksRule"
            value={item.data.minTasksRule}
            onChange={this.handleChange}
            type="number"
            min="1"
            required
          />

          <Form.Input
            label="#Votes per task"
            name="data.votesPerTaskRule"
            value={item.data.votesPerTaskRule}
            onChange={this.handleChange}
            type="number"
            min="1"
            required
          />

          <Form.Input
            label="Task reward (in USD)"
            name="data.taskRewardRule"
            value={item.data.taskRewardRule}
            onChange={this.handleChange}
            type="number"
            min="0"
            step="0.01"
            required
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            width={4}
            label="Test frequency"
            name="data.testFrequencyRule"
            value={item.data.testFrequencyRule}
            onChange={this.handleChange}
            type="number"
            min="1"
            required
          />
          <Form.Input
            width={2}
            label="Initial tests"
            name="data.initialTestsRule"
            value={item.data.initialTestsRule}
            onChange={this.handleChange}
            type="number"
            min="1"
            required
          />

          <Form.Input
            width={4}
            label="Initial Tests min score (%)"
            name="data.initialTestsMinCorrectAnswersRule"
            value={item.data.initialTestsMinCorrectAnswersRule}
            onChange={this.handleChange}
            type="number"
            min="1"
            max="100"
            required
          />

          <Form.Input
            width={4}
            label="Expert cost (in USD)"
            name="data.expertCostRule"
            value={item.data.expertCostRule}
            onChange={this.handleChange}
            type="number"
            min="0"
            step="0.01"
          />
        </Form.Group>
      </Segment>
    );
  }

  renderHitSection() {
    const {item} = this.props;

    return (
      <Segment>
        <Header as="h3">HIT configuration</Header>

        <Form.Group widths="equal">
          <Form.Input
            label="Assignment duration (in minutes)"
            name="data.hitConfig.assignmentDurationInMinutes"
            type="number"
            value={item.data.hitConfig.assignmentDurationInMinutes}
            onChange={this.handleChange}
            required
          />
          <Form.Input
            label="Lifetime (in minutes)"
            name="data.hitConfig.lifetimeInMinutes"
            value={item.data.hitConfig.lifetimeInMinutes}
            placeholder="120"
            type="number"
            onChange={this.handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Field width="8">
            <Form.Input
              label="Max. number of workers"
              name="data.hitConfig.maxAssignments"
              value={item.data.hitConfig.maxAssignments}
              onChange={this.handleChange}
              type="number"
              min="0"
            />
            <span style={{fontSize: '0.9em'}}>A value greater than 0 will limit the number of workers.</span>
          </Form.Field>
        </Form.Group>
      </Segment>
    );
  }

  componentDidMount() {
    this.props.cleanState();
    this.props.setInputValue('project_id', Number(this.props.match.params.projectId));

    const {jobId} = this.props.match.params;

    if (jobId) {
      this.props.fetchItem(jobId);
    }
  }

  handleChange(e, {type, name, value}) {
    if (name === 'data.filtersUrl') {
      this.props.setInputValue('data.instructions', {});
      this.props.setInputValue('criteria', []);

      if (value.length > 0 && validUrl.isWebUri(value)) {
        this.props.fetchFiltersCSV(value);
      }
    }
    this.props.setInputValue(name, type === 'number' ? Number(value) : value);
  }

  setStep(activeStep) {
    this.setState({
      ...this.state,
      activeStep
    });
  }
}

ExperimentForm.propTypes = {
  item: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.any,
  saved: PropTypes.bool,
  submit: PropTypes.func,
  setInputValue: PropTypes.func,
  cleanState: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object,
  fetchItem: PropTypes.func,
  fetchFiltersCSV: PropTypes.func
};

const mapStateToProps = state => ({
  item: state.experiment.form.item,
  loading: state.experiment.form.loading,
  error: state.experiment.form.error,
  saved: state.experiment.form.saved
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(actions.submit()),
  cleanState: () => dispatch(actions.cleanState()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value)),
  fetchItem: id => dispatch(actions.fetchItem(id)),
  fetchFiltersCSV: url => dispatch(actions.fetchFiltersCSV(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentForm);
