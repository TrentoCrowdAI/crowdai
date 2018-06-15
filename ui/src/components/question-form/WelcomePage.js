import React from 'react';
import {
  Grid,
  Button,
  Segment,
  Dimmer,
  Loader,
  Message,
  Accordion,
  Header,
  Checkbox,
  Form,
  Container
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// import Instructions from './Instructions';
import {actions} from './actions';
import {actions as jobActions} from 'src/components/admin/jobs/actions';
import config from 'src/config/config.json';
import RewardWidget from 'src/components/reward-widget/RewardWidget';
import FileRenderer from 'src/components/core/FileRenderer';
import PaymentInstructions from './PaymentInstructions';

class WelcomePage extends React.Component {
  state = {open: true, consentOk: false};

  constructor(props) {
    super(props);
    this.onConsentCheck = this.onConsentCheck.bind(this);
  }

  render() {
    const {open} = this.state;
    const {item} = this.props;

    return (
      <Container>
        <Grid.Row centered style={{marginBottom: '10px'}}>
          <div>
            <Accordion>
              <Accordion.Title active={open} onClick={() => this.setState({open: !this.state.open})}>
                <Header as="h1" style={{display: 'inline'}}>
                  Informed Consent {open ? '(click to collapse)' : '(click to expand)'}
                </Header>
              </Accordion.Title>
              <Accordion.Content active={open}>
                <Segment>
                  {!item.id && <p>Loading information...</p>}
                  {item.id &&
                    !item.data.consent && (
                      <p style={{textAlign: 'justify'}}>
                        The information is available{' '}
                        <a href={item.data.consentUrl} target="_blank">
                          here
                        </a>
                      </p>
                    )}

                  {item.data.consent && <FileRenderer content={item.data.consent} format={item.data.consentFormat} />}
                </Segment>
              </Accordion.Content>
            </Accordion>
          </div>

          <PaymentInstructions job={this.props.item} />

          {this.renderRedirectBtn()}
          {this.renderFinalStep()}
        </Grid.Row>
        <Dimmer active={this.props.assignmentStatusLoading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      </Container>
    );
  }

  renderRedirectBtn() {
    const {assignmentId, hitId, workerId, jobId} = this.props.session;

    if (this.props.hasAcceptedHit && this.props.assignmentStatus && !this.props.assignmentStatus.data.end) {
      return (
        <Segment>
          <p>Please click on the following button to start. It will open a new window/tab.</p>
          <Form.Field style={{marginBottom: '10px'}}>
            <Checkbox
              name="consentOk"
              label="I hereby confirm that I have read and understood the terms and conditions of this task, and that I give my consent to use of the data resulted from my work."
              onChange={this.onConsentCheck}
            />
          </Form.Field>
          <Button
            disabled={!this.state.consentOk}
            onClick={() => this.props.checkPolling()}
            as={Link}
            positive
            to={`/task/${jobId}?assignmentId=${assignmentId}&workerId=${workerId}&hitId=${hitId}`}
            target="_blank">
            Open
          </Button>
        </Segment>
      );
    }
  }

  renderFinalStep() {
    const {assignmentStatus} = this.props;

    if (assignmentStatus && assignmentStatus.data.end) {
      return (
        <React.Fragment>
          <Message icon style={{marginTop: 20}}>
            <RewardWidget style={{marginRight: 20}} />
            <Message.Content>
              <Message.Header>Finished</Message.Header>
              {!assignmentStatus.data.initialTestFailed &&
                assignmentStatus.data.solvedMinTasks && (
                  <div>
                    <p>Please click the following button to submit your work</p>
                    <Button type="button" positive onClick={() => this.submit()}>
                      Submit
                    </Button>
                  </div>
                )}

              {assignmentStatus.data.initialTestFailed && (
                <p>
                  Thank you for participating, but you failed to pass the qualification test. Please return the HIT to
                  finish.
                </p>
              )}

              {assignmentStatus.data.honeypotFailed &&
                !assignmentStatus.data.solvedMinTasks && (
                  <p>
                    Thank you for participating, but you did not solve the minimum number of tasks required. Please
                    return the HIT to finish.
                  </p>
                )}

              {assignmentStatus.data.finishedWithError &&
                !assignmentStatus.data.solvedMinTasks && (
                  <p>
                    Sorry for the inconvenience, we will look into the problem. Please return the HIT to finish.
                    Consider trying again later.
                  </p>
                )}
            </Message.Content>
          </Message>
          <form id="turkForm" method="POST" />
        </React.Fragment>
      );
    }
  }

  componentDidMount() {
    this.props.checkAssignmentStatus();
    const {jobId} = this.props.match.params;
    this.props.fetchItem(jobId);
  }

  submit() {
    const {session} = this.props;
    const url = `${config.mturk[config.mode]}?assignmentId=${session.assignmentId}&task=done`;
    let form = document.getElementById('turkForm');
    form.action = `${url}`;
    form.submit();
  }

  onConsentCheck(e, {name, checked}) {
    this.setState({
      ...this.state,
      consentOk: checked
    });
  }
}

WelcomePage.propTypes = {
  session: PropTypes.object,
  hasAcceptedHit: PropTypes.bool,
  checkAssignmentStatus: PropTypes.func,
  assignmentStatus: PropTypes.object,
  assignmentStatusLoading: PropTypes.bool,
  checkPolling: PropTypes.func,
  match: PropTypes.object,
  fetchItem: PropTypes.func,
  item: PropTypes.object
};

const mapStateToProps = state => ({
  session: state.questionForm.session,
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  assignmentStatus: state.questionForm.assignmentStatus,
  assignmentStatusLoading: state.questionForm.assignmentStatusLoading,
  item: state.job.form.item
});

const mapDispatchToProps = dispatch => ({
  checkAssignmentStatus: () => dispatch(actions.checkAssignmentStatus()),
  checkPolling: () => dispatch(actions.checkPolling()),
  fetchItem: id => dispatch(jobActions.fetchItem(id, true))
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
