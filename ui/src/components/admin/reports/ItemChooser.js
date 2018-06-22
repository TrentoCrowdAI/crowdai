import React from 'react';
import {connect} from 'react-redux';
import { Form } from 'semantic-ui-react';

class ItemChooser extends React.Component {
  
  render() {
    return(
      <React.Fragment>
      <Form.Select 
          disabled={this.props.disabled}
          label="Select Item  "
          value={this.props.chosenitem}
          options={Object.entries(this.props.options).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </React.Fragment>
    )
  }

}

ItemChooser.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(ItemChooser);
