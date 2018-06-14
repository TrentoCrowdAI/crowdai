import React from 'react';
import PropTypes from 'prop-types';
import {Accordion, Icon, Header, Button, Popup, Pagination, Dimmer, Loader} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {actions} from './actions';
import {ResultOutcomes} from 'src/utils/constants';

const outcomesMap = {
  [ResultOutcomes.IN]: {color: 'green', icon: 'check'},
  [ResultOutcomes.OUT]: {color: 'red', icon: 'remove'},
  [ResultOutcomes.STOPPED]: {color: 'orange', icon: 'question'}
};

class JobResults extends React.Component {
  constructor(props) {
    super(props);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);

    this.state = {
      activeIndex: 0
    };
  }
  render() {
    const {results, job} = this.props;
    let criteriaMap = {};

    if (job) {
      for (let c of job.criteria) {
        criteriaMap[c.id] = {label: c.data.label, description: c.data.description};
      }
    }

    if (results.rows.length === 0) {
      return <p>No results generated yet.</p>;
    }
    return (
      <React.Fragment>
        <Dimmer active={this.props.loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Accordion style={{width: '100%'}} styled exclusive={false}>
          {results.rows.map((record, idx) => {
            let filter = getReason(record);
            return (
              <div key={record.id}>
                <Accordion.Title
                  active={this.state.activeIndex === idx}
                  index={idx}
                  onClick={this.handleAccordionClick}>
                  <Icon name="dropdown" />
                  <Popup
                    trigger={<span>Paper #{record.id}</span>}
                    content={
                      <span>
                        <strong>Title:</strong> {record.title}
                      </span>
                    }
                  />
                  <Icon
                    name={outcomesMap[record.data.outcome].icon}
                    color={outcomesMap[record.data.outcome].color}
                    style={{marginLeft: '10px'}}
                  />
                  <span style={{marginLeft: '10px'}}>P(OUT) = {filter.pout}</span>
                  {record.data.outcome === ResultOutcomes.OUT && (
                    <span style={{marginLeft: '10px'}}>Reason: {criteriaMap[filter.id].description}</span>
                  )}
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === idx} style={{textAlign: 'center'}}>
                  {record.data.criteria.map(f => (
                    <div key={f.id} style={{display: 'inline-block', marginRight: '10px'}}>
                      <Header size="large" content={criteriaMap[f.id].label} textAlign="center" />
                      <Button
                        size="mini"
                        content="IN"
                        icon="check"
                        label={{basic: true, pointing: 'left', content: f.in}}
                      />
                      <Button
                        basic
                        size="mini"
                        content="OUT"
                        icon="remove"
                        label={{as: 'a', basic: true, pointing: 'left', content: f.out}}
                      />
                    </div>
                  ))}
                </Accordion.Content>
              </div>
            );
          })}
        </Accordion>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Pagination
            defaultActivePage={1}
            totalPages={results.meta.totalPages}
            onPageChange={(e, {activePage}) => this.props.fetchResults(job.id, activePage)}
          />
        </div>
      </React.Fragment>
    );
  }

  handleAccordionClick(e, {index}) {
    const {activeIndex} = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({
      activeIndex: newIndex
    });
  }
}

const getReason = record => {
  let reason = {pout: 0};

  for (let c of record.data.criteria) {
    if (c.pout > reason.pout) {
      reason = c;
    }
  }
  return reason;
};

JobResults.propTypes = {
  job: PropTypes.object,
  results: PropTypes.object,
  fetchResults: PropTypes.func,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  results: state.job.results.results,
  loading: state.job.results.loading
});

const mapDispatchToProps = dispatch => ({
  fetchResults: (id, page) => dispatch(actions.fetchResults(id, page))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobResults);
