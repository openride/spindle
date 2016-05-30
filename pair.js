import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { Update, component } from './spindle';
import Clock from './clock';
import Counter from './counter';


const Model = Immutable.Record({
  topValue: 5,
  bottomValue: 0,
});


const Msg = Union({
  Top: null,
  Bottom: null,
});


const init = () =>
  Update({ model: Model() });


const update = (msg, model) => Msg.match(msg, {
  Top: value =>
    Update({ model: model.set('topValue', value) }),
  Bottom: value =>
    Update({ model: model.set('bottomValue', value ) }),
});


const view = (model, boundMsg) => (
  <div>
    <p>some time stuff: <Clock /></p>
    <p>here are some counters:</p>
    <Counter
      onEmit={boundMsg.Top}
      initialValue={model.get('topValue')} />
    <Counter
      onEmit={boundMsg.Bottom} />
    <p>their sum is: {model.get('topValue') + model.get('bottomValue')}</p>
  </div>
);


export default component('Pair',
  { Msg, init, update, view })
