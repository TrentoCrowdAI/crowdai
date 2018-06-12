import React from 'react';
import {Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const EstimatedCostDetails = ({job}) => {
  let criteriaMap = {};
  job.criteria.forEach(c => (criteriaMap[c.id] = c.data.label));
  return (
    <React.Fragment>
      <Table compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Criteria</Table.HeaderCell>
            <Table.HeaderCell>#Workers</Table.HeaderCell>
            <Table.HeaderCell>#Tasks per worker</Table.HeaderCell>
            <Table.HeaderCell>Cost (USD)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {job.estimatedCost.details.map((d, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{criteriaMap[d.criteria]}</Table.Cell>
              <Table.Cell>{d.numWorkers}</Table.Cell>
              <Table.Cell>{d.totalTasksPerWorker}</Table.Cell>
              <Table.Cell textAlign="right">{d.cost.toFixed(2)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <p>
        Estimated cost does not include AMT fees. The <strong>#Tasks per worker</strong> column includes tests.
      </p>
    </React.Fragment>
  );
};

EstimatedCostDetails.propTypes = {
  job: PropTypes.object
};

export default EstimatedCostDetails;
