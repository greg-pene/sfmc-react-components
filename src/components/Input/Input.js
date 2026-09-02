import React, { useState, useEffect } from 'react';
import types from 'prop-types';

import './Input.scss';
import cx from 'classnames';
import { default as Tooltip } from '../Tooltip';
import { default as FieldWrapper } from '../FieldWrapper';
// import { Info } from '../../assets';
import { withFormsy } from 'formsy-react';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
Input.propTypes = {
  title: types.string,
  value: types.oneOfType([types.string, types.number]),
  setValue: types.any,
  placeholder: types.string,
  disabled: types.bool,
  label: types.string,
  fieldInfo: types.string,
  type: types.string
};

export function Input({
  title = 'The Title',
  value = '',
  type = 'text',
  placeholder = '',
  ...restProps
}) {
  const props = { title, value, type, placeholder, ...restProps };
  // Local state
  const [text, setText] = useState(props.value);

  useEffect(() => {
    if (props.value && props.value !== text) {
      setText(props.value);
    }
  }, [props.value]);

  function handleChange(event) {
    let val = event.target.value;
    setText(val);
    if (props.setValue) {
      props.setValue(val);
    }
  }
  let inp;
  let input = (
    <input
      className={cx('input')}
      type={props.type}
      value={text}
      placeholder={props.placeholder}
      disabled={props.disabled}
      onChange={handleChange}
    />
  );

  if (props.label) {
    inp = (
      <label>
        {props.label}
        {props.fieldInfo && <Tooltip content={props.fieldInfo} />}
        {input}
      </label>
    );
  } else {
    inp = input;
  }

  // Render
  return <FieldWrapper type={'input'}>{inp}</FieldWrapper>;
}

export const formsyInput = withFormsy(Input);
