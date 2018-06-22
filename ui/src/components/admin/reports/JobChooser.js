import React from 'react';
import {connect} from 'react-redux';
import { Form } from 'semantic-ui-react';

class JobChooser extends React.Component {
  
  render() {
    return(
      <React.Fragment>
      <Form.Select 
          label="Select Job  "
          value={this.props.chosenjob}
          options={Object.entries(this.props.options).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </React.Fragment>
    )
  }

}

JobChooser.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(JobChooser);
