import React from 'react';
import { something } from './module-with-multiple-exports';

export default () => <div id="unused-export">{something}</div>;
