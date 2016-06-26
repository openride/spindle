import { Sub } from '../spindle';

const ns = Symbol('MOUSE');


const windowEvent = (ev, extract) =>
  Sub(ns, {
    key: ev,
    start: change => {
      const handler = e =>
        change(handler, extract(e));
      window.addEventListener(ev, handler);
      return handler;
    },
    stop: handler =>
      window.removeEventListener(ev, handler),
  });


export const ups = windowEvent('mouseup', () =>
  undefined);

export const downs = windowEvent('mousedown', () =>
  undefined);

export const moves = windowEvent('mousemove', e =>
  ({ x: e.pageX, y: e.pageY }));
