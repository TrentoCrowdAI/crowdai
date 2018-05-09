import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';

class WorkerChooser extends React.Component {
  
  render() {
    //console.log(this.props)
    return(
      <div
      style={{textAlign: 'right'}}>
      <Form.Select 
          disabled={this.props.disabled}
          label="Select Worker  "
          value={this.props.chosenworker}
          options={Object.entries(this.props.options).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </div>
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