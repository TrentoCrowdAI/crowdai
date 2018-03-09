import React from 'react';
import {
  Container,
  Form,
  Button,
  Grid,
  Message,
  List,
  Header,
  Accordion,
  Icon,
  Step,
  Segment,
  Radio,
  Checkbox
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';
import {
  FileFormats,
  CrowdsourcingStrategies,
  AbstractPresentationTechniques,
  LabelOptions
} from 'src/utils/constants';

class ExperimentForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.showRulesClick = this.showRulesClick.bind(this);
    this.state = {
      showRules: true,
      expertMode: true,
      activeStep: 'info'
    };
  }

  render() {
    if (this.props.summary) {
      return this.renderSummary();
    }

    return (
      <Container>
        <Grid container centered>
          <Grid.Row style={{padding: 0}}>
            <Grid.Column width="4">
              <h1>New screening</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="10">
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
                        <Step.Title>Screening details</Step.Title>
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
                    {this.state.activeStep === 'info'
                      ? this.renderExperimentInformation()
                      : this.renderCriteriaKnowledge()}
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
                <Button
                  floated="right"
                  type="button"
                  onClick={() =>
                    this.props.history.push(`/admin/projects/${this.props.match.params.projectId}/screenings`)
                  }>
                  Cancel
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  renderExperimentInformation() {
    const {item} = this.props;

    return (
      <React.Fragment>
        <Form.Group>
          <Form.Input
            width={6}
            label="Name"
            name="data.name"
            value={item.data.name}
            placeholder="Screening name"
            onChange={this.handleChange}
            required
          />

          <Form.Input
            width={5}
            label="Task instructions URL"
            name="data.taskInstructionsUrl"
            value={item.data.taskInstructionsUrl}
            placeholder="URL to file"
            onChange={this.handleChange}
            required
          />

          <Form.Select
            width={4}
            label="Format"
            name="data.taskInstructionsFormat"
            value={item.data.taskInstructionsFormat}
            options={Object.values(FileFormats).map(v => ({text: v, value: v}))}
            onChange={this.handleChange}
          />
        </Form.Group>

        {this.renderCriteriaSection()}

        <Form.Field>
          <Checkbox
            label="Assist me in criteria quality analysis"
            name="data.criteriaQualityAnalysis"
            checked={item.data.criteriaQualityAnalysis}
            onChange={(e, {name, value}) => this.handleChange(e, {name, value: !item.data.criteriaQualityAnalysis})}
          />
        </Form.Field>

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

        <div hidden={!this.state.expertMode}>
          <Form.Select
            label="Crowdsourcing strategy"
            name="data.crowdsourcingStrategy"
            value={item.data.crowdsourcingStrategy}
            options={Object.entries(CrowdsourcingStrategies).map(([key, val]) => ({text: val, value: key}))}
            onChange={this.handleChange}
          />

          {this.renderParametersSection()}
        </div>
      </React.Fragment>
    );
  }

  renderCriteriaSection() {
    const {item} = this.props;

    return (
      <div style={{marginBottom: '1em'}}>
        <h3>Criteria</h3>
        <Form.Field>
          <Radio
            label="Ask worker each worker multiple criteria"
            name="data.multipleCriteria"
            value={1}
            checked={item.data.multipleCriteria}
            onChange={(e, {name, value}) => this.handleChange(e, {name, value: !!value})}
          />
        </Form.Field>
        <div style={{marginBottom: '1em', marginLeft: '2em'}}>
          <Form.Field>
            <Checkbox
              label="(C1) Check this box"
              onChange={this.toggle}
              checked={this.state.checked}
              disabled={!item.data.multipleCriteria}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="(C2) Check this box"
              onChange={this.toggle}
              checked={this.state.checked}
              disabled={!item.data.multipleCriteria}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="(C3) Check this box"
              onChange={this.toggle}
              checked={this.state.checked}
              disabled={!item.data.multipleCriteria}
            />
          </Form.Field>
        </div>
        <Form.Field>
          <Radio
            label="Ask each worker one criterion only"
            name="data.multipleCriteria"
            value={0}
            checked={!item.data.multipleCriteria}
            onChange={(e, {name, value}) => this.handleChange(e, {name, value: !!value})}
          />
        </Form.Field>
      </div>
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

  renderSummary() {
    const {item} = this.props;
    return (
      <React.Fragment>
        <Header content="Experiment Summary" />
        <Grid>
          <Grid.Row>
            <Grid.Column width="8">
              <List divided relaxed>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Name</List.Header>
                    <List.Description as="p">{item.name}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Max. tasks</List.Header>
                    <List.Description as="p">{item.maxTasksRule}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Task reward</List.Header>
                    <List.Description as="p">{item.taskRewardRule}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Test frequency</List.Header>
                    <List.Description as="p">{item.testFrequencyRule}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width="8">
              <List divided relaxed>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Initial tests</List.Header>
                    <List.Description as="p">{item.initialTestsRule}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Initial Tests min score (%)</List.Header>
                    <List.Description as="p">{item.initialTestsMinCorrectAnswersRule}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">#Votes per (paper,criteria)</List.Header>
                    <List.Description as="p">{item.votesPerTaskRule}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Expert cost (in USD)</List.Header>
                    <List.Description as="p">{item.expertCostRule}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }

  renderParametersSection() {
    const {item} = this.props;
    return (
      <Accordion styled style={{width: '100%', marginBottom: 20}}>
        <Accordion.Title active={this.state.showRules} index={0} onClick={this.showRulesClick}>
          <Icon name="dropdown" />
          Parameters
        </Accordion.Title>
        <Accordion.Content active={this.state.showRules}>
          <Form.Group widths="equal">
            <Form.Input
              label="Max. tasks per worker"
              name="data.maxTasksRule"
              value={item.data.maxTasksRule}
              onChange={this.handleChange}
              type="number"
              min="1"
              required
            />

            <Form.Input
              label="#Votes per paper"
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
            />
          </Form.Group>
        </Accordion.Content>
      </Accordion>
    );
  }

  componentDidMount() {
    this.props.cleanState();
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }

  showRulesClick() {
    this.setState({
      showRules: !this.state.showRules
    });
  }

  setStep(activeStep) {
    this.setState({
      ...this.state,
      activeStep
    });
  }
}

ExperimentForm.propTypes = {
  summary: PropTypes.bool,
  item: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.any,
  saved: PropTypes.bool,
  submit: PropTypes.func,
  setInputValue: PropTypes.func,
  cleanState: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object
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
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentForm);
