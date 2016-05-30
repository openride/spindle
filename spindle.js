import React, { PropTypes } from 'react';
import Immutable from 'immutable';


export const Update = Immutable.Record({
  model: {},  // sentient object w/ its own identity
  cmd: {},
});


const bindMsg = (Msg, dispatch) =>
  Object.keys(Msg.options)
    .map(k => ({ [k]: p => dispatch(Msg[k](p)) }))
    .reduce((a, b) => Object.assign(a, b), {});


class ComponentBase extends React.Component {}


export function component(name, init, Msg, update, view) {
  class Component extends ComponentBase {
    constructor(props) {
      super(props);
      this.state = init();
      this.boundMsg = bindMsg(Msg, this.props._spindleDispatch);
    }

    shouldComponentUpdate(_, nextState) {
      return !nextState.is(this.state);
    }

    render() {
      return view(this.state, this.boundMsg);
    }
  }
  Object.assign(Component, {
    displayName: name,
    propTypes: {
      _spindleDispatch: PropTypes.func.isRequired
    },
  });
  return Component;
};


const isClass = (A, B) =>
  A.prototype instanceof B || A === B

export class SpindleRoot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p>yo</p>
    );
  }
};
SpindleRoot.propTypes = {
  component: function(props, propName, componentName) {
    const cls = props[propName];
    if (typeof cls === 'undefined') {
      return new Error(`Prop '${propName}' of ${componentName} is required`);
    }
    if (!isClass(cls, ComponentBase)) {
      return new Error(`Prop '${propName}' of ${componentName} is a '${(cls && cls.name) ? cls.name : '???'}'. Expected a Component class created by 'spindle.component(...)'`);
    }
  },
};
