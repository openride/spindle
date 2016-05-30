import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { Update, component } from './spindle';



const Msg = Union({
  Increment: null,
  Decrement: null,
});


const Model = Immutable.Record({
  value: null,
});


const init = () => Model({
  value: 0,
});


const update = (msg, model) => Msg.match(msg, {
  Increment: () =>
    Update({ model: model.update('value', x => x + 1) }),
  Decrement: () =>
    Update({ model: model.update('value', x => x - 1) }),
});


const view = (model, boundMsg) => (
  <div>
    <button onClick={boundMsg.Decrement}>-</button>
    {model.get('value')}
    <button onClick={boundMsg.Increment}>+</button>
  </div>
);


export default component('Counter', init, Msg, update, view)
