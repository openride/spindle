import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Union } from './results';


export const Update = Immutable.Record({
  model: undefined,
  cmd: undefined,
  emit: undefined,
});


const bindMsg = (Msg, dispatch) =>
  Object.keys(Msg.options)
    .map(k => ({ [k]: p => dispatch(Msg[k](p)) }))
    .reduce((a, b) => Object.assign(a, b), {});


const spindle = () => ({
  cmd: cmd => console.log('hi', cmd),
});


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
      this.state = { model: init(props) };
      this._boundMsg = bindMsg(Msg, this.update.bind(this));
    }

    getChildContext() {
      if (!this.context.spindle && !this._spindle) {
        this._spindle = spindle();
      }
      return { spindle: this.context.spindle || this._spindle };
    }

    shouldComponentUpdate(_, nextState) {
      return !Immutable.is(nextState.model, this.state.model);
    }

    getSpindle() {
      return this.context.spindle || this._spindle;
    }

    update(msg) {
      const { model, cmd, emit } = update(msg, this.state.model).toObject();
      model && this.setState({ model });
      cmd && this.getSpindle().cmd(cmd);
      emit && this.props.onEmit && this.props.onEmit(emit);
    }

    render() {
      return view(this.state.model, this._boundMsg);
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
