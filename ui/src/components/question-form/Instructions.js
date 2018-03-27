import React from 'react';
import {connect} from 'react-redux';
import {Accordion, Header, Segment} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class Instructions extends React.Component {
  state = {open: true};

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const {open} = this.state;

    if (this.props.loading || this.finished()) {
      return null;
    }

    return (
      <div>
        <Accordion>
          <Accordion.Title active={open} onClick={this.handleClick}>
            <Header as="h1" style={{display: 'inline'}}>
              Instructions {open ? '(click to collapse)' : '(click to expand)'}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={open}>
            <Segment>
              <h2>Task</h2>
              <p style={{textAlign: 'justify'}}>
                Your task is to classify an abstract (a short summary of a scientific paper) based on some predefined
                criteria. We ask you to state if the abstract meets the given criteria. If so, then answer "yes"
                otherwise, answer "no". If it is not clear to you, then answer "not clear from the text".
              </p>
              <p>
                For instance, we ask you to state if the paper describes an <strong>intervention</strong> study. An
                intervention occurs when we perform an experiment with a set of subjects (persons).
              </p>
              <h3>Example of paper that fits the criterion (you should select YES as answer to this question):</h3>
              <p>
                Traditional approaches to mechanical ventilation use tidal volumes of 10 to 15 ml per kilogram of body
                weight and may cause stretch-induced lung injury in patients with acute lung injury and the acute
                respiratory distress syndrome. We therefore conducted a trial to determine whether ventilation with
                lower tidal volumes would improve the clinical outcomes in these patients.
              </p>
              <h3>
                Example of paper that does not fit the criterion (you should select NO as answer to this question,
                because this paper does not describe an experiment, trial or intervention):
              </h3>
              <p>
                This article presents a Bayesian approach for predicting and identifying the factors which most
                influence an individual's propensity to fall into the category of Not in Employment Education or
                Training (NEET). The approach partitions the covariates into two groups: those which have the potential
                to be changed as a result of an intervention strategy and those which must be controlled for. This
                partition allows us to develop models and identify important factors conditional on the control
                covariates, which is useful for clinicians and policy makers who wish to identify potential intervention
                strategies. Using the data obtained by O'Dea (2014) we compare the results from this approach with the
                results from O'Dea (2014) and with the results obtained using the Bayesian variable selection procedure
                of Lamnisos (2009) when the covariates are not partitioned. We find that the relative importance of
                predictive factors varies greatly depending upon the control covariates. This has enormous implications
                when deciding on what interventions are most useful to prevent young people from being NEET.
              </p>
            </Segment>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }

  handleClick() {
    this.setState({open: !this.state.open});
  }

  finished() {
    return (
      (this.props.task && this.props.task.data.finished) ||
      (this.props.assignmentStatus && this.props.assignmentStatus.data.finished)
    );
  }
}

Instructions.propTypes = {
  task: PropTypes.object,
  assignmentStatus: PropTypes.object,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  task: state.questionForm.task,
  assignmentStatus: state.questionForm.assignmentStatus,
  loading: state.questionForm.loading
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Instructions);
