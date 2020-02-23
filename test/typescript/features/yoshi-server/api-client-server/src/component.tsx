import React from 'react';
import HttpClient from 'yoshi-server-client';
import { greet } from './api/greeting.api';

export default class App extends React.Component {
  client = new HttpClient({ baseUrl: 'http://localhost:3000' });
  state = { text: '' };
  async componentDidMount() {
    const result = await this.client.request({
      method: greet,
      args: ['Yaniv'],
    });
    this.setState({ text: result.greeting });
  }

  render() {
    return (
      <div>
        <h2 id="my-text">{this.state.text}</h2>
      </div>
    );
  }
}
