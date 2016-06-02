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
    .map(k => ({ [k]: msg =>
      c.run(update(Msg[k](msg), c.state.model, c._boundMsg)) }))
    .reduce((a, b) => Object.assign(a, b), {});


const propsEq = (a, b) => {
  for (const k in a) {
    if (a[k] !== b[k] && k !== 'onEmit' && k !== 'children') return false;
  }
  const aCount = Object.keys(a).length - !!a.onEmit - !!a.children;
  const bCount = Object.keys(b).length - !!b.onEmit - !!b.children;
  return aCount === bCount;
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
  Model = Immutable.Record({}),
  Msg = Union({}),
  handleProps = (_, model) => Update({ model }),
  update,
  view,
  subscriptions = () => [],
  propTypes: componentPropTypes = {},
}) {
  class Component extends React.Component {
    constructor(props) {
      super(props);
      this.state = { model: Model() };
      this._hasInitialized = false;
      this._isSpindleRoot = null;
      this._spindle = undefined;  // only for the root
      this._unregister = null;
      this._cmdQueue = [];
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
      this.run(handleProps(this.props, this.state.model, this._boundMsg));
      this._hasInitialized = true;
      this.forceUpdate();  // grosssssssssss
    }

    getChildContext() {
      return { spindle: this.context.spindle || this._spindle };
    }

    componentWillReceiveProps(nextProps) {
      if (!propsEq(this.props, nextProps)) {
        this.run(handleProps(nextProps, this.state.model, this._boundMsg));
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextProps.children !== this.props.children ||  // is this first check necessary?
            !Immutable.is(nextState.model, this.state.model);
    }

    componentWillUpdate(_, nextState) {
      const subs = subscriptions(this.state.model, this._boundMsg);
      this.getSpindle().updateSubs(this, subs);
    }

    componentDidUpdate() {
      this.getSpindle().pushCmds(this, this._cmdQueue);
      this._cmdQueue = [];
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
      cmds && (this._cmdQueue = this._cmdQueue.concat(cmds));
      typeof emit !== 'undefined' && this.props.onEmit && this.props.onEmit(emit);
    }

    render() {
      return this._hasInitialized
        ? view(this.state.model, this._boundMsg, this.props.children)
        : null;  // can't mount children until we can set up context
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
    propTypes: {
      ...componentPropTypes,
      onEmit: PropTypes.func,  // optional
    }
  });
  return Component;
};
