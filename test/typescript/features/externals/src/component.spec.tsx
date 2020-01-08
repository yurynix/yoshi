import React from 'react';
import ReactDOM from 'react-dom';
import Component from './component';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Component />, div);

  expect(div.innerHTML).toContain('Some external text.')
});
