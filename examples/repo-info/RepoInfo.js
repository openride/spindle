import React from 'react';
import Spindle, { Update } from '../../spindle';
import { Union, Maybe } from 'results';
import { get } from '../../effects/http';


const URL = 'https://api.github.com/repos/openride/spindle';


const Action = Union({
  Load: null,
});


const init = () =>
  Update({
    model: Maybe.None(),
    cmds: [ [get(URL), Action.Load] ],
  });


const update = (action, model) => Action.match(action, {
  Load: data =>
    Update({ model: Maybe.Some(data) }),
});


const view = model =>
  Maybe.match(model, {
    None: () => (
      <p>Loading from GitHub...</p>
    ),
    Some: data => (
      <div>
        <h3>GitHub repo info for {data.full_name}</h3>
        <ul>
          <li>language: {data.language}</li>
          <li>last pushed: {new Date(data.pushed_at).toLocaleTimeString()}</li>
          <li>stars: {data.stargazers_count}</li>
          <li>forks: {data.forks_count}</li>
          <li>open issues: {data.open_issues}</li>
        </ul>
      </div>
    ),
  });


export default Spindle('RepoInfo',
  { Action, init, update, view });
