import React from 'react';
import Counter from '../counter/counter';
import { component } from '../../spindle';


const view = () => (
  <div>
    <p>here are a pair of counters:</p>
    <Counter />
    <Counter />
  </div>
);


export default component('Pair',
  { view });
