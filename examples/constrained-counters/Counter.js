import React from 'react';
import { Record } from 'immutable';
import { Union, Maybe } from 'results';
import { component, Update } from '../../spindle';


const Model = Record({
  value: 0,
  min: -Infinity,
  max: Infinity,
});


const Msg = Union({
  Increment: null,
  Decrement: null,
});


// this is just a helper, it's not a special funciton
const constrain = model => {
  const { value, min, max } = model.toObject();
  return model.set('value', Math.max(min, Math.min(max, value)));
}


const handleProps = ({ min = -Infinity, max = Infinity }, model) =>
  Update({ model: constrain(model.merge({ min, max })) });


const update = (msg, model) => Msg.match(msg, {
  Increment: () => {
    const newModel = constrain(model.update('value', v => v + 1));
    return Update({
      model: newModel,
      emit: newModel.get('value'),
    });
  },

  Decrement: () => {
    const newModel = constrain(model.update('value', v => v - 1));
    return Update({
      model: newModel,
      emit: newModel.get('value'),
    });
  },
});


const view = (model, BoundMsg) => (
  <p>
    <button
      disabled={model.get('value') <= model.get('min')}
      onClick={BoundMsg.Decrement}>
      -
    </button>
    {model.get('value')}
    <button
      disabled={model.get('value') >= model.get('max')}
      onClick={BoundMsg.Increment}>
      +
    </button>
  </p>
);


export default component('Counter',
  { Model, Msg, handleProps, update, view });
