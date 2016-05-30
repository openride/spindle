import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { Update, component } from './spindle';
import Counter from './counter';


const Msg = Union({
  Top: null,
  Bottom: null,
});


const Model = Immutable.Record({});


const init = () =>
  Model();  // no local state


const update = (msg, model, forwardMsg) => Msg.match(msg, {
  Top: forwardMsg('top'),
  Bottom: forwardMsg('bottom'),
});


const view = (model, boundMsg, mount) => (
  <div>
    {mount(Counter, boundMsg.Top, 'top')}
    {mount(Counter, boundMsg.Bottom, 'bottom')}
  </div>
);


export default component('Pair', init, Msg, update, view)
