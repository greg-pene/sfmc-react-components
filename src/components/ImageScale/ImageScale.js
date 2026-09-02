import React, { useState, useEffect } from 'react';
import types from 'prop-types';
import { withFormsy } from 'formsy-react';

import './ImageScale.scss';
import t from '../../services/i18n';
import InputNumber from 'rc-input-number';
import { IoMdLock } from 'react-icons/io';
import { useDebouncedCallback } from 'use-debounce';
import { calcAspects } from '../../utils';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
ImageScale.propTypes = {
  value: types.object,
  setValue: types.func,
  label: types.string,
  disabled: types.bool,
  width: types.number,
  height: types.number
};

export default function ImageScale({ disabled = false, ...restProps }) {
  const props = { disabled, ...restProps };
  const [state, setState] = useState(props.value);
  const [aspectRatio, setAspectRatio] = useState(calcAspects(props.width, props.height));

  function updateState(val) {
    setState(val);
    if (props.setValue) {
      props.setValue(val);
    }
  }
  const { width, height } = props;

  useEffect(() => {
    setAspectRatio(calcAspects(width, height));
  }, [width, height]);

  useEffect(() => {
    if (props.value) {
      setState(props.value);
    }
  }, [props.value]);

  const handleWidthChange = useDebouncedCallback((val) => {
    let v = {
      width: val,
      height: Math.round(aspectRatio.hAsspect * val)
    };
    updateState(v);
  }, 500);

  const handleHeightChange = useDebouncedCallback((val) => {
    let v = {
      height: val,
      width: Math.round(aspectRatio.wAsspect * val)
    };
    updateState(v);
  }, 500);

  // Render
  return (
    <div className="field-container image-size-container">
      <h5 className="section-header">{props.label || t('widgetTitles.scaleImage')}</h5>
      <span>
        <label>
          {t('labels.width')}
          <InputNumber
            min={1}
            value={state.width}
            disabled={props.disabled}
            onChange={handleWidthChange}
          />
        </label>
        <IoMdLock />
        <label>
          {t('labels.height')}
          <InputNumber
            min={1}
            value={state.height}
            disabled={props.disabled}
            onChange={handleHeightChange}
          />
        </label>
      </span>
    </div>
  );
}

export const formsyImageScale = withFormsy(ImageScale);
