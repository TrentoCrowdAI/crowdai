import React from 'react';
import PropTypes from 'prop-types';
import {Segment, Header, Label, Grid, List} from 'semantic-ui-react';

import {JobStatus} from 'src/utils/constants';
import JobInformationPlugin from './JobInformationPlugin';

const JobInformation = ({job, loading}) => {
  const criteria = job.criteria || [];
  return (
    <Segment loading={loading}>
      <Header as="h3">
        Job Information
        <Label horizontal color={jobStatusColors[job.data.status]}>
          {job.data.status}
        </Label>
      </Header>
      <Grid>
        <Grid.Row>
          <Grid.Column width="8">
            <List divided relaxed>
              <List.Item>
                <List.Content>
                  <List.Header as="h4">Name</List.Header>
                  <List.Description as="p">{job.data.name}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header as="h4">Description</List.Header>
                  <List.Description as="p">{job.data.description}</List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width="8">
            <List divided relaxed>
              <List.Item>
                <List.Content>
                  <List.Header as="h4">Number of papers</List.Header>
                  <List.Description as="p">{job.itemsCount}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header as="h4">Number of filters</List.Header>
                  <List.Description as="p">{criteria && criteria.length}</List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>

        <JobInformationPlugin job={job} />
      </Grid>
    </Segment>
  );
};

JobInformation.propTypes = {
  job: PropTypes.object,
  loading: PropTypes.bool
};

const jobStatusColors = {
  [JobStatus.PUBLISHED]: 'green',
  [JobStatus.NOT_PUBLISHED]: 'grey',
  [JobStatus.DONE]: 'blue'
};

export default JobInformation;
