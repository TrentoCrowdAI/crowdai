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
                    The reward is {job.data.taskRewardRule} USD per given answer. If you complete all the tasks, you
                    will earn {job.maxReward} USD.
                  </li>
                  <li>
                    Some of the tasks are test questions, and you will be paid for these as well unless you miss any of
                    the initial test questions.
                  </li>
                  <li>For this study, the number of initial test questions is {job.data.initialTestsRule}.</li>
                  <li>
                    You will earn the accumulated reward only if you answer a minimum of {job.data.minTasksRule}
                    {job.data.minTasksRule > 1 ? ' tasks' : ' task'} (test questions are not counted)
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
