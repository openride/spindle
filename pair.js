import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { Update, component } from './spindle';
import Counter from './counter';


const Model = Immutable.Record({
  topValue: null,
  bottomValue: null,
});


const Msg = Union({
  Top: null,
  Bottom: null,
});


const init = () =>
  Model();


const update = (msg, model) => Msg.match(msg, {
  Top: value =>
    Update({ model: model.set('topValue', value) }),
  Bottom: value =>
    Update({ model: model.set('bottomValue', value ) }),
});


const view = (model, boundMsg) => (
  <div>
    <Counter onEmit={boundMsg.Top} initialValue={0} />
    <Counter onEmit={boundMsg.Bottom} initialValue={0} />
    <p>sum: {model.get('topValue') + model.get('bottomValue')}</p>
  </div>
);


export default component('Pair',
  { Msg, init, update, view })
