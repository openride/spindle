import React from 'react';
import { Record } from 'immutable';
import { Union } from 'results';
import Spindle, { Update } from '../../spindle';
import Counter from './Counter';


const Action = Union({
  TopValue: null,
  BottomValue: null,
});


const Model = Record({
  topValue: null,
  bottomValue: null,
});


const init = () =>
  Update({ model: Model() });


const update = (action, model) => Action.match(action, {
  TopValue: v =>
    Update({ model: model.set('topValue', v) }),

  BottomValue: v =>
    Update({ model: model.set('bottomValue', v) }),
});


const view = (model, dispatch) => (
  <div>
    <p>here are some counters:</p>
    <Counter onChange={dispatch.TopValue} />
    <Counter onChange={dispatch.BottomValue} />
    <p>their sum is: {model.topValue + model.bottomValue}</p>
  </div>
);


export default Spindle('SummedPair',
  { Action, init, update, view });
