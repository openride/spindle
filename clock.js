import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { component, Update, cmd, sub } from './spindle';
import { tick, seconds } from './time';


const Model = Immutable.Record({
  animTime: null,
  time: null,
});


const Msg = Union({
  Tick: null,
  Second: null,
});


const init = (props, boundMsg) => Update({
  model: Model({ animTime: 0, time: 0, }),
  cmds: [cmd(tick, boundMsg.Tick)],
});


const update = (msg, model, props, boundMsg) => Msg.match(msg, {
  Tick: animTime =>
    Update({
      model: model.set('animTime', animTime),
      cmds: [cmd(tick, boundMsg.Tick)],
    }),

  Second: time =>
    Update({
      model: model.set('time', time),
    }),
});


const view = model => (
  <span>{Math.round(model.get('animTime'))} er... {new Date(model.get('time')).toLocaleTimeString()}</span>
);


const subscriptions = (model, boundMsg) =>
  [sub(seconds, boundMsg.Second)];


export default component('Counter',
  { Msg, init, update, view, subscriptions });
