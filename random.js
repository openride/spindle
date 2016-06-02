import { Cmd } from './spindle';


export const random = Cmd({
  run: msg => msg(Math.random()),
  abort: () => null  // run ran synchronously, so nothing to abort
});
