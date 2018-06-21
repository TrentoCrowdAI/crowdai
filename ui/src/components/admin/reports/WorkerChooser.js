import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';

class WorkerChooser extends React.Component {
  
  render() {
    return(
      <React.Fragment
      style={{textAlign: 'left'}}>
      <Form.Select 
          disabled={this.props.disabled}
          label="Select Worker  "
          value={this.props.chosenworker}
          options={Object.entries(this.props.options).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </React.Fragment>
    )
  }

}

WorkerChooser.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(WorkerChooser);
