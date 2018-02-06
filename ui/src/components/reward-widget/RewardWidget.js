import React from 'react';
import {Statistic} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';

class RewardWidget extends React.Component {
  render() {
    return <Statistic label="Expected reward" value={`${this.props.reward} $`} style={this.props.style} />;
  }

  componentDidMount() {
    this.props.requestReward();
  }
}

RewardWidget.propTypes = {
  style: PropTypes.object,

  /** @ignore */
  reward: PropTypes.number,

  /** @ignore */
  requestReward: PropTypes.func
};

const mapStateToProps = state => ({
  reward: state.rewardWidget.reward
});

const mapDispatchToProps = dispatch => ({
  requestReward: _ => dispatch(actions.requestReward())
});

export default connect(mapStateToProps, mapDispatchToProps)(RewardWidget);
