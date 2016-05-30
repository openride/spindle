import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { component, Update, Time } from './spindle';


const Model = Immutable.Record({
  time: null,
});


const Msg = Union({
  Tick: null,
});


const init = () => Update({
  model: Model({ time: 0 }),
});


const update = (msg, model) => Msg.match(msg, {
  Tick: newTime =>
    Update({ model: model.set('time', newTime) }),
});


const view = model => (
  <span>{new Date(model.get('time')).toLocaleTimeString()}</span>
);


const subscriptions = model =>
  [Time.seconds(Msg.Tick)];


export default component('Counter',
  { Msg, init, update, view, subscriptions });
