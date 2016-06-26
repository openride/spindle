import React from 'react';
import { Union, Maybe } from 'results';
import { Record } from 'immutable';
import Spindle, { Update } from '../spindle';

// examples:
import Counter from './counter/counter';
import Pair from './pair-of-counters/pair';
import NCounters from './n-counters/n-counters';
import SummedPair from './sum-counters/SummedPair';
import ConstrainedCounters from './constrained-counters/Parent';
import Wrapper from './wrapper/Page';
import Diceroll from './diceroll/Diceroll';
import Clock from './clock/Clock';
import Draggable from './draggable/Draggable';
import TodoMVC from './todomvc/TodoMVC';


const exampleComponents = [
  Counter,
  Pair,
  NCounters,
  SummedPair,
  ConstrainedCounters,
  Wrapper,
  Diceroll,
  Clock,
  Draggable,
  TodoMVC,
];


const Example = Union(exampleComponents);


const Action = Union({
  Choose: null,
  Unset: null,
});


const init = () =>
  Update({ model: Maybe.None() });


const update = (action, model) => Action.match(action, {
  Choose: i =>
    Update({ model: Maybe.Some(i) }),

  Unset: () =>
    Update({ model: Maybe.None() }),
});


const view = (model, dispatch) => (
  <div>
    <h1>Spindle Examples</h1>
    <div>
      <button key="main" onClick={dispatch.Unset}>
        Back
      </button>
      {exampleComponents.map((c, i) => (
        <button key={i} onClick={() => dispatch(Action.Choose(i))}>
          {c.displayName}
        </button>
      ))}
    </div>
    {Maybe.match(model, {
      Some: i => {
        const Example = exampleComponents[i];
        return [
          <h2 key="title">{exampleComponents[i].displayName}</h2>,
          <div key="example">
            <Example />
          </div>,
        ];
      },
      None: () => (
        <p>Blah blah blah</p>
      )
    })}
  </div>
);


export default Spindle('ExamplesApp',
  { Action, init, update, view })
