import React from 'react';
import {Grid, Button, Segment} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Instructions from 'src/components/Instructions';

class WelcomePage extends React.Component {
  render() {
    const {assignmentId, hitId, workerId} = this.props.session;

    return (
      <Grid.Row centered>
        <Instructions />

        {this.props.hasAcceptedHit && (
          <Segment>
            <p>Please click on the following button to start. It will open a new window/tab.</p>
            <Button
              as={Link}
              positive
              to={`task?assignmentId=${assignmentId}&workerId=${workerId}&hitId=${hitId}`}
              target="_blank">
              Open
            </Button>
          </Segment>
        )}
      </Grid.Row>
    );
  }
}

WelcomePage.propTypes = {
  /** @ignore */
  session: PropTypes.object,
  /** @ignore */
  hasAcceptedHit: PropTypes.object
};

const mapStateToProps = state => ({
  session: state.questionForm.session,
  hasAcceptedHit: state.questionForm.hasAcceptedHit
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
