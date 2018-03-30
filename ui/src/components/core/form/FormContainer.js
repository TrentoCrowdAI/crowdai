import React from 'react';
import {Container, Grid} from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Renders a basic form layout.
 *
 * @param {Object} props
 * @return {JSX.Element}
 */
const FormContainer = props => (
  <Container>
    <Grid container centered>
      <Grid.Row>
        <Grid.Column width="12">
          <h1 style={{marginTop: '20px'}}>{props.title}</h1>
          {props.children}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

FormContainer.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element
};

export default FormContainer;
