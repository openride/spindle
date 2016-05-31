import React from 'react';
import { Record } from 'immutable';
import { Union } from 'results';
import { component, Update } from '../../spindle';
import Counter from './Counter';


const Model = Record({
  topValue: null,
  bottomValue: null,
});


const Msg = Union({
  TopValue: null,
  BottomValue: null,
});


const update = (msg, model) => Msg.match(msg, {
  TopValue: v =>
    Update({ model: model.set('topValue', v) }),

  BottomValue: v =>
    Update({ model: model.set('bottomValue', v) }),
});


const view = (model, BoundMsg) => (
  <div>
    <p>here are some counters:</p>
    <Counter onEmit={BoundMsg.TopValue} />
    <Counter onEmit={BoundMsg.BottomValue} />
    <p>their sum is: {model.get('topValue') + model.get('bottomValue')}</p>
  </div>
);


export default component('SummedPair',
  { Model, Msg, update, view });
