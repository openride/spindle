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


export const Cmd = options => {
  assertType('options', PropTypes.shape({
    run: PropTypes.func.isRequired,
    abort: PropTypes.func.isRequired,
  }), options, 'Cmd', 'setup');
  return options;
};


export const Sub = (ns, options) => {
  // assertType('ns', symbolType, ns, 'Sub', 'setup');
  assertType('options', PropTypes.shape({
    key: PropTypes.string.isRequired,
    start: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
  }), options, 'Sub', 'setup');
  return { ns, ...options };
};


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
};


const createSpindle = () => {
  const components = new Map();
  const subscriptions = new Map();  // ns => Map(key => sub)

  return {
    register: component =>
      components.set(component, { subs: [], cmds: [] }),
    unregister: component => {
      components.get(component).cmds.forEach(cmd =>
        cmd.abort(cmd.state));
      components.delete(component);
    },
    pushCmds: (component, cmds) => {
      cmds.forEach(([{ run, abort }, Tag ]) => {
        const ccmds = components.get(component).cmds;
        const cmd = { state: null, abort };
        ccmds.push(cmd);
        const finish = () =>
          ccmds.splice(ccmds.indexOf(cmd), 1);
        const msg = payload =>
          component._dispatch(Tag(payload));
        cmd.state = run(msg, finish);
      });
    },
    updateSubs: (component, subs) => {
      // ensure all subs are set up and started
      subs.forEach(([{ ns, key, start, stop }, Tag]) => {
        if (!subscriptions.has(ns)) {
          subscriptions.set(ns, new Map());
        }
        const nsSubs = subscriptions.get(ns);
        if (!nsSubs.has(key)) {
          const sub = { stop, state: null };
          sub.state = start((next, payload) => {
            sub.state = next;
            components.forEach(({ subs: subs_ }, c) =>
              subs_
                .filter(([n, k]) =>
                  n === ns && k === key)
                .forEach(([_, __, T]) =>
                  c._dispatch(T(payload))));
          });
          nsSubs.set(key, sub);
        }

      });

      // update the component's subscriptions
      components.get(component).subs = subs
        .map(([{ ns, key }, Tag]) =>
          [ns, key, Tag]);

      // super-wastefully turn off all unused subs
      subscriptions.forEach((nsSubs, ns) =>
        nsSubs.forEach((sub, key) => {
          for (const [c, { subs }] of components) {
            if (subs.some(([n, k]) =>
                n === ns && k === key)) {
              return;
            }
          }
          sub.stop(sub.state);
          nsSubs.delete(key);
        }));
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
