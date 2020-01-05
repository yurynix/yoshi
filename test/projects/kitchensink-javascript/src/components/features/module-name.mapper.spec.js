import React from 'react';
import ReactDOM from 'react-dom';
import ModuleNameMapper from './module-name-mapper';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ModuleNameMapper />, div);
});
