import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Toast from './Toast';

class ToastManager extends React.Component {
  render() {
    const {item} = this.props;
    return <Toast header={item.header} message={item.message} type={item.type} visible={this.props.visible} />;
  }
}

ToastManager.propTypes = {
  item: PropTypes.object,
  visible: PropTypes.bool
};

const mapStateToProps = state => ({
  item: state.toast.item,
  visible: state.toast.visible
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ToastManager);
