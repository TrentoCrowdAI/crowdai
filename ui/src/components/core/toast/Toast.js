import React from 'react';
import {Message} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {toast} from 'react-toastify';

import ToastTypes from './types';
import config from 'src/config/config.json';

class Toast extends React.Component {
  render() {
    if (!this.props.visible) {
      return null;
    }
    toast(<Msg {...this.props} />, {
      autoClose: config.toastDismissTimeout,
      closeButton: false,
      hideProgressBar: true
    });
    return null;
  }
}

// eslint-disable-next-line react/prop-types
const Msg = ({closeToast, type, header, message}) => (
  <Message
    success={type === ToastTypes.SUCCESS}
    info={type === ToastTypes.INFO}
    warning={type === ToastTypes.WARNING}
    error={type === ToastTypes.ERROR}
    header={header}
    content={message}
    onDismiss={closeToast}
  />
);

Toast.propTypes = {
  header: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  visible: PropTypes.bool
};

export default Toast;
