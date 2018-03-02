import React from 'react';
import {Step, Icon, Segment, Grid, Form, Button, Statistic, Divider, Header, Card} from 'semantic-ui-react';

class ExperimentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 'process'
    };
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
    return (
      <Form>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <h4 style={{textAlign: 'center'}}>Estimated results</h4>
              <hr />
              <Statistic.Group widths="2">
                <Statistic>
                  <Statistic.Value>
                    <Icon
                      name="calculator"
                      // color="blue"
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
                      // color="blue"
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
            </Grid.Column>
            <Grid.Column>
              <h4 style={{textAlign: 'center'}}>Actual results</h4>
              <hr />
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
              <Button floated="right" size="large" style={{width: '200px'}} positive>
                Stop
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  renderFinalResults() {
    let results = [
      {
        votes: {
          C1: {in: 2, out: 1},
          C2: {in: 1, out: 2},
          C3: {in: 2, out: 1}
        },
        icon: 'check',
        color: 'green'
      },
      {
        votes: {
          C1: {in: 1, out: 2},
          C2: {in: 1, out: 2},
          C3: {in: 1, out: 2}
        },
        icon: 'remove',
        color: 'red'
      },
      {
        votes: {
          C1: {in: 2, out: 1},
          C2: {in: 1, out: 2},
          C3: {in: 2, out: 1}
        },
        icon: 'check',
        color: 'green'
      }
    ];
    return [1, 2, 3].map((paper, idx) => (
      <Card key={paper} style={{boxShadow: 'none'}} fluid>
        <Card.Content>
          <Card.Header style={{marginBottom: '10px', textAlign: 'center'}}>
            <Icon size="large" name={results[idx].icon} color={results[idx].color} />
            Paper #{paper}
          </Card.Header>
          <Divider clearing />
          <Card.Description textAlign="center">
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
          </Card.Description>
        </Card.Content>
      </Card>
    ));
  }

  setStep(activeStep) {
    this.setState({
      ...this.state,
      activeStep
    });
  }
}

export default ExperimentDashboard;
