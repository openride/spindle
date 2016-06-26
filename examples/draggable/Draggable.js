import React from 'react';
import Spindle, { Update } from '../../spindle';
import { Union, Maybe } from 'results';
import { Record } from 'immutable';
import { moves, ups } from '../../effects/mouse';


const SIZE = 100;


const Action = Union({
  Grab: null,
  Move: null,
  Release: null,
});


const Model = Record({
  position: { x: SIZE / 1.5, y: 240 },
  drag: Maybe.None(),
});


const Drag = Record({
  start: { x: 0, y: 0 },
  current: { x: 0, y: 0 },
});


const init = () =>
  Update({ model: Model() });


const update = (action, model) => Action.match(action, {
  Grab: e =>
    Update({
      model: model.set('drag', Maybe.Some(Drag({
        start: { x: e.pageX, y: e.pageY },
        current: { x: e.pageX, y: e.pageY },
      })) ),
    }),

  Move: newPos =>
    Update({
      model: model.update('drag', d =>
        d.andThen(({ start }) =>
          ({ start, current: newPos }))),
    }),

  Release: () =>
    Update({ model: Model({
      position: getPosition(model),
      drag: Maybe.None(),
    }) }),
});


const subscriptions = model =>
  model.drag.isSome()
    ? [ [moves, Action.Move]
      , [ups, Action.Release]
      ]
    : [];


const getPosition = model =>
  Maybe.match(model.drag, {
    None: () =>
      model.position,
    Some: drag => ({
      x: model.position.x + drag.current.x - drag.start.x,
      y: model.position.y + drag.current.y - drag.start.y,
    }),
  });


const view = (model, dispatch) => {
  const { x, y } = getPosition(model);
  return (
    <div
      onMouseDown={dispatch.Grab}
      style={{
        alignItems: 'center',
        background: model.drag.isSome() ? '#086' : '#068',
        borderRadius: 9,
        color: '#fff',
        cursor: 'move',
        display: 'flex',
        height: SIZE,
        justifyContent: 'center',
        left: x - SIZE / 2,
        position: 'absolute',
        top: y - SIZE / 2,
        width: SIZE,
      }}>
      drag me
    </div>
  );
};


export default Spindle('Draggable',
  { Action, init, update, subscriptions, view });
