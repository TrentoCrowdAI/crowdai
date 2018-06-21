import React from 'react';
import {Step, Icon, Segment, Grid, Form, Statistic, Header, Message, List, Label} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';
import {JobStatus} from 'src/utils/constants';
import JobParameters from './JobParameters';
import HitInformation from './HitInformation';
import JobDashboardButtons from './JobDashboardButtons';
import {isExpertMode} from 'src/utils';
import JobResults from './JobResults';
import PriceLossChart from './PriceLossChart';

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
    const {item} = this.props;
    const criteria = item.criteria || [];

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
                    <List.Description as="p">{criteria && criteria.length}</List.Description>
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
    const {item} = this.props;

    return (
      <div>
        <PriceLossChart style={{width: '500px', marginLeft: 'auto', marginRight: 'auto'}} data={this.getDataTwo()} />
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

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }

  handleAggregationChange(e, {name, value}) {
    this.handleChange(e, {name, value});
    console.log('POST /aggregation', name, value);
  }

  getDataTwo() {
    return [
      {
        worker_tests: 1,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.898,
        loss_std: 0.4198761722,
        price_mean: 10.921,
        price_std: 0.4119575221,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6049739982,
        recall_std: 0.1693726886,
        precision: 0.8660634921,
        precision_std: 0.1376091207,
        f_beta: 0.6307925183,
        f_beta_std: 0.1613452187,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.7905,
        loss_std: 0.4084540978,
        price_mean: 14.229,
        price_std: 3.3215371442,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6531796676,
        recall_std: 0.1719742058,
        precision: 0.872794733,
        precision_std: 0.1375231832,
        f_beta: 0.6759082527,
        f_beta_std: 0.1614353252,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.6676666667,
        loss_std: 0.4087026901,
        price_mean: 21.1533333333,
        price_std: 10.1610968349,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7048463296,
        recall_std: 0.1738644593,
        precision: 0.8986087061,
        precision_std: 0.1286599449,
        f_beta: 0.7261653273,
        f_beta_std: 0.1640481069,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.67725,
        loss_std: 0.4104508954,
        price_mean: 18.95975,
        price_std: 9.587836953,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7012568612,
        recall_std: 0.1790339789,
        precision: 0.8950456349,
        precision_std: 0.1353929369,
        f_beta: 0.7216795733,
        f_beta_std: 0.167411204,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.6514,
        loss_std: 0.3983566744,
        price_mean: 19.1746,
        price_std: 8.5865746861,
        algorithm: 'Crowd-Ensemble',
        recall: 0.712295399,
        recall_std: 0.1744781244,
        precision: 0.9000027417,
        precision_std: 0.1289411436,
        f_beta: 0.7324283466,
        f_beta_std: 0.1627692153,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.595,
        loss_std: 0.4024611783,
        price_mean: 22.6455,
        price_std: 11.0307201979,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7358684232,
        recall_std: 0.1770094635,
        precision: 0.9105604858,
        precision_std: 0.1250779826,
        f_beta: 0.7549194006,
        f_beta_std: 0.1650900836,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.6115714286,
        loss_std: 0.3989652177,
        price_mean: 21.3685714286,
        price_std: 10.6812050264,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7281390792,
        recall_std: 0.177026785,
        precision: 0.9061172954,
        precision_std: 0.1249601314,
        f_beta: 0.7474249517,
        f_beta_std: 0.1649481596,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.59,
        loss_std: 0.3997499218,
        price_mean: 21.515625,
        price_std: 9.9989886793,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7388992431,
        recall_std: 0.1770606654,
        precision: 0.9095609668,
        precision_std: 0.121635006,
        f_beta: 0.7574892324,
        f_beta_std: 0.1646101971,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.5386666667,
        loss_std: 0.4074506105,
        price_mean: 24.1256666667,
        price_std: 11.9737064762,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7610400433,
        recall_std: 0.1803906093,
        precision: 0.91879066,
        precision_std: 0.1180518407,
        f_beta: 0.7784093734,
        f_beta_std: 0.1677940085,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.5353,
        loss_std: 0.4005357787,
        price_mean: 23.2278,
        price_std: 11.6744035034,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7627075619,
        recall_std: 0.1771175867,
        precision: 0.9196647686,
        precision_std: 0.1160604653,
        f_beta: 0.7801583113,
        f_beta_std: 0.1646370096,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.5136363636,
        loss_std: 0.3937182363,
        price_mean: 23.3916363636,
        price_std: 11.1432059633,
        algorithm: 'Crowd-Ensemble',
        recall: 0.771690398,
        recall_std: 0.1744538222,
        precision: 0.9240610248,
        precision_std: 0.1136550662,
        f_beta: 0.7887965651,
        f_beta_std: 0.1620360036,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.478,
        loss_std: 0.3973130588,
        price_mean: 25.609,
        price_std: 12.9578998684,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7874806282,
        recall_std: 0.1762370882,
        precision: 0.9292929154,
        precision_std: 0.1107872474,
        f_beta: 0.8034341881,
        f_beta_std: 0.1635190007,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.4743846154,
        loss_std: 0.3901301634,
        price_mean: 24.9142307692,
        price_std: 12.6801128887,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7896397812,
        recall_std: 0.17297257,
        precision: 0.9273436435,
        precision_std: 0.1108363937,
        f_beta: 0.8051711271,
        f_beta_std: 0.16034671,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.4552857143,
        loss_std: 0.3869024293,
        price_mean: 25.1002857143,
        price_std: 12.2372776468,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7980602235,
        recall_std: 0.1718775046,
        precision: 0.9290850935,
        precision_std: 0.1089523631,
        f_beta: 0.8128205438,
        f_beta_std: 0.1589954346,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.4296666667,
        loss_std: 0.3871733749,
        price_mean: 27.0940666667,
        price_std: 13.9792704195,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8094551023,
        recall_std: 0.1720334958,
        precision: 0.9335905317,
        precision_std: 0.1067694941,
        f_beta: 0.8234946749,
        f_beta_std: 0.1591803117,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.4341875,
        loss_std: 0.3825775606,
        price_mean: 26.533,
        price_std: 13.7088141719,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8077078078,
        recall_std: 0.1703381648,
        precision: 0.9338070055,
        precision_std: 0.105998591,
        f_beta: 0.8220742644,
        f_beta_std: 0.157530025,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.4189411765,
        loss_std: 0.3790779014,
        price_mean: 26.7382352941,
        price_std: 13.3248362689,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8144143259,
        recall_std: 0.1692116454,
        precision: 0.9364009063,
        precision_std: 0.1041448398,
        f_beta: 0.8283525339,
        f_beta_std: 0.1564177689,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.4011111111,
        loss_std: 0.3769009432,
        price_mean: 28.5862777778,
        price_std: 15.0248715295,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8220738351,
        recall_std: 0.168218006,
        precision: 0.9395157188,
        precision_std: 0.1022736572,
        f_beta: 0.8355463443,
        f_beta_std: 0.1554740966,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.3982631579,
        loss_std: 0.3729041562,
        price_mean: 28.111,
        price_std: 14.7625259053,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8225414191,
        recall_std: 0.167494954,
        precision: 0.9401439642,
        precision_std: 0.1015078737,
        f_beta: 0.8360436151,
        f_beta_std: 0.1546514936,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.39185,
        loss_std: 0.3671458532,
        price_mean: 28.33085,
        price_std: 14.4206099308,
        algorithm: 'Crowd-Ensemble',
        recall: 0.825199846,
        recall_std: 0.1652771479,
        precision: 0.9413537213,
        precision_std: 0.0999477457,
        f_beta: 0.8386166434,
        f_beta_std: 0.1525453287,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.3753809524,
        loss_std: 0.3663865999,
        price_mean: 30.0772380952,
        price_std: 16.0949954065,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8326891402,
        recall_std: 0.1649480416,
        precision: 0.9440511631,
        precision_std: 0.0983296299,
        f_beta: 0.8455768018,
        f_beta_std: 0.1522540286,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.3743636364,
        loss_std: 0.3658266536,
        price_mean: 29.6665454545,
        price_std: 15.8371839173,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8337350465,
        recall_std: 0.1640138674,
        precision: 0.9446372996,
        precision_std: 0.0972149419,
        f_beta: 0.8465646829,
        f_beta_std: 0.1512471548,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.3635652174,
        loss_std: 0.3628550826,
        price_mean: 29.8984347826,
        price_std: 15.5272126389,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8385151865,
        recall_std: 0.1627348838,
        precision: 0.9465349313,
        precision_std: 0.0958002379,
        f_beta: 0.8510478558,
        f_beta_std: 0.1500120144,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.3502916667,
        loss_std: 0.3614062787,
        price_mean: 31.5693333333,
        price_std: 17.1832034379,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8443147882,
        recall_std: 0.1620261911,
        precision: 0.9487626425,
        precision_std: 0.0943897454,
        f_beta: 0.8564629822,
        f_beta_std: 0.1493748496,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.34488,
        loss_std: 0.3575329154,
        price_mean: 31.20788,
        price_std: 16.9289075816,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8466051404,
        recall_std: 0.1604572377,
        precision: 0.9493012565,
        precision_std: 0.0939802035,
        f_beta: 0.858535027,
        f_beta_std: 0.1477815638,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.3381153846,
        loss_std: 0.3549310688,
        price_mean: 31.4500384615,
        price_std: 16.6442587121,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8496754666,
        recall_std: 0.1594427587,
        precision: 0.9504676029,
        precision_std: 0.0927504659,
        f_beta: 0.8613938757,
        f_beta_std: 0.1467299523,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.3267037037,
        loss_std: 0.3534693988,
        price_mean: 33.0632222222,
        price_std: 18.2874930239,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8546654138,
        recall_std: 0.1587477342,
        precision: 0.9523021361,
        precision_std: 0.0914960962,
        f_beta: 0.8660343848,
        f_beta_std: 0.1461014614,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.3229285714,
        loss_std: 0.3498969163,
        price_mean: 32.7406071429,
        price_std: 18.0360410802,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8565537211,
        recall_std: 0.1571906945,
        precision: 0.9522753952,
        precision_std: 0.091168273,
        f_beta: 0.867683971,
        f_beta_std: 0.14454711,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.315862069,
        loss_std: 0.3473795226,
        price_mean: 32.9909310345,
        price_std: 17.77177864,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8597026795,
        recall_std: 0.1560466079,
        precision: 0.9535858222,
        precision_std: 0.0901790529,
        f_beta: 0.8706434794,
        f_beta_std: 0.1434636085,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.3062,
        loss_std: 0.3458731367,
        price_mean: 34.5581333333,
        price_std: 19.4045317864,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8639683622,
        recall_std: 0.1553256535,
        precision: 0.9550588874,
        precision_std: 0.0890627854,
        f_beta: 0.8745901305,
        f_beta_std: 0.1427973011,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      }
    ];
  }

  getDataOne() {
    return [
      {
        worker_tests: 1,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.922,
        loss_std: 0.4874587162,
        price_mean: 10.9,
        price_std: 0.5278257288,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6108744034,
        recall_std: 0.2117619494,
        precision: 0.8146341991,
        precision_std: 0.1753551447,
        f_beta: 0.630696515,
        f_beta_std: 0.2052131864,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.832,
        loss_std: 0.4546713098,
        price_mean: 12.5825,
        price_std: 1.7400341232,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6461435786,
        recall_std: 0.1928840382,
        precision: 0.8500313853,
        precision_std: 0.1531092276,
        f_beta: 0.6668573705,
        f_beta_std: 0.1849525298,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.8116666667,
        loss_std: 0.4332596091,
        price_mean: 14.2553333333,
        price_std: 2.76251182,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6507479742,
        recall_std: 0.1831805761,
        precision: 0.8473910719,
        precision_std: 0.152744441,
        f_beta: 0.6706844752,
        f_beta_std: 0.1739105976,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.7725,
        loss_std: 0.4205873869,
        price_mean: 15.948,
        price_std: 3.7841407215,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6616536242,
        recall_std: 0.177824383,
        precision: 0.8596325896,
        precision_std: 0.1508131202,
        f_beta: 0.6824558975,
        f_beta_std: 0.1691953326,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.7268,
        loss_std: 0.4269915222,
        price_mean: 17.6634,
        price_std: 4.8196919445,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6828224997,
        recall_std: 0.1798338595,
        precision: 0.8710028971,
        precision_std: 0.1434101309,
        f_beta: 0.7029712045,
        f_beta_std: 0.1702814087,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.698,
        loss_std: 0.4238466704,
        price_mean: 19.3865,
        price_std: 5.8483538496,
        algorithm: 'Crowd-Ensemble',
        recall: 0.6951260129,
        recall_std: 0.1795018471,
        precision: 0.884765688,
        precision_std: 0.1387841319,
        f_beta: 0.7155165382,
        f_beta_std: 0.1692135348,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.6602857143,
        loss_std: 0.4217581278,
        price_mean: 21.1171428571,
        price_std: 6.876614022,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7111343815,
        recall_std: 0.1799248108,
        precision: 0.8934453166,
        precision_std: 0.1341761917,
        f_beta: 0.7308965663,
        f_beta_std: 0.168888069,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 1,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.629875,
        loss_std: 0.4171495348,
        price_mean: 22.8525,
        price_std: 7.902980055,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7242149517,
        recall_std: 0.1779379903,
        precision: 0.9003221917,
        precision_std: 0.1310902954,
        f_beta: 0.7436036485,
        f_beta_std: 0.1669851035,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.6428888889,
        loss_std: 0.4144132249,
        price_mean: 21.6813333333,
        price_std: 8.1550465902,
        algorithm: 'Crowd-Ensemble',
        recall: 0.719814488,
        recall_std: 0.1759911993,
        precision: 0.8965373145,
        precision_std: 0.1308986067,
        f_beta: 0.739083336,
        f_beta_std: 0.1647187729,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.6329,
        loss_std: 0.4092952357,
        price_mean: 21.1401,
        price_std: 7.905883062,
        algorithm: 'Crowd-Ensemble',
        recall: 0.724078638,
        recall_std: 0.1739337031,
        precision: 0.9000366855,
        precision_std: 0.1279142204,
        f_beta: 0.7433517358,
        f_beta_std: 0.1624934958,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.6211818182,
        loss_std: 0.4016233691,
        price_mean: 21.0425454545,
        price_std: 7.5444711166,
        algorithm: 'Crowd-Ensemble',
        recall: 0.729536736,
        recall_std: 0.170934551,
        precision: 0.9003809171,
        precision_std: 0.1263768062,
        f_beta: 0.7484505889,
        f_beta_std: 0.1596590963,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.60275,
        loss_std: 0.4034186463,
        price_mean: 21.2913333333,
        price_std: 7.2702848332,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7374007289,
        recall_std: 0.171528626,
        precision: 0.9038954703,
        precision_std: 0.1241547681,
        f_beta: 0.7558093086,
        f_beta_std: 0.1599061123,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.5881538462,
        loss_std: 0.3999111144,
        price_mean: 21.8073846154,
        price_std: 7.2101887902,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7448876764,
        recall_std: 0.1701019727,
        precision: 0.9080846632,
        precision_std: 0.1216160339,
        f_beta: 0.7630804723,
        f_beta_std: 0.1584952589,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.5733571429,
        loss_std: 0.3956109393,
        price_mean: 22.5355714286,
        price_std: 7.4274365191,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7512102223,
        recall_std: 0.1685293424,
        precision: 0.9103472202,
        precision_std: 0.1197994434,
        f_beta: 0.7690230827,
        f_beta_std: 0.1567472343,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.5534,
        loss_std: 0.3938169287,
        price_mean: 23.4332,
        price_std: 7.9227106742,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7595618012,
        recall_std: 0.1681190511,
        precision: 0.9144743368,
        precision_std: 0.1178629113,
        f_beta: 0.7769816316,
        f_beta_std: 0.1561860383,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 2,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.5361875,
        loss_std: 0.3920297691,
        price_mean: 24.468625,
        price_std: 8.6560865499,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7669469177,
        recall_std: 0.1680081259,
        precision: 0.9179699883,
        precision_std: 0.1160775681,
        f_beta: 0.7839907719,
        f_beta_std: 0.1559979769,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.5433529412,
        loss_std: 0.3927653754,
        price_mean: 23.8389411765,
        price_std: 8.7674502328,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7638411164,
        recall_std: 0.1687511001,
        precision: 0.9172541576,
        precision_std: 0.1164604624,
        f_beta: 0.7811819304,
        f_beta_std: 0.1567570205,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.5397222222,
        loss_std: 0.3918083865,
        price_mean: 23.525,
        price_std: 8.6183098046,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7648660907,
        recall_std: 0.168524761,
        precision: 0.9181827185,
        precision_std: 0.1150377706,
        f_beta: 0.7822029057,
        f_beta_std: 0.1564522633,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.5334736842,
        loss_std: 0.3893186178,
        price_mean: 23.4715263158,
        price_std: 8.3915218673,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7681045387,
        recall_std: 0.1680237693,
        precision: 0.9195138779,
        precision_std: 0.1139438061,
        f_beta: 0.7852575032,
        f_beta_std: 0.155920868,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.52375,
        loss_std: 0.3880572606,
        price_mean: 23.64985,
        price_std: 8.2159237142,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7721269397,
        recall_std: 0.1679899403,
        precision: 0.9204286242,
        precision_std: 0.1128662621,
        f_beta: 0.7889162234,
        f_beta_std: 0.1557359233,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.5091428571,
        loss_std: 0.3875591857,
        price_mean: 24.0236666667,
        price_std: 8.1903496863,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7784232381,
        recall_std: 0.167810579,
        precision: 0.9228895919,
        precision_std: 0.1113581163,
        f_beta: 0.7948475392,
        f_beta_std: 0.1555393848,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.495,
        loss_std: 0.3865259018,
        price_mean: 24.5684090909,
        price_std: 8.3823879065,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7844590763,
        recall_std: 0.1675576621,
        precision: 0.9256099456,
        precision_std: 0.1098383729,
        f_beta: 0.8005741429,
        f_beta_std: 0.1552774082,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.4825652174,
        loss_std: 0.3849313125,
        price_mean: 25.2610869565,
        price_std: 8.8184527945,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7897390001,
        recall_std: 0.1667741732,
        precision: 0.9277097733,
        precision_std: 0.1087662203,
        f_beta: 0.8055556075,
        f_beta_std: 0.1545524746,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 3,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.46775,
        loss_std: 0.3850561918,
        price_mean: 26.0835416667,
        price_std: 9.4911973449,
        algorithm: 'Crowd-Ensemble',
        recall: 0.796177695,
        recall_std: 0.1669589389,
        precision: 0.9300101658,
        precision_std: 0.1075356696,
        f_beta: 0.8115499549,
        f_beta_std: 0.1546904741,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.46904,
        loss_std: 0.3843975525,
        price_mean: 25.64408,
        price_std: 9.5454745798,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7957736175,
        recall_std: 0.1669461807,
        precision: 0.9295160506,
        precision_std: 0.1070576855,
        f_beta: 0.8111128361,
        f_beta_std: 0.154562792,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.4651538462,
        loss_std: 0.3839886509,
        price_mean: 25.4348076923,
        price_std: 9.4185807543,
        algorithm: 'Crowd-Ensemble',
        recall: 0.7978785744,
        recall_std: 0.1666529179,
        precision: 0.9303295081,
        precision_std: 0.1062489859,
        f_beta: 0.8130387346,
        f_beta_std: 0.1541114515,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.459,
        loss_std: 0.3809667527,
        price_mean: 25.4187037037,
        price_std: 9.2428817549,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8003585057,
        recall_std: 0.1656772906,
        precision: 0.931229059,
        precision_std: 0.1055128686,
        f_beta: 0.8153527853,
        f_beta_std: 0.1530882268,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.4516071429,
        loss_std: 0.3784308617,
        price_mean: 25.5832142857,
        price_std: 9.1165076151,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8032913575,
        recall_std: 0.16504179,
        precision: 0.9320894641,
        precision_std: 0.1047263588,
        f_beta: 0.8180822762,
        f_beta_std: 0.1524405918,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.4452068966,
        loss_std: 0.3763107556,
        price_mean: 25.9079310345,
        price_std: 9.1212483565,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8058662104,
        recall_std: 0.1643912834,
        precision: 0.9338649531,
        precision_std: 0.1036776808,
        f_beta: 0.8206188479,
        f_beta_std: 0.1518402899,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.4368,
        loss_std: 0.3748143007,
        price_mean: 26.3781,
        price_std: 9.3185182329,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8095609298,
        recall_std: 0.1637611984,
        precision: 0.9358657509,
        precision_std: 0.1025996963,
        f_beta: 0.8241752021,
        f_beta_std: 0.1512573494,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.4280967742,
        loss_std: 0.3728044419,
        price_mean: 26.9788064516,
        price_std: 9.7395640193,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8133254237,
        recall_std: 0.1629918918,
        precision: 0.937329887,
        precision_std: 0.101605553,
        f_beta: 0.8277064502,
        f_beta_std: 0.1505003624,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 4,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.41840625,
        loss_std: 0.3718664377,
        price_mean: 27.69821875,
        price_std: 10.3893664816,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8174582692,
        recall_std: 0.1626032557,
        precision: 0.9390626335,
        precision_std: 0.1005970435,
        f_beta: 0.8315972934,
        f_beta_std: 0.1501380185,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.4183333333,
        loss_std: 0.3702602825,
        price_mean: 27.3624848485,
        price_std: 10.4055824997,
        algorithm: 'Crowd-Ensemble',
        recall: 0.817493197,
        recall_std: 0.1624323374,
        precision: 0.9382363159,
        precision_std: 0.1013823825,
        f_beta: 0.8314953135,
        f_beta_std: 0.1499326128,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.4153823529,
        loss_std: 0.367075286,
        price_mean: 27.2108529412,
        price_std: 10.2884244567,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8188536121,
        recall_std: 0.1611869492,
        precision: 0.9385944807,
        precision_std: 0.1009525896,
        f_beta: 0.8327883659,
        f_beta_std: 0.1487716508,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.4102285714,
        loss_std: 0.3653623709,
        price_mean: 27.2195714286,
        price_std: 10.1405177996,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8210343292,
        recall_std: 0.1604986686,
        precision: 0.9392146837,
        precision_std: 0.100876819,
        f_beta: 0.8347990107,
        f_beta_std: 0.1481371306,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.40275,
        loss_std: 0.364286889,
        price_mean: 27.3815555556,
        price_std: 10.044521659,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8244051427,
        recall_std: 0.1600060191,
        precision: 0.9402144322,
        precision_std: 0.1000223529,
        f_beta: 0.8379089941,
        f_beta_std: 0.1476507287,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.3956486486,
        loss_std: 0.362981253,
        price_mean: 27.6820540541,
        price_std: 10.0705694891,
        algorithm: 'Crowd-Ensemble',
        recall: 0.827539585,
        recall_std: 0.1594794847,
        precision: 0.941524381,
        precision_std: 0.0991594926,
        f_beta: 0.8408537785,
        f_beta_std: 0.1471351797,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.3880526316,
        loss_std: 0.3617747153,
        price_mean: 28.1117368421,
        price_std: 10.2751535593,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8308033472,
        recall_std: 0.1589874465,
        precision: 0.9426243508,
        precision_std: 0.0983277571,
        f_beta: 0.8438742948,
        f_beta_std: 0.1466320056,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.3812820513,
        loss_std: 0.3606168468,
        price_mean: 28.6601538462,
        price_std: 10.6911439256,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8337179985,
        recall_std: 0.1585912922,
        precision: 0.9438727014,
        precision_std: 0.0974903555,
        f_beta: 0.8466108233,
        f_beta_std: 0.1462378378,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 5,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.37365,
        loss_std: 0.3599870519,
        price_mean: 29.318675,
        price_std: 11.3294042206,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8369123501,
        recall_std: 0.1583010554,
        precision: 0.9452258838,
        precision_std: 0.0966595737,
        f_beta: 0.8496103557,
        f_beta_std: 0.1459674242,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.3745609756,
        loss_std: 0.3582313293,
        price_mean: 29.045,
        price_std: 11.3235047201,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8364481169,
        recall_std: 0.1575761051,
        precision: 0.9452519269,
        precision_std: 0.0962877202,
        f_beta: 0.8492292933,
        f_beta_std: 0.1452235308,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.3722619048,
        loss_std: 0.3564786482,
        price_mean: 28.9280952381,
        price_std: 11.2129366694,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8373737783,
        recall_std: 0.1567457722,
        precision: 0.9460892771,
        precision_std: 0.0955479668,
        f_beta: 0.8501678069,
        f_beta_std: 0.1443731227,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.3692325581,
        loss_std: 0.3556959988,
        price_mean: 28.9531860465,
        price_std: 11.0829811008,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8388859706,
        recall_std: 0.1562918395,
        precision: 0.9466526897,
        precision_std: 0.0948750701,
        f_beta: 0.8515747455,
        f_beta_std: 0.1438877546,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.3648636364,
        loss_std: 0.3545509061,
        price_mean: 29.1139772727,
        price_std: 11.0069392926,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8407775987,
        recall_std: 0.1557717716,
        precision: 0.9474659419,
        precision_std: 0.0942348732,
        f_beta: 0.8533456656,
        f_beta_std: 0.1433375777,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.3596666667,
        loss_std: 0.3530516173,
        price_mean: 29.4003333333,
        price_std: 11.0484578562,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8429832846,
        recall_std: 0.1551771537,
        precision: 0.9483410034,
        precision_std: 0.0935586869,
        f_beta: 0.8554188038,
        f_beta_std: 0.1427880607,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.3538695652,
        loss_std: 0.3519390763,
        price_mean: 29.8053695652,
        price_std: 11.2604401062,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8452917602,
        recall_std: 0.1547125605,
        precision: 0.9493085574,
        precision_std: 0.0928653547,
        f_beta: 0.8575839331,
        f_beta_std: 0.1423308962,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.3480212766,
        loss_std: 0.3509793586,
        price_mean: 30.3201489362,
        price_std: 11.6743132915,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8478762526,
        recall_std: 0.1543037469,
        precision: 0.9502022056,
        precision_std: 0.0921831052,
        f_beta: 0.8599775895,
        f_beta_std: 0.1419365459,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 6,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.3421666667,
        loss_std: 0.3501176786,
        price_mean: 30.9386666667,
        price_std: 12.3057225295,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8504307036,
        recall_std: 0.1539185584,
        precision: 0.9511639021,
        precision_std: 0.0914919064,
        f_beta: 0.8623560793,
        f_beta_std: 0.1415747371,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.3409387755,
        loss_std: 0.3486410006,
        price_mean: 30.7065510204,
        price_std: 12.2852399801,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8509379339,
        recall_std: 0.1532932839,
        precision: 0.9509665029,
        precision_std: 0.0913813322,
        f_beta: 0.8627798613,
        f_beta_std: 0.1409496632,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.33918,
        loss_std: 0.3466899589,
        price_mean: 30.61584,
        price_std: 12.1783595404,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8516437019,
        recall_std: 0.1524243553,
        precision: 0.9515395249,
        precision_std: 0.0908341641,
        f_beta: 0.863502941,
        f_beta_std: 0.1401171314,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.3366470588,
        loss_std: 0.3454169588,
        price_mean: 30.6528235294,
        price_std: 12.0612083528,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8528197141,
        recall_std: 0.1518196717,
        precision: 0.9522692199,
        precision_std: 0.0902154306,
        f_beta: 0.8646481764,
        f_beta_std: 0.1395270871,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.3323076923,
        loss_std: 0.3442696583,
        price_mean: 30.8144807692,
        price_std: 12.000351474,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8546833626,
        recall_std: 0.1513221364,
        precision: 0.9529348163,
        precision_std: 0.0896092003,
        f_beta: 0.8663799653,
        f_beta_std: 0.1390437262,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.3275849057,
        loss_std: 0.3432357369,
        price_mean: 31.0915660377,
        price_std: 12.0533671644,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8567397697,
        recall_std: 0.1508884343,
        precision: 0.9537222097,
        precision_std: 0.0890183208,
        f_beta: 0.8683009601,
        f_beta_std: 0.1386481849,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.3231481481,
        loss_std: 0.3419569178,
        price_mean: 31.4790555556,
        price_std: 12.2699290362,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8585740741,
        recall_std: 0.1503403341,
        precision: 0.954434144,
        precision_std: 0.0884478457,
        f_beta: 0.8700157321,
        f_beta_std: 0.1381326654,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.3189818182,
        loss_std: 0.3409314242,
        price_mean: 31.9703454545,
        price_std: 12.6825713506,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8603553073,
        recall_std: 0.1499050336,
        precision: 0.9550868566,
        precision_std: 0.0879001418,
        f_beta: 0.8716713351,
        f_beta_std: 0.1377134153,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 7,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.3138214286,
        loss_std: 0.3402074528,
        price_mean: 32.5601607143,
        price_std: 13.3082248793,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8626118594,
        recall_std: 0.1495845649,
        precision: 0.955888877,
        precision_std: 0.0873146087,
        f_beta: 0.8737613035,
        f_beta_std: 0.1374222409,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.3131052632,
        loss_std: 0.3388774132,
        price_mean: 32.3582807018,
        price_std: 13.2772110469,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8629974061,
        recall_std: 0.149027157,
        precision: 0.9558664347,
        precision_std: 0.0869707351,
        f_beta: 0.8741029195,
        f_beta_std: 0.1368493649,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.3107068966,
        loss_std: 0.3373911323,
        price_mean: 32.2855,
        price_std: 13.173736055,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8642008155,
        recall_std: 0.1483649176,
        precision: 0.9562563949,
        precision_std: 0.0865656767,
        f_beta: 0.875217993,
        f_beta_std: 0.1362115875,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.307440678,
        loss_std: 0.3360358017,
        price_mean: 32.3315084746,
        price_std: 13.0663160395,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8656458805,
        recall_std: 0.1477780664,
        precision: 0.9568706933,
        precision_std: 0.0860500228,
        f_beta: 0.8765791169,
        f_beta_std: 0.1356603519,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.3040333333,
        loss_std: 0.3348861481,
        price_mean: 32.49335,
        price_std: 13.0164759674,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8672222934,
        recall_std: 0.1472572842,
        precision: 0.9574752294,
        precision_std: 0.0855303712,
        f_beta: 0.8780517734,
        f_beta_std: 0.1351753242,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.3006557377,
        loss_std: 0.3338418633,
        price_mean: 32.7639508197,
        price_std: 13.0784026559,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8687199149,
        recall_std: 0.1467915621,
        precision: 0.9580513576,
        precision_std: 0.0850305868,
        f_beta: 0.879449767,
        f_beta_std: 0.1347354259,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.2967580645,
        loss_std: 0.332970462,
        price_mean: 33.1389516129,
        price_std: 13.2990236616,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8704029805,
        recall_std: 0.1464341202,
        precision: 0.9585551375,
        precision_std: 0.0845604024,
        f_beta: 0.8809879762,
        f_beta_std: 0.134374885,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.2924761905,
        loss_std: 0.3321678127,
        price_mean: 33.6129365079,
        price_std: 13.7107873222,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8722484359,
        recall_std: 0.1460844996,
        precision: 0.9591495004,
        precision_std: 0.0840533168,
        f_beta: 0.8826849079,
        f_beta_std: 0.1340452613,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 8,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.288453125,
        loss_std: 0.3313423659,
        price_mean: 34.181515625,
        price_std: 14.3323129692,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8740389038,
        recall_std: 0.1457090905,
        precision: 0.9597877895,
        precision_std: 0.0835478131,
        f_beta: 0.88434308,
        f_beta_std: 0.1337032028,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.2891692308,
        loss_std: 0.3300460373,
        price_mean: 34.0023384615,
        price_std: 14.2936977745,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8735090568,
        recall_std: 0.1453772603,
        precision: 0.9595814126,
        precision_std: 0.0836042736,
        f_beta: 0.8838440312,
        f_beta_std: 0.1333254852,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.2876818182,
        loss_std: 0.3291065803,
        price_mean: 33.9437121212,
        price_std: 14.1928826276,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8741424846,
        recall_std: 0.1449596086,
        precision: 0.959959929,
        precision_std: 0.0831852578,
        f_beta: 0.8844594344,
        f_beta_std: 0.132909732,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.2854626866,
        loss_std: 0.3280639876,
        price_mean: 33.9967910448,
        price_std: 14.093165995,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8751204467,
        recall_std: 0.1444813454,
        precision: 0.9604017732,
        precision_std: 0.0827544524,
        f_beta: 0.8853836288,
        f_beta_std: 0.1324453505,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.2826764706,
        loss_std: 0.3270971452,
        price_mean: 34.1588382353,
        price_std: 14.0519000381,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8763273483,
        recall_std: 0.144077871,
        precision: 0.9607753954,
        precision_std: 0.0823692603,
        f_beta: 0.886490069,
        f_beta_std: 0.1320437545,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.278884058,
        loss_std: 0.3263341417,
        price_mean: 34.4246521739,
        price_std: 14.1208673404,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8779687969,
        recall_std: 0.1437347372,
        precision: 0.9612955587,
        precision_std: 0.0819307963,
        f_beta: 0.8879995743,
        f_beta_std: 0.1317329296,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.2756142857,
        loss_std: 0.3253508784,
        price_mean: 34.7901571429,
        price_std: 14.3446277989,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8794298043,
        recall_std: 0.1432989226,
        precision: 0.9618484793,
        precision_std: 0.0814730328,
        f_beta: 0.8893603302,
        f_beta_std: 0.1313384179,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.272028169,
        loss_std: 0.3245418861,
        price_mean: 35.2508591549,
        price_std: 14.7555902978,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8809980856,
        recall_std: 0.142941963,
        precision: 0.9623576556,
        precision_std: 0.081026372,
        f_beta: 0.8908029884,
        f_beta_std: 0.1310089049,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 9,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.2686666667,
        loss_std: 0.3236641778,
        price_mean: 35.8030416667,
        price_std: 15.3737369779,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8824597524,
        recall_std: 0.1425519194,
        precision: 0.962880466,
        precision_std: 0.0805822256,
        f_beta: 0.8921570147,
        f_beta_std: 0.130652879,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 3,
        lr: 5,
        loss_mean: 0.269109589,
        loss_std: 0.3228446364,
        price_mean: 35.6415205479,
        price_std: 15.329466254,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8822003666,
        recall_std: 0.1423162943,
        precision: 0.9629981959,
        precision_std: 0.0803654211,
        f_beta: 0.891950118,
        f_beta_std: 0.1303908344,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 4,
        lr: 5,
        loss_mean: 0.2675810811,
        loss_std: 0.3215351062,
        price_mean: 35.5942297297,
        price_std: 15.2309156555,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8828009213,
        recall_std: 0.1420562141,
        precision: 0.9631763499,
        precision_std: 0.0800839646,
        f_beta: 0.8924892507,
        f_beta_std: 0.1301280307,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 5,
        lr: 5,
        loss_mean: 0.2660533333,
        loss_std: 0.3202534785,
        price_mean: 35.6530133333,
        price_std: 15.1374841234,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8834533689,
        recall_std: 0.1415930056,
        precision: 0.9633391742,
        precision_std: 0.0798958097,
        f_beta: 0.893076143,
        f_beta_std: 0.1296522759,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 6,
        lr: 5,
        loss_mean: 0.2637894737,
        loss_std: 0.3190311945,
        price_mean: 35.8160921053,
        price_std: 15.1037462107,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8843369094,
        recall_std: 0.1410964501,
        precision: 0.963718151,
        precision_std: 0.079522878,
        f_beta: 0.8939079946,
        f_beta_std: 0.1291782378,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 7,
        lr: 5,
        loss_mean: 0.2612727273,
        loss_std: 0.3180197509,
        price_mean: 36.0782467532,
        price_std: 15.1783931414,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8854192171,
        recall_std: 0.1406471838,
        precision: 0.9641893438,
        precision_std: 0.0791115253,
        f_beta: 0.8949279233,
        f_beta_std: 0.1287662852,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 8,
        lr: 5,
        loss_mean: 0.2583846154,
        loss_std: 0.3171410036,
        price_mean: 36.4364230769,
        price_std: 15.4048172919,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8866674038,
        recall_std: 0.1402615693,
        precision: 0.9646199648,
        precision_std: 0.0787132469,
        f_beta: 0.8960816256,
        f_beta_std: 0.1284098679,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 9,
        lr: 5,
        loss_mean: 0.2555696203,
        loss_std: 0.3162567729,
        price_mean: 36.8865949367,
        price_std: 15.8149157099,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8878918269,
        recall_std: 0.1398691802,
        precision: 0.9650396839,
        precision_std: 0.0783208241,
        f_beta: 0.8972131027,
        f_beta_std: 0.1280478424,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      },
      {
        worker_tests: 10,
        votes_per_item: 10,
        lr: 5,
        loss_mean: 0.252575,
        loss_std: 0.3154692844,
        price_mean: 37.42555,
        price_std: 16.4296227041,
        algorithm: 'Crowd-Ensemble',
        recall: 0.8892176983,
        recall_std: 0.1395175682,
        precision: 0.9654539606,
        precision_std: 0.077929826,
        f_beta: 0.8984298246,
        f_beta_std: 0.1277247992,
        baseround_items: 20,
        total_items: 20,
        theta: 0.3,
        filters_num: 3
      }
    ];
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
  profile: PropTypes.object,
  fetchResults: PropTypes.func,
  aggregationStrategies: PropTypes.arrayOf(PropTypes.object),
  fetchAggregationStrategies: PropTypes.func,
  cleanResults: PropTypes.func
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
  aggregationStrategies: state.job.aggregationStrategies.strategies
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
  fetchAggregationStrategies: () => dispatch(actions.fetchAggregationStrategies())
});

export default connect(mapStateToProps, mapDispatchToProps)(JobDashboard);
