import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Union } from 'results';


const validUpdateKeys = {
  model: true,
  cmds: true,
  cb: true,
};

export function Update(stuff) {
  if (!(this instanceof Update)) {
    return new Update(stuff);
  }
  if (typeof stuff === 'undefined') {
    return this;
  }
  Object.keys(stuff).forEach(k => {
    if (typeof validUpdateKeys[k] === 'undefined') {
      throw new TypeError(`Unrecognized key \`${k}\` supplied to Update(). ` +
        `Valid keys: ${Object.keys(validUpdateKeys).join(', ')}`);
    }
  });
  Object.assign(this, stuff);
};


const assertType = (who, checker, value, name, source) => {
  const result = checker({ [who]: value }, who, `${name} => ${source}`, 'prop');
  if (result instanceof Error) {
    console.error(result);
  }
};


const propsEq = (a, b) => {
  for (const k in a) {
    if (a[k] !== b[k]) return false;
  }
  return Object.keys(a).length === Object.keys(b).length;
};


export const Cmd = Immutable.Record({
  run: null,
  abort: null,
});


export const Sub = Immutable.Record({
  key: null,
  start: null,
  stop: null,
});


export function cmd(c, Tag) {
  return [ c, Tag ];
}


export function sub(s, Tag) {
    return [ s, Tag ];
}


export const TypedUnion = options => {
  const U = Union(options);
  Object.keys(options).forEach(o => {
    const C = U[o];
    U[o] = x => {
      assertType('payload', options[o], x, `TypedUnion{${Object.keys(options).join(',')}}`, o);
      return C(x);
    };
  });
  return U;
}


const ComponentEffects = Immutable.Record({
  subs: Immutable.Set(),
  cmds: Immutable.List(),
});


const createSpindle = () => {
  let components = Immutable.Map();
  let subscriptions = Immutable.Map();

  return {
    register: component =>
      components = components.set(component, ComponentEffects()),
    unregister: component => {
      // abort cmds
      // cancel subs
      components = components.delete(component);
    },
    pushCmds: (component, cmds) => {
      cmds.forEach(([ c, Tag ]) => {
        c.get('run')(payload => component._dispatch(Tag(payload)));
      });
    },
    updateSubs: (component, subs) => {
      subs.forEach(([ s, Tag ]) => {
        const k = s.get('key');
        let go;
        if (!subscriptions.has(k)) {
          go = (state, msg) => {
            subscriptions
              .getIn([k, 'subscribers'])
              .forEach(suber => suber(msg));
            subscriptions = subscriptions.setIn([k, 'state'], state);
          };
          subscriptions = subscriptions.set(k, Immutable.Map({
            msg: go,
            state: null,
            subscribers: Immutable.Map(),
          }));
        }
        subscriptions = subscriptions.setIn([k, 'subscribers', Tag],
          payload => component._dispatch(Tag(payload)));
        if (go) {
          subscriptions = subscriptions.setIn([k, 'state'], s.start(go));
        }
      });
    },
  };
};


const bindActions = (dispatch, Action) =>
  Object.keys(Action.options).forEach(k =>
    dispatch[k] = payload => dispatch(Action[k](payload)));


export default function Spindle(name, {
  Action = Union({}),
  init = () => Update(),
  propsUpdate = () => Update(),
  update = () => Update(),
  view = () => null,
  subscriptions = () => [],
  modelType = PropTypes.any,
  cbTypes = {},
  propTypes: componentPropTypes = {},
}) {
  class Component extends React.Component {
    constructor(props, context) {
      super(props, context);

      if (typeof context.spindle === 'undefined') {
        this._isSpindleRoot = true;
        this._spindle = createSpindle();
      } else {
        this._isSpindleRoot = false;
        this._spindle = undefined;  // only for the root
      }
      this.getSpindle().register(this);

      this._dispatch = action =>
        this.queue(update(action, this._model), 'update', action);
      bindActions(this._dispatch, Action);

      this._model = null;
    }

    componentWillMount() {
      this.queue(init(this.props), 'init');
    }

    getChildContext() {
      return { spindle: this.context.spindle || this._spindle };
    }

    componentWillReceiveProps(nextProps) {
      if (!propsEq(this.props, nextProps)) {
        this.queue(propsUpdate(nextProps, this._model), 'propsUpdate');
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !propsEq(nextProps, this.props) ||
             !Immutable.is(nextState.model, this.state.model);
    }

    componentWillUnmount() {
      this.getSpindle().unregister(this);
    }

    getSpindle() {
      return this.context.spindle || this._spindle;
    }

    queue(update, source, action) {
      if (!(update instanceof Update)) {
        if (action && action.name && action.payload) {
          source = `${source} => ${action.name}(${action.payload || ''})`
        }
        throw new TypeError(`${name}'s \`${source}\` function returned \`${typeof update}\`. ` +
          `Did you forget to wrap a new model in \`Update({ model: ... })\`?`);
      }

      const { model, cmds, cb } = update;

      if (typeof model !== 'undefined') {
        assertType('model', modelType, model, name, source);
        this._model = model;
      }

      if (typeof cmds !== 'undefined') {
        this.getSpindle().pushCmds(this, cmds);
      }

      const subs = subscriptions(this._model);
      this.getSpindle().updateSubs(this, subs);

      if (typeof cb !== 'undefined') {
        Object.keys(cb)
          .filter(prop =>
            this.props[prop])
          .forEach(prop => {
            if (cbTypes.hasOwnProperty(prop)) {
              assertType(`cb: { ${prop} }`, cbTypes[prop], cb[prop], name, source);
            }
            this.props[prop](cb[prop]);
          });
      }

      if (source === 'init') {
        this.state = { model: this._model };
      } else {
        this.setState({ model: this._model });
      }
    }

    render() {
      return view(this._model, this._dispatch, this.props);
    }
  }

  Object.assign(Component, {
    displayName: name,
    contextTypes: {
      spindle: PropTypes.object,
    },
    childContextTypes: {
      spindle: PropTypes.object,
    },
    propTypes: componentPropTypes,
  });
  return Component;
};


// be friendly to cjs modules
Object.assign(exports['default'], exports);  // attach all the exports to Spindle
module.exports = exports['default'];  // export it like a cjs module
