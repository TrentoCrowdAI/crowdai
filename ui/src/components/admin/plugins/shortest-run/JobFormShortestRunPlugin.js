import React from 'react';
import {connect} from 'react-redux';
import {Segment, Form, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {actions} from 'src/components/admin/jobs/actions';
import NumberInput from 'src/components/core/form/NumberInput';

class JobFormShortestRunPlugin extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const {item} = this.props;

    if (!item.data.shortestRun) {
      return null;
    }
    return (
      <Segment>
        <Header as="h3">Shortest Run configurations</Header>

        <Form.Group>
          <NumberInput
            width="8"
            min="20"
            max="50"
            label="Baseline size"
            name="data.shortestRun.baselineSize"
            value={item.data.shortestRun.baselineSize}
            placeholder="The number of papers for the baseline round"
            onChange={this.handleChange}
            required
          />
        </Form.Group>
      </Segment>
    );
  }

  componentDidMount() {
    if (!this.props.item.id) {
      this.props.setInputValue('data.shortestRun', {baselineSize: 20});
    }
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }
}

JobFormShortestRunPlugin.propTypes = {
  item: PropTypes.object,
  setInputValue: PropTypes.func
};

const mapStateToProps = state => ({
  item: state.job.form.item
});

const mapDispatchToProps = dispatch => ({
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobFormShortestRunPlugin);
