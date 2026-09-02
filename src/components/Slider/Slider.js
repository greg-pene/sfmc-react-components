import React, { useState, useEffect, useCallback } from 'react';
import types from 'prop-types';
import { withFormsy } from 'formsy-react';
import { default as RangeSlider } from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import debounce from 'lodash.debounce';
import cx from 'classnames';

import './Slider.scss';
import t from '../../services/i18n';
import { default as Tooltip } from '../Tooltip';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
Slider.propTypes = {
  label: types.string,
  value: types.number,
  setValue: types.func,
  defaultValue: types.number,
  delay: types.number,
  fieldInfo: types.string,
  tooltipPlacement: types.string,
  tooltip: types.bool,
  min: types.any,
  max: types.any,
  sliderLabels: types.object,
  disabled: types.bool,
  hidden: types.bool
};

// Default props
Slider.defaultProps = {
  delay: 1000,
  tooltip: true,
  fieldInfo: '',
  tooltipPlacement: 'top',
  min: 0,
  max: 100,
  disabled: false,
  hidden: false
};

export default function Slider(props) {
  // Local state
  const [val, setVal] = useState(props.value);

  const setParent = useCallback(
    debounce((v) => {
      if (props.setValue) {
        props.setValue(v);
      }
    }, props.delay),
    []
  );

  function handleChange(v) {
    if (props.disabled) {
      return;
    }
    setVal(v);
    setParent(v);
  }

  useEffect(() => {
    if (props.value !== val) {
      setVal(props.value);
    }
  }, [props.value]);

  const { hidden } = props;
  // Render
  return (
    !hidden && (
      <div className={cx('slider', props.disabled ? 'disabled' : '')}>
        <label className="slider-label">
          {props.label}
          {props.fieldInfo && (
            <Tooltip content={props.fieldInfo} placement={props.tooltipPlacement} />
          )}
          <RangeSlider
            orientation="horizontal"
            value={val}
            min={props.min}
            max={props.max}
            labels={props.sliderLabels}
            onChange={handleChange}
            tooltip={props.tooltip}
          />
        </label>
      </div>
    )
  );
}

export const formsySlider = withFormsy(Slider);
