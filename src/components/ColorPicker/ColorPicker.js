import React, { useState, useEffect } from 'react';
import types from 'prop-types';
import { ChromePicker } from 'react-color';
import cx from 'classnames';
import useClickOutside from '../../services/clickOutside';
import { applyDefaults } from '../../utils';

import './ColorPicker.scss';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
ColorPicker.propTypes = {
  name: types.string,
  color: types.string,
  className: types.string,
  propertyName: types.string,
  disabled: types.bool,
  setValue: types.func,
  onChange: types.func,
  icon: types.object
};

const COLOR_PICKER_DEFAULTS = { disabled: false, color: '#ffffff' };

function ColorPicker(rawProps) {
  const props = applyDefaults(COLOR_PICKER_DEFAULTS, rawProps);
  // Local state
  const [isActive, setActive] = useState(false);
  const [color, setColor] = useState(props.color);

  const innerRef = useClickOutside(() => {
    setActive(false);
  });

  function toggleActive() {
    setActive((prevIsActive) => !prevIsActive);
  }

  function handleChange(color) {
    setColor(color.hex);
    if (props.setValue) {
      props.setValue(color.hex);
    }
    if (props.onChange) {
      props.onChange(color.hex);
    }
  }

  useEffect(() => {
    setColor(props.color);
  }, [props.color]);

  // Render
  return (
    <div ref={innerRef} className={cx('color-picker', props.className)} type={'color-picker'}>
      <button
        className={cx('color-box', `${props.propertyName}-cls`, { active: isActive })}
        onClick={toggleActive}
        style={
          props.icon
            ? { backgroundColor: 'transparent' }
            : {
                backgroundColor: color,
                border: '1px solid #D8D8D8'
              }
        }
      >
        {props.icon}
        {props.icon && <span className="color-line" style={{ backgroundColor: color }} />}
      </button>
      <ChromePicker
        className="picker"
        color={color}
        onChange={handleChange}
        disabled={props.disabled}
        disableAlpha={false}
      />
      {/* <p className="name">{props.name}</p> */}
      {/* <p className="hex">{color}</p> */}
    </div>
  );
}

export default ColorPicker;
