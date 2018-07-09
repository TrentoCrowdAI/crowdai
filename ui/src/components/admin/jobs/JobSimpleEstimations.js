import React from 'react';
import {Statistic, Icon} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const JobSimpleEstimations = ({data}) => {
  return (
    <React.Fragment>
      <Statistic.Group widths="2">
        <Statistic>
          <Statistic.Value>
            <Icon
              name="calculator"
              size="small"
              style={{
                verticalAlign: 'top',
                marginTop: '8px',
                marginRight: '2px'
              }}
            />
            {data.recall.toFixed(3)}
          </Statistic.Value>
          <Statistic.Label>Estimated recall</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <Icon
              name="calculator"
              size="small"
              style={{
                verticalAlign: 'top',
                marginTop: '8px',
                marginRight: '2px'
              }}
            />
            {data.precision.toFixed(3)}
          </Statistic.Value>
          <Statistic.Label>Estimated precision</Statistic.Label>
        </Statistic>
      </Statistic.Group>

      <Statistic.Group widths="1">
        <Statistic>
          <Statistic.Value>
            <Icon
              name="money bill alternate outline"
              size="small"
              style={{
                verticalAlign: 'top',
                marginTop: '8px',
                marginRight: '2px'
              }}
            />
            {data.price_mean.toFixed(3)}
          </Statistic.Value>
          <Statistic.Label>Estimated price</Statistic.Label>
        </Statistic>
      </Statistic.Group>
      <div style={{marginTop: '20px'}}>
        <span>
          <b>Price</b> is the average number of crowd votes per paper.
        </span>
      </div>
    </React.Fragment>
  );
};

JobSimpleEstimations.propTypes = {
  data: PropTypes.object
};

export default JobSimpleEstimations;
