import React from 'react';
import { Record } from 'immutable';
import { Union, Maybe } from 'results';
import { component, Update, cmd } from '../../spindle';
import { random } from '../../random';


const Model = Record({
  value: Maybe.None(),
});


const Action = Union({
  Roll: null,
  Set: null,
});


const init = () =>
  Update({
    model: Model(),
    cmds: [ cmd(random, Action.Set) ],
  });


const update = (action, model) => Action.match(action, {
  Roll: () =>
    Update({
      model: model.set('value', Maybe.None()),
      cmds: [ cmd(random, Action.Set) ],
    }),

  Set: randomValue => {
    const diceValue = Math.floor(randomValue * 6) + 1;
    return Update({
      model: model.set('value', Maybe.Some(diceValue)),
    });
  },
});


const view = (model, dispatch) => (
  <div>
    {Maybe.match(model.get('value'), {
      Some: v => (
        <p>You rolled a {v}</p>
      ),
      None: () => (
        <p><em>rolling...</em></p>
      )
    })}
    <p>
      <button
        disabled={model.get('value').isNone()}
        onClick={dispatch.Roll}>
        Roll again
      </button>
    </p>
  </div>
);


export default component('Diceroll',
  { Action, init, update, view });
