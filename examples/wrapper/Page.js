import React from 'react';
import Spindle from '../../spindle';
import Box from './Box';


const view = () => (
  <div>
    <h1>This is a page.</h1>
    <p>Here are some boxed things:</p>
    <Box title="Muscle spindle">
      <p>Muscle spindles are sensory receptors within the belly of a muscle that primarily detect...</p>
    </Box>
    <Box title="Spindle apparatus">
      <p>In cell biology, the spindle apparatus refers to the cytoskeletal structure of...</p>
    </Box>
    <Box title="Spindle neuron">
      <p>A specific class of neurons that are characterized by a large spindle-shaped soma, gradually...</p>
    </Box>
  </div>
);


export default Spindle('Page', { view });
