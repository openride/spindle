import React from 'react';
import { Record } from 'immutable';
import { Union, Maybe } from 'results';
import { component, Update, sub } from '../../spindle';
import { seconds } from '../../time';


const Model = Record({
  time: Maybe.None(),  // not initialized
});


const Msg = Union({
  SetTime: null
});


const update = (msg, model) => Msg.match(msg, {
  SetTime: newTime =>
    Update({ model: model.set('time', Maybe.Some(newTime)) }),
});


const subscriptions = (model, BoundMsg) =>
  [ sub(seconds, BoundMsg.SetTime) ]


const view = model => Maybe.match(model.get('time'), {
  Some: t => (
    <p>The time is: {t.toLocaleTimeString()}</p>
  ),
  None: () => (
    <p>Waiting for the time...</p>
  )
});


export default component('Clock',
  { Model, Msg, update, subscriptions, view });
