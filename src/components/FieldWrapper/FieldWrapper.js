import React from 'react';
import './FieldWrapper.scss';
import types from 'prop-types';
import cx from 'classnames';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
FieldWrapper.propTypes = {
  type: types.string,
  className: types.string,
  disabled: types.bool,
  children: types.any
};

function FieldWrapper({ disabled = false, ...restProps }) {
  const props = { disabled, ...restProps };
  // Render
  return (
    <div
      className={cx(
        'field-container',
        'field-type-' + props.type,
        { 'field-disabled': props.disabled },
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export default FieldWrapper;
