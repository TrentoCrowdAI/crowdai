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
import {actions as experimentActions} from 'src/components/admin/experiments/actions';
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
    let project = this.props.item.project || {};

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
                  {!this.props.item.id && <p>Loading information...</p>}
                  {this.props.item.id &&
                    !project.consent && (
                      <p style={{textAlign: 'justify'}}>
                        The information is available{' '}
                        <a href={project.consentUrl} target="_blank">
                          here
                        </a>
                      </p>
                    )}

                  {project.consent && <FileRenderer content={project.consent} format={project.consentFormat} />}
                </Segment>
              </Accordion.Content>
            </Accordion>
          </div>

          {!this.props.assigmentStatusLoading && <PaymentInstructions job={this.props.item} />}

          {this.props.assigmentStatusLoading && (
            <Segment vertical style={{borderBottom: 0}}>
              <Grid>
                <Grid.Row>
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                </Grid.Row>
              </Grid>
            </Segment>
          )}

          {this.renderRedirectBtn()}
          {this.renderFinalStep()}
        </Grid.Row>
      </Container>
    );
  }

  renderRedirectBtn() {
    const {assignmentId, hitId, workerId, experimentId} = this.props.session;

    if (this.props.hasAcceptedHit && this.props.assignmentStatus && !this.props.assignmentStatus.data.finished) {
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
            to={`/task/${experimentId}?assignmentId=${assignmentId}&workerId=${workerId}&hitId=${hitId}`}
            target="_blank">
            Open
          </Button>
        </Segment>
      );
    }
  }

  renderFinalStep() {
    if (this.props.assignmentStatus && this.props.assignmentStatus.data.finished) {
      return (
        <React.Fragment>
          <Message icon style={{marginTop: 20}}>
            <RewardWidget style={{marginRight: 20}} />
            <Message.Content>
              <Message.Header>Finished</Message.Header>
              {!this.props.assignmentStatus.data.initialTestFailed && (
                <div>
                  <p>Please click the following button to submit your work</p>
                  <Button type="button" positive onClick={() => this.submit()}>
                    Submit
                  </Button>
                </div>
              )}
              {this.props.assignmentStatus.data.initialTestFailed && (
                <p>
                  Thank you for participating, but you failed to pass the qualification test. Please return the HIT to
                  finish.
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
    const {experimentId} = this.props.match.params;
    this.props.fetchItem(experimentId);
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
  assigmentStatusLoading: PropTypes.bool,
  checkPolling: PropTypes.func,
  match: PropTypes.object,
  fetchItem: PropTypes.func,
  item: PropTypes.object
};

const mapStateToProps = state => ({
  session: state.questionForm.session,
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  assignmentStatus: state.questionForm.assignmentStatus,
  assigmentStatusLoading: state.questionForm.assigmentStatusLoading,
  item: state.experiment.form.item
});

const mapDispatchToProps = dispatch => ({
  checkAssignmentStatus: () => dispatch(actions.checkAssignmentStatus()),
  checkPolling: () => dispatch(actions.checkPolling()),
  fetchItem: id => dispatch(experimentActions.fetchItem(id, true))
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
