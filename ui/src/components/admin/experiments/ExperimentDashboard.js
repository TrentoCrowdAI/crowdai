import React from 'react';
import {Step, Icon, Segment, Grid, Form, Button, Statistic, Header, Image, List, Accordion} from 'semantic-ui-react';

import lossPrice from 'src/images/lossprice.png';

const AGGREGATION_STRATEGIES = [
  {text: 'Majority Voting', value: 'mv'},
  {text: 'Truth Finder', value: 'tf'},
  {text: 'Dawid & Skene', value: 'ds'},
  {text: 'SUMS', value: 'sums'},
  {text: 'Investment', value: 'inv'},
  {text: 'Average-log', value: 'avg'}
];

class ExperimentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 'process',
      isRunning: true,
      expertMode: false,
      activeIndex: {}
    };
    this.handleAccordionClick = this.handleAccordionClick.bind(this);
  }
  render() {
    return (
      <Grid style={{margin: '10px'}}>
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

  renderProcess() {
    let item = {
      aggregationStrategy: 'ds'
    };
    return (
      <Form>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <h4 style={{textAlign: 'center'}}>Estimated results</h4>
              <hr />
              {this.state.expertMode ? this.renderExpertEstimations() : this.renderAuthorsEstimations()}
            </Grid.Column>
            <Grid.Column>
              <h4 style={{textAlign: 'center'}}>Actual results</h4>
              <hr />
              <div hidden={!this.state.expertMode} style={{marginBottom: '20px'}}>
                <Form.Select
                  label="Aggregation strategy"
                  name="aggregationStrategy"
                  value={item.aggregationStrategy}
                  options={AGGREGATION_STRATEGIES}
                  onChange={this.handleChange}
                />
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
            <Grid.Column>
              <Button floated="right" size="large" negative={this.state.isRunning} positive={!this.state.isRunning}>
                {this.state.isRunning ? 'Stop' : 'Run'}
              </Button>
              {this.state.expertMode && (
                <Button floated="right" size="large" style={{width: '200px'}}>
                  Update parameters
                </Button>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  renderExpertEstimations() {
    let item = {
      maxTasksRule: 3,
      taskRewardRule: 0.5,
      testFrequencyRule: 2,
      initialTestsRule: 2,
      initialTestsMinCorrectAnswersRule: 100,
      votesPerTaskRule: 2,
      expertCostRule: 0.2
    };
    return (
      <div>
        <Image src={lossPrice} style={{width: '400px', marginLeft: 'auto', marginRight: 'auto'}} />
        <Header as="h2" content="Parameters" textAlign="center" />
        <Grid>
          <Grid.Row>
            <Grid.Column width="8">
              <List divided relaxed>
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
                <List.Item>
                  <List.Content>
                    <List.Header as="h4">Expert cost (in USD)</List.Header>
                    <List.Description as="p">{item.expertCostRule}</List.Description>
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
                    <List.Header as="h4">Votes per (paper,criteria)</List.Header>
                    <List.Description as="p">{item.votesPerTaskRule}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
    const item = {aggregationStrategy: 'ds'};

    return (
      <Form>
        <div hidden={!this.state.expertMode} style={{marginBottom: '20px'}}>
          <Form.Select
            label="Aggregation strategy"
            name="aggregationStrategy"
            value={item.aggregationStrategy}
            options={AGGREGATION_STRATEGIES}
            onChange={this.handleChange}
          />
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
}

export default ExperimentDashboard;
