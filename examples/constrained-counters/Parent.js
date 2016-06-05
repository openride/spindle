import React from 'react';
import { Record } from 'immutable';
import { Union } from 'results';
import { component, Update } from '../../spindle';
import Counter from './Counter';


const Action = Union({
  SetMin: null,
  SetMax: null,
});


const Model = Record({
  min: 0,
  max: 0,
});


const init = () =>
  Update({ model: Model() });


const update = (action, model) => Action.match(action, {
  SetMin: v =>
    Update({ model: model.set('min', v) }),

  SetMax: v =>
    Update({ model: model.set('max', v) }),
});


const view = (model, dispatch) => (
  <div>
    <p>min</p>
    <Counter
      onEmit={dispatch.SetMin}
      max={model.get('max')} />

    <p>val</p>
    <Counter
      min={model.get('min')}
      max={model.get('max')} />

    <p>max</p>
    <Counter
      onEmit={dispatch.SetMax}
      min={model.get('min')} />
  </div>
);


export default component('Parent',
  { Action, init, update, view });
