import { Cmd } from '../spindle';


export const get = url => Cmd({
  run: (msg, done) => {
    const state = { aborted: false };
    fetch(url)
      .then(res => res.json())
      .then(data => state.aborted ? null : done(msg(data)));
    return state;
  },
  abort: state => {
    state.aborted = true;
  },
});
