import React from 'react';
import { Record } from 'immutable';
import { component, Update } from '../../spindle';


const Model = Record({
  title: null,
});


const handleProps = (props, model) =>
  Update({ model: model.set('title', props.title ) });


const view = (model, _, children) => (
  <div style={{ border: '1px solid #f6f', margin: '1em 0', width: '50%' }}>
    <h2 style={{ background: '#f6f', margin: 0 }}>
      {model.get('title')}
    </h2>
    <div style={{ padding: '1em' }}>
      {children}
    </div>
  </div>
);


module.exports = component('Box',
  { Model, handleProps, view });
