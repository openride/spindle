import React from 'react';


export default class AutofocusingInput extends React.Component {
  componentDidMount() {
    this.el.focus();
  }
  render() {
    return <input {...this.props} ref={el => this.el = el} />
  }
}
