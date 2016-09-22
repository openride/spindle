import React from 'react';
import Spindle, { Update } from '../../spindle';
import Immutable, { Record } from 'immutable';
import { Union } from 'results';
import Header from './Header';
import Item from './Item';


const Task = Record({
  id: null,
  title: null,
  completed: false,
});


const Action = Union({
  Add: null,
  Save: null,
  Destroy: null,
  ClearCompleted: null,
  MarkAllComplete: null,
});


const init = () =>
  Update({ model: Immutable.OrderedMap() });


const update = (action, model) => Action.match(action, {
  Add: title => {
    const nextId = model.reduce((m, task) => Math.max(m, task.id), 0) + 1;
    const task = Task({ id: nextId, title });
    return Update({ model: model.set(nextId, task) });
  },

  Destroy: id =>
    Update({ model: model.delete(id) }),

  Save: task =>
    Update({ model: model.set(task.get('id'), task) }),

  ClearCompleted: () =>
    Update({ model: model.filter(task => !task.completed) }),

  MarkAllComplete: () =>
    Update({ model: model.map(task => task.set('completed', true)) }),
});


const view = (model, dispatch) => {
  const incomplete = model.filter(task => !task.completed);
  return (
    <section className="todoapp">
      <Header onAdd={dispatch.Add} />
      {model.size > 0 && [
        <section key="main" className="main">
          <input
            id="toggle-all"
            checked={incomplete.size === 0}
            className="toggle-all"
            onChange={dispatch.MarkAllComplete}
            type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {model.map(task => (
              <Item
                key={task.id}
                onSave={dispatch.Save}
                onDestroy={dispatch.Destroy}
                task={task} />
            )).toArray()}
          </ul>
        </section>,
        <footer key="footer" className="footer">
          <span className="todo-count">
            <strong>{incomplete.size}</strong> item{incomplete.size === 1 ? '' : 's'} left
          </span>

          <button className="clear-completed" onClick={dispatch.ClearCompleted}>
            Clear completed
          </button>
        </footer>,
      ]}
    </section>
  );
};


export default Spindle('TodoMVC',
  { Action, init, update, view });
