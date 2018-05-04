import React from 'react';
import {Statistic} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';

class RewardWidget extends React.Component {
  render() {
    if (this.props.loading) {
      return <div style={{marginRight: '10px'}}>Calculating reward...</div>;
    }
    return <Statistic label="Current reward" value={`${this.props.reward} $`} style={this.props.style} />;
  }

  componentDidMount() {
    this.props.requestReward();
  }
}

RewardWidget.propTypes = {
  style: PropTypes.object,
  reward: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  requestReward: PropTypes.func,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  reward: state.rewardWidget.reward,
  loading: state.rewardWidget.loading
});

const mapDispatchToProps = dispatch => ({
  requestReward: _ => dispatch(actions.requestReward())
});

export default connect(mapStateToProps, mapDispatchToProps)(RewardWidget);
