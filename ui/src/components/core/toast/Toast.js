import React from 'react';
import {Message, Grid, Transition} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ToastTypes from 'src/components/core/toast/types';

const Toast = props => {
  return (
    <Transition.Group animation={'fade left'} duration={500}>
      {props.visible && (
        <Grid>
          <Grid.Row>
            <Grid.Column width="4" floated="right" style={{marginRight: '2em'}}>
              <Message
                success={props.type === ToastTypes.SUCCESS}
                info={props.type === ToastTypes.INFO}
                warning={props.type === ToastTypes.WARNING}
                error={props.type === ToastTypes.ERROR}
                header={props.header}
                content={props.message}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Transition.Group>
  );
};

Toast.propTypes = {
  header: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  visible: PropTypes.bool
};

export default Toast;
