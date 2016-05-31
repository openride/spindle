import React from 'react';
import { Record } from 'immutable';
import { Union } from 'results';
import { component, Update } from '../../spindle';
import Counter from './Counter';


const Model = Record({
  min: 0,
  max: 0,
});


const Msg = Union({
  SetMin: null,
  SetMax: null,
});


const update = (msg, model) => Msg.match(msg, {
  SetMin: v =>
    Update({ model: model.set('min', v) }),

  SetMax: v =>
    Update({ model: model.set('max', v) }),
});


const view = (model, BoundMsg) => (
  <div>
    <p>min</p>
    <Counter
      onEmit={BoundMsg.SetMin}
      max={model.get('max')} />

    <p>val</p>
    <Counter
      min={model.get('min')}
      max={model.get('max')} />

    <p>max</p>
    <Counter
      onEmit={BoundMsg.SetMax}
      min={model.get('min')} />
  </div>
);


export default component('Parent',
  { Model, Msg, update, view });
