import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { Update, component } from './spindle';


const Model = Immutable.Record({
  value: null,
});


const Msg = Union({
  Increment: null,
  Decrement: null,
});


const init = props => Model({
  value: 0 || props.initialValue,
});


const emitNewValue = (model, updater) => {
  const newModel = model.update('value', updater);
  return Update({
    model: newModel,
    emit: newModel.get('value'),
  });
};


const update = (msg, model, props) => Msg.match(msg, {
  Increment: () =>
    emitNewValue(model, x => x + 1),
  Decrement: () =>
    emitNewValue(model, x => x - 1),
});


const view = (model, boundMsg) => (
  <div>
    <button onClick={boundMsg.Decrement}>-</button>
    {model.get('value')}
    <button onClick={boundMsg.Increment}>+</button>
  </div>
);


export default component('Counter',
  { init, Msg, update, view });
