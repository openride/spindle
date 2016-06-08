import React from 'react';
import { Record } from 'immutable';
import { Union, Maybe } from 'results';
import Spindle, { Update, sub } from '../../spindle';
import { seconds } from '../../time';


const Model = Record({
  time: Maybe.None(),  // not initialized
});


const Action = Union({
  Time: null,
});


const init = () =>
  Update({ model: Model() });


const update = (action, model) => Action.match(action, {
  Time: t =>
    Update({ model: model.set('time', Maybe.Some(t)) }),
});


const subscriptions = model =>
  [ sub(seconds, Action.Time) ]


const view = model => Maybe.match(model.get('time'), {
  Some: t => (
    <p>The time is: {t.toLocaleTimeString()}</p>
  ),
  None: () => (
    <p>Waiting for the time...</p>
  )
});


export default Spindle('Clock',
  { init, update, subscriptions, view });
