import Immutable from 'immutable';
import React from 'react';  // for JSX
import ReactDOM from 'react-dom';
import Counter from './counter';
import { SpindleRoot } from './spindle';

const mountpoint = document.getElementById('app');
ReactDOM.render(<SpindleRoot component={Counter} />, mountpoint);
