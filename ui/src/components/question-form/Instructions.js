import React from 'react';

import {Accordion, Header, Segment} from 'semantic-ui-react';

class Instructions extends React.Component {
  state = {open: true};

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const {open} = this.state;

    return (
      <div>
        <Accordion>
          <Accordion.Title active={open} onClick={this.handleClick}>
            <Header as="h1" style={{display: 'inline'}}>
              Instructions {open ? '(click to collapse)' : '(click to expand)'}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={open}>
            <Segment>
              <p style={{textAlign: 'justify'}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
            </Segment>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }

  handleClick() {
    this.setState({open: !this.state.open});
  }
}

export default Instructions;
