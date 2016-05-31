import { Union } from './results';
import Immutable from 'immutable';
import React from 'react';
import { Update, component } from './spindle';
import Clock from './clock';
import Counter from './counter';


const Model = Immutable.Record({
  topValue: 5,
  bottomValue: 0,
  countersList: Immutable.List(),
});


const Msg = Union({
  Top: null,
  Bottom: null,
  AddCounter: null,
  RemoveCounter: null,
  SetListCounter: null,
});


const init = () =>
  Update({ model: Model() });


const update = (msg, model) => Msg.match(msg, {
  Top: value =>
    Update({ model: model.set('topValue', value) }),

  Bottom: value =>
    Update({ model: model.set('bottomValue', value ) }),

  AddCounter: () =>
    Update({ model: model.update('countersList', l => l.push(l.size) )}),

  RemoveCounter: () =>
    Update({ model: model.update('countersList', l => l.pop() )}),

  SetListCounter: ({ i, value }) =>
    Update({ model: model.setIn(['countersList', i], value) }),

});


const view = (model, boundMsg) => (
  <div>
    <p>some time stuff: <Clock /></p>
    <p>again because why not: <Clock /></p>
    <p>here are some counters:</p>
    <Counter
      onEmit={boundMsg.Top}
      initialValue={model.get('topValue')} />
    <Counter
      onEmit={boundMsg.Bottom} />
    <p>their sum is: {model.get('topValue') + model.get('bottomValue')}</p>
    <p>here are more counters:</p>
    <p>
      <button onClick={boundMsg.AddCounter}>Add one</button>
      <button onClick={boundMsg.RemoveCounter}>Remove one</button>
    </p>
    {model.get('countersList').map((v, i) => (
      <Counter
        onEmit={value => boundMsg.SetListCounter({ i, value })}
        initialValue={v}
        key={i} />
    )).toArray()}
    <p>and their sum is: {model.get('countersList').reduce((a, b) => a + b, 0)}</p>
  </div>
);


export default component('Parent',
  { Msg, init, update, view })
