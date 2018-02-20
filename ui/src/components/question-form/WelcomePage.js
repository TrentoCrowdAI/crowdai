import React from 'react';
import {Grid, Button, Segment, Dimmer, Loader, Message, Accordion, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import showdown from 'showdown';
import sanitizeHtml from 'sanitize-html';

import Instructions from './Instructions';
import {actions} from './actions';
import {actions as experimentActions} from 'src/components/admin/experiments/actions';
import config from 'src/config/config.json';
import RewardWidget from 'src/components/reward-widget/RewardWidget';
import {ConsentFormats} from 'src/utils/constants';

class WelcomePage extends React.Component {
  state = {open: true};

  render() {
    const {open} = this.state;

    return (
      <Grid.Row centered>
        <div>
          <Accordion>
            <Accordion.Title active={open} onClick={() => this.setState({open: !this.state.open})}>
              <Header as="h1" style={{display: 'inline'}}>
                Information of Consent {open ? '(click to collapse)' : '(click to expand)'}
              </Header>
            </Accordion.Title>
            <Accordion.Content active={open}>
              <Segment>
                {!this.props.item.id && <p>Loading information...</p>}
                {this.props.item.id &&
                  !this.props.item.consent && (
                    <p style={{textAlign: 'justify'}}>
                      The information is available{' '}
                      <a href={this.props.item.consentUrl} target="_blank">
                        here
                      </a>
                    </p>
                  )}

                {this.props.item.consent && this.renderConsent()}
              </Segment>
            </Accordion.Content>
          </Accordion>
        </div>
        <Instructions />

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
    );
  }

  renderRedirectBtn() {
    const {assignmentId, hitId, workerId, experimentId} = this.props.session;

    if (this.props.hasAcceptedHit && this.props.assignmentStatus && !this.props.assignmentStatus.finished) {
      return (
        <Segment>
          <p>Please click on the following button to start. It will open a new window/tab.</p>
          <Button
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
    if (this.props.assignmentStatus && this.props.assignmentStatus.finished) {
      return (
        <React.Fragment>
          <Message icon style={{marginTop: 20}}>
            <RewardWidget style={{marginRight: 20}} />
            <Message.Content>
              <Message.Header>Finished</Message.Header>
              <p>Thank you for completing the tasks. Please click the following button to submit your work</p>
              <Button type="button" positive onClick={() => this.submit()}>
                Submit
              </Button>
            </Message.Content>
          </Message>
          <form id="turkForm" method="POST" />
        </React.Fragment>
      );
    }
  }

  renderConsent() {
    const {consent, consentFormat} = this.props.item;
    let converter = new showdown.Converter();
    switch (consentFormat) {
      case ConsentFormats.MARKDOWN:
        return <div dangerouslySetInnerHTML={{__html: converter.makeHtml(consent)}} />;
      case ConsentFormats.HTML:
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(consent, {
                // by default sanitize does not allow h1, h2 and br.
                allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'br']
              })
            }}
          />
        );
      default:
        // by default we assume PLAIN_TEXT
        return <p>{consent}</p>;
    }
  }

  submit() {
    const {session} = this.props;
    const url = `${config.mturk[config.mode]}/?assignmentId=${session.assignmentId}`;
    let form = document.getElementById('turkForm');
    form.action = `${url}`;
    form.submit();
  }

  componentDidMount() {
    this.props.checkAssignmentStatus();
    const {experimentId} = this.props.match.params;
    this.props.fetchItem(experimentId);
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
