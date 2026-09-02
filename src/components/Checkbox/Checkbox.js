import React, { useEffect } from 'react';
import t from '../../services/i18n';
import types from 'prop-types';
import cx from 'classnames';
import { default as FieldWrapper } from '../FieldWrapper';
import { withFormsy } from 'formsy-react';
import './Checkbox.scss';
import { default as Tooltip } from '../Tooltip';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
Checkbox.propTypes = {
  label: types.string,
  setValue: types.func,
  checked: types.bool,
  disabled: types.bool,
  fieldInfo: types.string,
  tooltipPlacement: types.string
};

export default function Checkbox({
  label = 'Label',
  checkbox = false,
  disabled = false,
  fieldInfo = '',
  ...restProps
}) {
  const props = { label, checkbox, disabled, fieldInfo, ...restProps };
  function handleChange(value) {
    props.setValue(value);
  }

  useEffect(() => {
    if (props.setValue) {
      props.setValue(props.checked);
    }
  }, [props.checked]);

  // Render
  return (
    <FieldWrapper type={'checkbox'}>
      <label className={cx('checkbox-container', { disabled: props.disabled })}>
        <input
          type="checkbox"
          checked={props.checked}
          disabled={props.disabled}
          onChange={(e) => handleChange(e.target.checked)}
        />
        {t('labels.' + props.label, props.label)}
        {props.fieldInfo && (
          <Tooltip content={props.fieldInfo} placement={props.tooltipPlacement} />
        )}
      </label>
    </FieldWrapper>
  );
}

export const formsyCheckbox = withFormsy(Checkbox);
