import React from 'react';
import PropTypes from 'prop-types';
import {Grid, List} from 'semantic-ui-react';

const JobParameters = props => (
  <Grid>
    <Grid.Row>
      <Grid.Column width="8">
        <List divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header as="h4">Max. tasks per worker</List.Header>
              <List.Description as="p">{props.item.data.maxTasksRule}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header as="h4">#Votes per task</List.Header>
              <List.Description as="p">{props.item.data.votesPerTaskRule}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header as="h4">Task reward (in USD)</List.Header>
              <List.Description as="p">{props.item.data.taskRewardRule}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header as="h4">Expert cost (in USD)</List.Header>
              <List.Description as="p">{props.item.data.expertCostRule}</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column width="8">
        <List divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header as="h4">Initial tests</List.Header>
              <List.Description as="p">{props.item.data.initialTestsRule}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header as="h4">Initial Tests min score (%)</List.Header>
              <List.Description as="p">{props.item.data.initialTestsMinCorrectAnswersRule}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header as="h4">Test frequency</List.Header>
              <List.Description as="p">{props.item.data.testFrequencyRule}</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

JobParameters.propTypes = {
  item: PropTypes.object
};

export default JobParameters;
