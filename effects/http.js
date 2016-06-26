import { Cmd } from '../spindle';


export const get = url => Cmd({
  run: (msg, done) =>
    fetch(url)
      .then(res => res.json())
      .then(data => done(msg(data))),
  abort: () =>
    null,  // TODO
});
