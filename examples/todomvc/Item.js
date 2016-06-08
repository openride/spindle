import React from 'react';
import { Union } from 'results';
import { Record } from 'immutable';
import Spindle, { Update } from '../../spindle';
import AutofocusingInput from './AutofocusingInput';


const Model = Record({
  task: null,
  editing: false,
  editingValue: '',
});


const Action = Union({
  Destroy: null,
  FinishEditing: null,
  SaveOnEnter: null,
  SetEditValue: null,
  StartEditing: null,
  ToggleCompleted: null,
});


export const Emit = Union({
  Destroy: null,
  Save: null,
});


const init = ({ task }) =>
  Update({ model: Model({ task }) });


const propsUpdate = ({ task }, model) =>
  Update({ model: model.set('task', task) });


const update = (action, model) => Action.match(action, {
  Destroy: () =>
    Update({ emit: Emit.Destroy(model.task.id) }),

  FinishEditing: () => {
    const task = model.task.set('title', model.editingValue);
    return Update({
      model: model.merge({ task, editing: false }),
      emit: Emit.Save(task),
    });
  },

  SaveOnEnter: e => {
    if (e.keyCode === 13) {
      const task = model.task.set('title', model.editingValue);
      return Update({
        model: model.merge({ task, editing: false }),
        emit: Emit.Save(task),
      });
    } else {
      return Update();
    }
  },

  SetEditValue: e =>
    Update({ model: model.set('editingValue', e.target.value) }),

  StartEditing: () =>
    Update({ model: model.merge({
      editing: true,
      editingValue: model.task.title,
    }) }),

  ToggleCompleted: () => {
    const task = model.task.update('completed', c => !c);
    return Update({
      model: model.set('task', task),
      emit: Emit.Save(task),
    });
  },
});


const getClassName = model =>
  `${model.task.completed ? 'completed' : ''}
   ${model.editing ? 'editing' : ''}`;


const view = (model, dispatch) => (
  <li className={getClassName(model)}>
    {model.editing ? (
      <AutofocusingInput
        className="edit"
        onBlur={dispatch.FinishEditing}
        onChange={dispatch.SetEditValue}
        onKeyDown={dispatch.SaveOnEnter}
        value={model.editingValue} />
    ) : (
      <div className="view">
        <input
          id={`item-${model.id}`}
          checked={model.task.completed}
          className="toggle"
          onChange={dispatch.ToggleCompleted}
          type="checkbox" />
        <label onDoubleClick={dispatch.StartEditing}>
          {model.task.title}
        </label>
        <button className="destroy" onClick={dispatch.Destroy}></button>
      </div>
    )}
  </li>
);


export default Spindle('Item',
  { Action, init, propsUpdate, update, view });
