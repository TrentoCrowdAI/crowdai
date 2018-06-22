import React from 'react';
import {connect} from 'react-redux';
import { Form } from 'semantic-ui-react';

class MetricChooser extends React.Component {
  
  render() {
    return(
      <React.Fragment>
      <Form.Select 
          label="Select Metric  "
          value={this.props.chosenmetric}
          options={Object.entries(this.props.options).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </React.Fragment>
    )
  }

}

MetricChooser.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(MetricChooser);
