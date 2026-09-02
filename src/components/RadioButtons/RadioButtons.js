import React, { useEffect, useState } from 'react';
import types from 'prop-types';
import { RadioGroup, Radio } from 'react-radio-group';
import cx from 'classnames';
import classNames from 'classnames';
import './RadioButtons.scss';
import { default as FieldWrapper } from '../FieldWrapper';
import { withFormsy } from 'formsy-react';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
RadioButtons.propTypes = {
  value: types.oneOfType([types.string, types.number]),
  label: types.string,
  propertyName: types.string,
  className: types.string,
  items: types.arrayOf(types.object),
  setValue: types.any,
  disabled: types.bool
};

export function RadioButtons({ disabled = false, ...restProps }) {
  const props = { disabled, ...restProps };
  const [selection, setSelection] = useState(props.value);
  function handleChange(value) {
    setSelection(value);
    if (props.setValue) {
      props.setValue(value);
    }
  }

  useEffect(() => {
    if (props.value) {
      setSelection(props.value);
    }
  }, [props.value]);

  // Render
  return (
    <FieldWrapper type={'radio-group'}>
      <label>
        {props.label}
        <RadioGroup
          className={cx('radio', props.className, props.disabled ? 'disabled' : '')}
          name="radio"
          selectedValue={selection}
          onChange={handleChange}
        >
          {props.items.map((item) => (
            <label
              key={item.value}
              className={classNames(props.value === item.value ? 'active' : '', {
                'with-image': item.img,
                'with-label': item.label,
                'with-icon': item.icon
              })}
            >
              <Radio id={item.value} value={item.value} disabled={props.disabled} />
              {item.img && <img src={item.img} alt={item.label || item.value} />}
              {item.icon}
              {item.label && <div className="radio-label">{item.label}</div>}
            </label>
          ))}
        </RadioGroup>
      </label>
    </FieldWrapper>
  );
}

export const formsyRadioButtons = withFormsy(RadioButtons);
