import React, { PropTypes } from 'react';
import { recordOf } from 'react-immutable-proptypes';
import { Record } from 'immutable';
import { Union, Maybe } from 'results';
import Spindle, { Update } from '../../spindle';


const emitType = PropTypes.number.isRequired;


const Model = Record({
  value: 0,
  min: -Infinity,
  max: Infinity,
});


const modelType = recordOf({
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
});


const Action = Union({
  Increment: null,
  Decrement: null,
});


// this is just a helper, it's not a special funciton
const constrain = model => {
  const { value, min, max } = model.toObject();
  return model.set('value', Math.max(min, Math.min(max, value)));
}


const init = props =>
  propsUpdate(props, Model());


const propsUpdate = ({ min = -Infinity, max = Infinity }, model) => {
  const updated = constrain(model.merge({ min, max }));
  return Update({
    model: updated,
    emit: model.value,
  });
};


const update = (action, model) => Action.match(action, {
  Increment: () => {
    const newModel = constrain(model.update('value', v => v + 1));
    return Update({
      model: newModel,
      emit: newModel.value,
    });
  },

  Decrement: () => {
    const newModel = constrain(model.update('value', v => v - 1));
    return Update({
      model: newModel,
      emit: newModel.value,
    });
  },
});


const view = (model, dispatch) => (
  <p>
    <button
      disabled={model.value <= model.min}
      onClick={dispatch.Decrement}>
      -
    </button>
    {model.value}
    <button
      disabled={model.value >= model.max}
      onClick={dispatch.Increment}>
      +
    </button>
  </p>
);


export default Spindle('Counter',
  { Action, init, propsUpdate, update, modelType, view, emitType });
