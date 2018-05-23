import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';

class CritChooser extends React.Component {
  
  render() {
    return(
      <div
      style={{textAlign: 'right'}}>
      <Form.Select 
          disabled={this.props.disabled}
          label="Select Criteria  "
          value={this.props.chosencriteria}
          options={Object.entries(this.props.options).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </div>
    )
  }

}

CritChooser.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(CritChooser);
