import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Union } from './results';


export const Update = Immutable.Record({
  model: undefined,
  cmd: undefined,
  emit: undefined,
});


const bindMsg = (Msg, update, c) =>
  Object.keys(Msg.options)
    .map(k => ({ [k]: msg => c.run(update(Msg[k](msg), c.state.model, c.props)) }))
    .reduce((a, b) => Object.assign(a, b), {});


const createSpindle = () => {
  return {
    cmd: cmd => console.log('hi', cmd),
    register: component => console.log('register hi there', component),
    updateSubs: x => console.log('so you want to sub huh', x),
  };
};


export function component(name, {
  init,
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
      this._unregister = (this.context.spindle || this._spindle).register(this);
      this.run(init(this.props));
    }

    getChildContext() {
      return { spindle: this.context.spindle || this._spindle };
    }

    shouldComponentUpdate(_, nextState) {
      return !Immutable.is(nextState.model, this.state.model);
    }

    componentWillUpdate(_, nextState) {
      this.getSpindle().updateSubs(subscriptions(this.state.model));
    }

    componentWillUnmount() {
      this._unregister();
    }

    getSpindle() {
      return this.context.spindle || this._spindle;
    }

    run(update) {
      const { model, cmd, emit } = update.toObject();
      model && this.setState({ model });
      cmd && this.getSpindle().cmd(cmd);
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
