import { Sub, Cmd } from '../spindle';

const ns = Symbol('TIME');


export const now = Cmd({
  run: (msg, done) =>
    done(msg(new Date())),
  abort: () =>
    null,
});


export const tick = Cmd({
  run: (msg, done) =>
    requestAnimationFrame(t => done(msg(t))),
  abort: id =>
    cancelAnimationFrame(id),
});


export const every = interval => Sub(ns, {
  key: `every ${interval}`,
  start: change => {
    const id = setInterval(() =>
      change(id, new Date()), interval);
    return id;
  },
  stop: id =>
    clearInterval(id),
});


export const ticks = Sub(ns, {
  key: 'ticks',
  start: change => {
    const rafHandler = t =>
      change(requestAnimationFrame(rafHandler), t);
    return rafHandler();
  },
  stop: it =>
    cancelAnimationFrame(id),
});
