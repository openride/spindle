import Immutable from 'immutable';
import React from 'react';  // for JSX
import ReactDOM from 'react-dom';
import Parent from './parent';


const mountpoint = document.getElementById('app');
ReactDOM.render(<Parent />, mountpoint);
