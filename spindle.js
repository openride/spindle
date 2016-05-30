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
      this.boundMsg = bindMsg(Msg, this.update);
    }

    shouldComponentUpdate(_, nextState) {
      return !Immutable.is(nextState.model, this.state.model);
    }

    update = msg => {
      const { model, cmd, emit } = update(msg, this.state.model).toObject();
      model && this.setState({ model });
      // TODO: cmd
      emit && this.props.onEmit && this.props.onEmit(emit);
    }

    render() {
      return view(this.state.model, this.boundMsg);
    }
  }
  Object.assign(Component, {
    displayName: name,
  });
  return Component;
};
