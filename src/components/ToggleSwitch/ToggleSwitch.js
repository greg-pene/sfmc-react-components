import React, { useEffect, useState } from 'react';
import t from '../../services/i18n';
import types from 'prop-types';
import Switch from 'react-switch';
import { default as FieldWrapper } from '../FieldWrapper';
import { applyDefaults } from '../../utils';

import './ToggleSwitch.scss';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
ToggleSwitch.propTypes = {
  label: types.string,
  checked: types.bool,
  onChange: types.func,
  disabled: types.bool
};

const TOGGLE_SWITCH_DEFAULTS = { checked: false };

function ToggleSwitch(rawProps) {
  const props = applyDefaults(TOGGLE_SWITCH_DEFAULTS, rawProps);
  // Local state
  const [checked, setCheck] = useState(props.checked || false);

  useEffect(() => {
    if (props.checked !== undefined) {
      setCheck(props.checked);
    }
  }, [props.checked]);

  function handleChange(checked) {
    setCheck(checked);
    if (props.onChange) {
      props.onChange(checked);
    }
  }
  // Render
  return (
    <FieldWrapper type={'switch'}>
      <label className="switch-container">
        <Switch
          className="toggle-switch"
          checked={checked || false}
          onChange={handleChange}
          handleDiameter={10}
          height={10}
          width={24}
          offColor="#bdbdbd"
          onColor="#0078ff"
          checkedIcon={false}
          uncheckedIcon={false}
          activeBoxShadow="0 0 1px 1px #0078ff"
          disabled={props.disabled}
        />
        {t('labels.' + props.label, props.label)}
      </label>
    </FieldWrapper>
  );
}

export default ToggleSwitch;
