import React from 'react';
import {Grid, List} from 'semantic-ui-react';

import {JobInformationPluginPropTypes} from 'src/components/admin/jobs/JobInformationPlugin';

const JobInformationShortestRun = ({job}) => (
  <Grid.Row style={{paddingTop: 0}}>
    <Grid.Column width="8">
      <List divided relaxed>
        <List.Item style={{borderTop: '1px solid rgba(34,36,38,.15)', paddingTop: '.42857143em'}}>
          <List.Content>
            <List.Header as="h4">Current step</List.Header>
            <List.Description as="p">{getCurrentStep(job.data.shortestRun.hits)}</List.Description>
          </List.Content>
        </List.Item>
      </List>
    </Grid.Column>
    <Grid.Column width="8">
      <List divided relaxed>
        <List.Item style={{borderTop: '1px solid rgba(34,36,38,.15)', paddingTop: '.42857143em'}}>
          <List.Content>
            <List.Header as="h4">Number of HITs published</List.Header>
            <List.Description as="p">{job.data.shortestRun.hits.length}</List.Description>
          </List.Content>
        </List.Item>
      </List>
    </Grid.Column>
  </Grid.Row>
);

const getCurrentStep = hits => {
  let step = 0;

  for (let h of hits) {
    if (step < h.step) {
      step = h.step;
    }
  }
  return step + 1;
};

JobInformationShortestRun.propTypes = JobInformationPluginPropTypes;

export default JobInformationShortestRun;
