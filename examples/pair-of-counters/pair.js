import React from 'react';
import Counter from '../counter/counter';
import Spindle from '../../spindle';


const view = () => (
  <div>
    <p>here are a pair of counters:</p>
    <Counter />
    <Counter />
  </div>
);


export default Spindle('Pair', { view });
