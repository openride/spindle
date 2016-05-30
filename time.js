import { Sub, Cmd } from './spindle';


export const seconds = Sub({
  key: Symbol('SECONDS'),
  start: msg => {
    let state = setInterval(t => msg(state, new Date()), 1000)
    return state;
  },
  stop: clearInterval,
});


export const tick = Cmd({
  run: msg => requestAnimationFrame(msg),
  abort: cancelAnimationFrame
});
