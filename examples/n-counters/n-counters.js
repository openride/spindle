import React from 'react';
import Immutable, { Record } from 'immutable';
import { Union } from 'results';
import { component, Update } from '../../spindle';
import Counter from '../counter/counter';


const Msg = Union({
  Add: null,
  Remove: null,
});


const Model = Record({
  counters: Immutable.List([]),
});


const init = () =>
  Update({ model: Model() });


const update = (msg, model) => Msg.match(msg, {
  Add: () =>
    Update({ model: model.update('counters', list => list.push(list.size)) }),

  Remove: () =>
    Update({ model: model.update('counters', list => list.pop()) }),
});


const view = (model, dispatch) => (
  <div>
    <p>all the counters you could want...</p>
    <p>
      <button onClick={dispatch.Add}>Add another</button>
      <button onClick={dispatch.Remove}>Remove one</button>
    </p>
    {model.get('counters').map(id => (
      <Counter key={id} />
    )).toArray()}
  </div>
);


export default component('NCounters',
  { Msg, init, update, view });
