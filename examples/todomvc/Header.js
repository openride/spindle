import React from 'react';
import { Union } from 'results';
import Spindle, { Update } from '../../spindle';
import AutofocusingInput from './AutofocusingInput';


const Action = Union({
  SetText: null,
  KeyDown: null,
});


const init = () =>
  Update({ model: '' });


const update = (action, model) => Action.match(action, {
  SetText: e =>
    Update({ model: e.target.value }),

  KeyDown: e => {
    const task = e.target.value.trim();
    if (e.keyCode === 13 && task !== '') {
      return Update({ cb: { onAdd: [task] }, model: '' });
    } else {
      return Update();
    }
  },
});


const view = (model, dispatch) => (
  <header className="header">
    <h1>todos</h1>
    <AutofocusingInput
      className="new-todo"
      onChange={dispatch.SetText}
      onKeyDown={dispatch.KeyDown}
      placeholder="What needs to be done?"
      value={model} />
  </header>
);


export default Spindle('Header',
  { Action, init, update, view });
