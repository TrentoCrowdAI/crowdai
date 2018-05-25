import React from 'react';
import {Card, Icon, Label, Grid, List} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import config from 'src/config/config.json';

const colorMap = {
  Assignable: 'green',
  Unassignable: 'orange',
  Reviewable: 'blue',
  Disposed: 'red'
};

class HitInformation extends React.Component {
  render() {
    const {hit} = this.props;

    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Label as="a" color={colorMap[hit.HITStatus]} ribbon>
              {hit.HITStatus}
            </Label>
            HIT information
          </Card.Header>
          {this.props.showMeta && this.props.loading && <Card.Meta> refreshing the information... </Card.Meta>}
          {this.props.showMeta &&
            !this.props.loading && (
              <Card.Meta>information updated every {config.polling.jobState / 1000} seconds</Card.Meta>
            )}
          <Card.Description>
            <Grid>
              <Grid.Row>
                <Grid.Column width="8">
                  <List divided relaxed>
                    <List.Item>
                      <List.Content>
                        <List.Header as="h4">ID</List.Header>
                        <List.Description as="p">{hit.HITId}</List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header as="h4">Title</List.Header>
                        <List.Description as="p">{hit.Title}</List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header as="h4">Description</List.Header>
                        <List.Description as="p">{hit.Description}</List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width="8">
                  <List divided relaxed>
                    <List.Item>
                      <List.Content>
                        <List.Header as="h4">Max number of assignments</List.Header>
                        <List.Description as="p">{hit.MaxAssignments}</List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header as="h4">Creation time</List.Header>
                        <List.Description as="p">
                          {moment(hit.CreationTime, 'YYYY-MM-DDTHH:mm:ss.S Z').format('DD-MM-YYYY HH:mm:ss')}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header as="h4">Expiration</List.Header>
                        <List.Description as="p">
                          {moment(hit.Expiration, 'YYYY-MM-DDTHH:mm:ss.S Z').format('DD-MM-YYYY HH:mm:ss')}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Description>
        </Card.Content>
        <Card.Content textAlign="center" extra>
          <List horizontal relaxed>
            <List.Item>
              <List.Content>
                <Icon name="wait" />
                {hit.NumberOfAssignmentsPending} assignments pending
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <Icon name="add user" />
                {hit.NumberOfAssignmentsAvailable} assignments available
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <Icon name="checkmark box" />
                {hit.NumberOfAssignmentsCompleted} assignments completed
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
      </Card>
    );
  }
}

HitInformation.propTypes = {
  hit: PropTypes.object,
  loading: PropTypes.bool,
  showMeta: PropTypes.bool
};

export default HitInformation;
