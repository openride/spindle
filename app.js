import Immutable from 'immutable';
import React from 'react';  // for JSX
import ReactDOM from 'react-dom';
import Pair from './pair';
import { SpindleRoot } from './spindle';

const mountpoint = document.getElementById('app');
ReactDOM.render(<SpindleRoot component={Pair} />, mountpoint);
