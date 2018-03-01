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
  Segment
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';
import {FileFormats} from 'src/utils/constants';

class ExperimentForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.showRulesClick = this.showRulesClick.bind(this);
    this.state = {
      showRules: false,
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
              <h1>New experiment</h1>
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
                        <Step.Title>Experiment information</Step.Title>
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
            width={16}
            label="Name"
            name="name"
            value={item.name}
            placeholder="Experiment name"
            onChange={this.handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            width={10}
            label="Information of Consent URL"
            name="consentUrl"
            value={item.consentUrl}
            placeholder="URL to consent file"
            onChange={this.handleChange}
            required
          />

          <Form.Select
            width={6}
            label="Format"
            name="consentFormat"
            value={item.consentFormat}
            options={Object.values(FileFormats).map(v => ({text: v, value: v}))}
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            width={10}
            label="Task instructions URL"
            name="taskInstructionsUrl"
            value={item.taskInstructionsUrl}
            placeholder="URL to task instructions file"
            onChange={this.handleChange}
            required
          />

          <Form.Select
            width={6}
            label="Format"
            name="taskInstructionsFormat"
            value={item.taskInstructionsFormat}
            options={Object.values(FileFormats).map(v => ({text: v, value: v}))}
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            label="Items URL"
            name="itemsUrl"
            value={item.itemsUrl}
            placeholder="URL to items CSV file"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            label="Filters URL"
            name="filtersUrl"
            value={item.filtersUrl}
            placeholder="URL to filters CSV file"
            onChange={this.handleChange}
            required
          />

          <Form.Input
            label="Tests URL"
            name="testsUrl"
            value={item.testsUrl}
            placeholder="URL to tests CSV file"
            onChange={this.handleChange}
            required
          />
        </Form.Group>

        <div hidden={!this.state.expertMode}>
          <Form.Select
            label="Crowdsourcing strategy"
            name="crowdsourcingStrategy"
            value={item.crowdsourcingStrategy}
            options={[
              {text: 'Baseline', value: 'baseline'},
              {text: 'Multi-run', value: 'mr'},
              {text: 'Shortest run', value: 'sr'}
            ]}
            onChange={this.handleChange}
          />

          {this.renderParametersSection()}
        </div>
      </React.Fragment>
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
              label="Are technology and/or technological solutions involved?"
              name="c1"
              value={item.c1}
              onChange={this.handleChange}
              min="1"
              max="100"
              placeholder="% of papers you think would meet the criteria"
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Input
              type="number"
              label="Are the elderly involved?"
              name="c2"
              value={item.c2}
              onChange={this.handleChange}
              min="1"
              max="100"
              placeholder="% of papers you think would meet the criteria"
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Input
              type="number"
              label="Is it related to loneliness, social isolation, or social connectedness reason?"
              name="c3"
              value={item.c2}
              onChange={this.handleChange}
              min="1"
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
                    <List.Header as="h4">Answers per task</List.Header>
                    <List.Description as="p">{item.votesPerTaskRule}</List.Description>
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
              label="Max. tasks"
              name="maxTasksRule"
              value={item.maxTasksRule}
              onChange={this.handleChange}
              type="number"
              min="1"
              required
            />

            <Form.Input
              label="Task reward (in USD)"
              name="taskRewardRule"
              value={item.taskRewardRule}
              onChange={this.handleChange}
              type="number"
              required
            />

            <Form.Input
              label="Test frequency"
              name="testFrequencyRule"
              value={item.testFrequencyRule}
              onChange={this.handleChange}
              type="number"
              min="1"
              required
            />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input
              label="Initial tests"
              name="initialTestsRule"
              value={item.initialTestsRule}
              onChange={this.handleChange}
              type="number"
              min="1"
              required
            />

            <Form.Input
              label="Initial Tests min score (%)"
              name="initialTestsMinCorrectAnswersRule"
              value={item.initialTestsMinCorrectAnswersRule}
              onChange={this.handleChange}
              type="number"
              min="1"
              max="100"
              required
            />

            <Form.Input
              label="Answers per task"
              name="votesPerTaskRule"
              value={item.votesPerTaskRule}
              onChange={this.handleChange}
              type="number"
              min="1"
              required
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Expert cost"
              name="expertCostRule"
              value={item.expertCostRule}
              onChange={this.handleChange}
              type="number"
              min="1"
              required
            />
            {/* dumb inputs just to ensure correct sizing  */}
            <Form.Input type="hidden" />
            <Form.Input type="hidden" />
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
  cleanState: PropTypes.func
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
