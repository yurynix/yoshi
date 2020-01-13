import React from 'react';

export default class WebWorker extends React.Component {
  state = { messageFromWorker: '' };
  componentDidMount() {
    const myWorker = new Worker('web-worker.js');
    myWorker.onmessage = e => {
      this.setState({ messageFromWorker: e.data });
    };
  }

  render() {
    return this.state.messageFromWorker ? (
      <h1>{this.state.messageFromWorker}</h1>
    ) : (
      <div></div>
    );
  }
}
