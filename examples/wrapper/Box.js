import React, { PropTypes } from 'react';
import Spindle from '../../spindle';


const propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};


const view = (_, __, props) => (
  <div style={{ border: '1px solid #f6f', margin: '1em 0', width: '50%' }}>
    <h2 style={{ background: '#f6f', margin: 0 }}>
      {props.title}
    </h2>
    <div style={{ padding: '1em' }}>
      {props.children}
    </div>
  </div>
);


module.exports = Spindle('Box', { propTypes, view });
