import React, { useState, useEffect } from 'react';
import types from 'prop-types';
import { default as FieldWrapper } from '../FieldWrapper';
import { default as Rselect } from 'react-select';
import { withFormsy } from 'formsy-react';

import './Select.scss';
import { default as Tooltip } from '../Tooltip';
// import { Info } from '../../assets';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
Select.propTypes = {
  options: types.array,
  disabled: types.bool,
  pristine: types.any,
  value: types.string,
  setValue: types.any,
  label: types.string,
  fieldInfo: types.string
};

// Default props
Select.defaultProps = {};

export function Select(props) {
  // Local state
  const defaultValue = props.options.filter((option) => option.value === props.pristine).pop();
  const [curOption, setCurOption] = useState(props.value || defaultValue);

  function handleChange(value) {
    if (value) {
      setCurOption(value);
      if (props.setValue) {
        props.setValue(value.value);
      }
    }
  }
  useEffect(() => {
    const pristine = props.options.filter((option) => option.value === props.pristine).pop();
    handleChange(pristine);
  }, [props.pristine]);

  let sel;
  let select = (
    <Rselect
      onChange={(value) => handleChange(value)}
      options={props.options}
      value={curOption || null}
      defaultValue={defaultValue}
      isDisabled={props.disabled}
      className="select"
      classNamePrefix
    />
  );
  if (props.label) {
    sel = (
      <label>
        {props.label}
        {props.fieldInfo && <Tooltip content={props.fieldInfo} />}
        {select}
      </label>
    );
  } else {
    sel = select;
  }

  // Render
  return <FieldWrapper type={'select'}>{sel}</FieldWrapper>;
}

export default withFormsy(Select);
