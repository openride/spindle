import { Cmd } from '../spindle';


export const random = Cmd({
  run: (msg, done) =>
    done(msg(Math.random())),
});
