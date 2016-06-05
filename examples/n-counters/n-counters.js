import React from 'react';
import Immutable, { Record } from 'immutable';
import { Union } from 'results';
import Spindle, { Update } from '../../spindle';
import Counter from '../counter/counter';


const Action = Union({
  Add: null,
  Remove: null,
});


const Model = Record({
  counters: Immutable.List([]),
});


const init = () =>
  Update({ model: Model() });


const update = (action, model) => Action.match(action, {
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


export default Spindle('NCounters',
  { Action, init, update, view });
