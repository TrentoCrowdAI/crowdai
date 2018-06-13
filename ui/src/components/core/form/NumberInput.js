import React from 'react';
import {Form} from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Tiny wrapper around {@link Form.Input} to better deal with number inputs.
 *
 * @param {Object} props
 * @return {JSX.Element}
 */
const NumberInput = props => {
  return (
    <Form.Input
      {...props}
      type="number"
      onChange={(event, element) => {
        let {value} = element;
        let min;
        let max;
        let minLen;

        if (props.min) {
          min = Number(props.min);
          minLen = `${min}`.length;
        }

        if (props.max) {
          max = Number(props.max);
        }

        if (value[0] === '-') {
          ++minLen;
        }

        if ((max && Number(value) > max) || (min && Number(value) < min && minLen === value.length)) {
          return;
        }
        element.value = value ? Number(value) : value;
        props.onChange(event, element);
      }}
    />
  );
};

NumberInput.propTypes = {
  onChange: PropTypes.func,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default NumberInput;
