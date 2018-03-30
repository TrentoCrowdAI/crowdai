import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Link} from 'react-router-dom';
import DataTable from 'src/components/core/table/DataTable';
import {ExperimentStatus} from 'src/utils/constants';
import {
  Step,
  Icon,
  Segment,
  Grid,
  Form,
  Button,
  Statistic,
  Header,
  Image,
  Accordion,
  Message
} from 'semantic-ui-react';


class JobChooser extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log(this.props)
    return(
      <div
      style={{textAlign: 'right'}}>
      <Form.Select 
          label="Select Job  "
          value={this.props.chosenjob}
          options={Object.entries(this.props.options).map(([key, val]) => ({text: val, value: key}))}
          onChange={this.props.onChange}
        />
      </div>
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
