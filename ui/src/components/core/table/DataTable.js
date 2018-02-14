import React from 'react';
import {Table, Grid, Header, Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class DataTable extends React.Component {
  render() {
    const {options, data} = this.props;
    const {columns} = options;

    return (
      <Grid style={{margin: '10px'}}>
        <Grid.Row>
          <Grid.Column>
            <Header>
              <Header.Content>
                <h2 style={{marginRight: '10px', display: 'inline'}}>{this.props.title}</h2>
                {this.props.createUrl && (
                  <Button icon="plus" color="blue" floated="right" size="small" as={Link} to={this.props.createUrl} />
                )}
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table columns="2" celled striped>
              <Table.Header>
                <Table.Row>
                  {Object.keys(columns).map(field => (
                    <Table.HeaderCell key={field}>{columns[field].label}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {data.length === 0 && (
                  <Table.Row textAlign="center">
                    <Table.Cell colSpan="2">No records found.</Table.Cell>
                  </Table.Row>
                )}
                {data.map(record => (
                  <Table.Row key={record.id}>
                    {Object.keys(columns).map(field => (
                      <Table.Cell key={`${record.id}-${field}`}>{record[field]}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>

              {/* TODO: implement pagination
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">
                    <Menu floated="right" pagination>
                      <Menu.Item as="a" icon>
                        <Icon name="left chevron" />
                      </Menu.Item>
                      <Menu.Item as="a">1</Menu.Item>
                      <Menu.Item as="a">2</Menu.Item>
                      <Menu.Item as="a">3</Menu.Item>
                      <Menu.Item as="a">4</Menu.Item>
                      <Menu.Item as="a" icon>
                        <Icon name="right chevron" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer> */}
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

DataTable.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.shape({
    columns: PropTypes.object
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  createUrl: PropTypes.string
};

export default DataTable;