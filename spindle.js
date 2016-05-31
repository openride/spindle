import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Union } from 'results';


export const Update = Immutable.Record({
  model: undefined,
  cmds: undefined,
  emit: undefined,
});


const bindMsg = (Msg, update, c) =>
  Object.keys(Msg.options)
    .map(k => ({ [k]: msg => c.run(update(Msg[k](msg), c.state.model, c.props, c._boundMsg)) }))
    .reduce((a, b) => Object.assign(a, b), {});


export const Cmd = Immutable.Record({
  run: null,
  abort: null,
});


export const Sub = Immutable.Record({
  key: null,
  start: null,
  stop: null,
});


export function cmd(c, boundMsg) {
  return [ c, boundMsg ];
}


export function sub(s, boundMsg) {
    return [ s, boundMsg ];
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
      cmds.forEach(([ c, boundMsg ]) => {
        c.get('run')(boundMsg);
      });
    },
    updateSubs: (component, subs) => {
      subs.forEach(([ s, boundMsg ]) => {
        const k = s.get('key');
        if (!subscriptions.has(k)) {
          const go = (state, msg) => {
            subscriptions
              .getIn([k, 'subscribers'])
              .forEach(suber => suber(msg));
            subscriptions = subscriptions.setIn([k, 'state'], state);
          };
          subscriptions = subscriptions.set(k, Immutable.Map({
            msg: go,
            state: s.start(go),
            subscribers: Immutable.Set(),
          }));
        }
        subscriptions = subscriptions.updateIn([k, 'subscribers'], subers =>
          subers.add(boundMsg));
      });
    },
  };
};


export function component(name, {
  Model,
  Msg,
  update,
  view,
  subscriptions = () => [],
}) {
  class Component extends React.Component {
    constructor(props) {
      super(props);
      this.state = { model: null };
      this._isSpindleRoot = null;
      this._spindle = undefined;  // only for the root
      this._unregister = null;
      this._boundMsg = bindMsg(Msg, update, this);
    }

    componentDidMount() {
      if (typeof this.context.spindle === 'undefined') {
        this._isSpindleRoot = true;
        this._spindle = createSpindle();
      } else {
        this._isSpindleRoot = false;
      }
      this.getSpindle().register(this);
      this.run(Update({ model: Model() }));
    }

    getChildContext() {
      return { spindle: this.context.spindle || this._spindle };
    }

    shouldComponentUpdate(_, nextState) {
      return !Immutable.is(nextState.model, this.state.model);
    }

    componentWillUpdate(_, nextState) {
      const subs = subscriptions(this.state.model, this._boundMsg);
      this.getSpindle().updateSubs(this, subs);
    }

    componentWillUnmount() {
      this.getSpindle().unregister(this);
    }

    getSpindle() {
      return this.context.spindle || this._spindle;
    }

    run(update) {
      const { model, cmds, emit } = update.toObject();
      model && this.setState({ model });
      cmds && this.getSpindle().pushCmds(this, cmds);
      emit && this.props.onEmit && this.props.onEmit(emit);
    }

    render() {
      return this._isSpindleRoot === null  // ie., has initialized
        ? null  // no model until postContextConstructor, after first render
        : view(this.state.model, this._boundMsg);
    }
  }
  Object.assign(Component, {
    displayName: name,
    contextTypes: {
      spindle: React.PropTypes.object,
    },
    childContextTypes: {
      spindle: React.PropTypes.object,
    },
  });
  return Component;
};
