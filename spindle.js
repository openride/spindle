import React, { PropTypes } from 'react';
import Immutable from 'immutable';


export const Update = Immutable.Record({
  model: undefined,  // sentient object w/ its own identity
  cmd: undefined,
});


const bindMsg = (Msg, dispatch) =>
  Object.keys(Msg.options)
    .map(k => ({ [k]: p => dispatch(Msg[k](p)) }))
    .reduce((a, b) => Object.assign(a, b), {});


class ComponentBase extends React.Component {}


const UNINITIALIZED = {};  // sentient


export function component(name, init, Msg, update, view) {
  class Component extends ComponentBase {
    constructor(props) {
      super(props);
      this.state = { model: UNINITIALIZED };
      this.childRefs = {};
      this.boundMsg = bindMsg(Msg, this.props._spindleDispatch);
    }

    shouldComponentUpdate(_, nextState) {
      return !Immutable.is(nextState.model, this.state.model);
    }

    init = (...args) =>
      this.setState({ model: init(...args) })

    forwardMsg = key => msg => {
      this.childRefs[key].update(msg);
      return Update();
    };

    update = msg => {
      const { model, cmd } = update(msg, this.state.model, this.forwardMsg).toObject();
      this.setState({ model });
    }

    mount = (Component, tagMsg, key) => (
      <Component
          _spindleDispatch={tagMsg}
          ref={r => {
            this.childRefs[key] = r;
            r && r.init();
          }} />
    )

    render() {
      return this.state.model === UNINITIALIZED
        ? null  // render nothing until we have initial state
        : view(this.state.model, this.boundMsg, this.mount);
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

  componentDidMount() {
    this.componentInstance.init();
  }

  componentInstance = null

  setRef = ref =>
    this.componentInstance = ref

  handleDispatch = payload =>
    this.componentInstance.update(payload)

  render() {
    const { component: Component } = this.props;
    return (
      <Component
          _spindleDispatch={this.handleDispatch}
          ref={this.setRef} />
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
