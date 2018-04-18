import React from 'react';
import {Container, Form, Button, Grid, Message} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';
import {FileFormats} from 'src/utils/constants';

class ProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <Container>
        <Grid container centered>
          <Grid.Row style={{padding: 0}}>
            <Grid.Column width="4">
              <h1>New project</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="10">
              <Form
                error={this.props.error !== undefined}
                loading={this.props.loading}
                success={this.props.saved}
                onSubmit={() => this.props.submit()}>
                <div style={{marginBottom: 20}}>{this.renderForm()}</div>

                {/* {this.props.error && (
                  <Message
                    error
                    header="Error"
                    content={this.props.error.message || 'Changes not saved. Please try again.'}
                  />
                )}

                {this.props.saved && <Message success header="Success" content="Changes saved!" />} */}

                <Button floated="right" positive>
                  Save
                </Button>
                <Button floated="right" type="button" onClick={() => this.props.history.push('/admin/projects')}>
                  Cancel
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  renderForm() {
    const {item} = this.props;

    return (
      <React.Fragment>
        <Form.Group>
          <Form.Input
            width={5}
            label="Name"
            name="data.name"
            value={item.data.name}
            placeholder="Experiment name"
            onChange={this.handleChange}
            required
          />

          <Form.Input
            width={6}
            label="Informed Consent URL"
            name="data.consentUrl"
            value={item.data.consentUrl}
            placeholder="URL to consent file"
            onChange={this.handleChange}
            required
          />

          <Form.Select
            width={4}
            label="Format"
            name="data.consentFormat"
            value={item.data.consentFormat}
            options={Object.values(FileFormats).map(v => ({text: v, value: v}))}
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            label="Items URL"
            name="data.itemsUrl"
            value={item.data.itemsUrl}
            placeholder="URL to items CSV file"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            label="Filters URL"
            name="data.filtersUrl"
            value={item.data.filtersUrl}
            placeholder="URL to filters CSV file"
            onChange={this.handleChange}
            required
          />

          <Form.Input
            label="Tests URL"
            name="data.testsUrl"
            value={item.data.testsUrl}
            placeholder="URL to tests CSV file"
            onChange={this.handleChange}
            required
          />
        </Form.Group>
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.props.cleanState();
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }
}

ProjectForm.propTypes = {
  item: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.any,
  saved: PropTypes.bool,
  submit: PropTypes.func,
  setInputValue: PropTypes.func,
  cleanState: PropTypes.func,
  history: PropTypes.object
};

const mapStateToProps = state => ({
  item: state.project.form.item,
  loading: state.project.form.loading,
  error: state.project.form.error,
  saved: state.project.form.saved
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(actions.submit()),
  cleanState: () => dispatch(actions.cleanState()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);
