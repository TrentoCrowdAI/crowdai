import React from 'react';
import {Segment, Grid, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class PaymentInstructions extends React.Component {
  render() {
    const {job} = this.props;
    return (
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h3" style={{fontSize: '2em'}}>
                Payment instructions
              </Header>
              <div style={{fontSize: '1em', textAlign: 'justify'}}>
                <ul>
                  <li>
                    Your compensation is {job.data.taskRewardRule} USD per task, up to a maximum of {job.maxReward} USD.
                  </li>
                  <li>
                    Some of the tasks are test questions. You will be paid for these as well, unless you miss any of the
                    first {job.data.initialTestsRule} test questions.
                  </li>
                </ul>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

PaymentInstructions.propTypes = {
  job: PropTypes.object.isRequired
};

export default PaymentInstructions;
