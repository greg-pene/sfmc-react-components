import React, { useContext } from 'react';
import { FabricContext } from '../context/FabricContext';
import types from 'prop-types';
import Select, { components } from 'react-select';
import 'rc-tooltip/assets/bootstrap.css';
import { default as RcTooltip } from 'rc-tooltip';
import { align } from '../libs/utils';
import t from '../../../services/i18n';

import { AiOutlineCaretDown } from 'react-icons/ai';
import {
  CgAlignLeft,
  CgAlignCenter,
  CgAlignRight,
  CgAlignTop,
  CgAlignMiddle,
  CgAlignBottom
} from 'react-icons/cg';

FabricLayersAlign.propTypes = {
  data: types.any
};

function FabricLayersAlign() {
  const { canvas } = useContext(FabricContext);
  function handleChange(val) {
    if (canvas) {
      align(canvas, val);
    }
  }
  /*
  const handleChange = useCallback(
    (val) => {
      align(canvas, val);
    },
    [canvas]
  );
*/

  const isDisabled = canvas && canvas._activeObject && canvas._activeObject._objects ? false : true;

  const TooltipWrapper = ({ showTooltip, children }) => {
    return showTooltip ? (
      <RcTooltip placement="bottom" overlay={t('fieldTooltip.align')} mouseEnterDelay={0.1}>
        {children}
      </RcTooltip>
    ) : (
      children
    );
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <AiOutlineCaretDown />
      </components.DropdownIndicator>
    );
  };

  const options = [
    {
      label: t('labels.horizontal'),
      options: [
        { value: 'left', label: 'Left', icon: <CgAlignLeft /> },
        { value: 'center', label: 'Center', icon: <CgAlignCenter /> },
        { value: 'right', label: 'Right', icon: <CgAlignRight /> }
      ]
    },
    {
      label: t('labels.vertical'),
      options: [
        { value: 'top', label: 'Top', icon: <CgAlignTop /> },
        { value: 'middle', label: 'Middle', icon: <CgAlignMiddle /> },
        { value: 'bottom', label: 'Bottom', icon: <CgAlignBottom /> }
      ]
    }
  ];

  const { Option } = components;
  const IconOption = (props) => (
    <Option {...props}>
      {props.data.icon}
      <label>{props.data.label}</label>
    </Option>
  );

  return (
    <TooltipWrapper showTooltip={isDisabled}>
      <div className="align-select">
        <Select
          placeholder={t('labels.align')}
          isSearchable={false}
          options={options}
          onChange={handleChange}
          components={{ DropdownIndicator, Option: IconOption }}
          classNamePrefix
          isDisabled={isDisabled}
        />
      </div>
    </TooltipWrapper>
  );
}

export default FabricLayersAlign;
