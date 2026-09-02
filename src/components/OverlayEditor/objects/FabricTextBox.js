import React, { useCallback } from 'react';
import { IText } from 'fabric';
import t from '../../../services/i18n';
import types from 'prop-types';
import { FabricContext } from '../context/FabricContext';
import FabricLayerToolbar from '../FabricLayerToolbar';
import { addSelectTime, setOverlayObjStyle } from '../libs/utils';
import { default as RcTooltip } from 'rc-tooltip';

import { BsPlus } from 'react-icons/bs';

FabricTextBox.propTypes = {
  hidden: types.bool
};

function FabricTextBox() {
  const { canvas, addLayer, layers, maxLayers } = React.useContext(FabricContext);
  const isMaxLayers = layers.length >= maxLayers;
  const defaults = {
    width: 200,
    top: 10,
    left: 10,
    originX: 'left',
    originY: 'top',
    fontSize: 36,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    fontFamily: 'arial',
    textDecoration: 'none',
    fill: '#000000',
    editable: false,
    lockUniScaling: true
  };

  const addTextBox = useCallback(() => {
    if (!isMaxLayers && canvas) {
      const textBox = new IText(
        'Add your text here',
        Object.assign(defaults, { id: Date.now().toString() })
      );
      setOverlayObjStyle(textBox);
      addSelectTime(textBox);
      canvas.add(textBox);
      addLayer(<FabricLayerToolbar key={textBox.id} id={textBox.id} obj={textBox} />);
    }
  }, [canvas, layers]);

  const TooltipWrapper = ({ showTooltip, children }) => {
    return showTooltip ? (
      <RcTooltip placement="bottom" overlay={t('fieldTooltip.layerLimit')} mouseEnterDelay={0.1}>
        {children}
      </RcTooltip>
    ) : (
      children
    );
  };

  return (
    <TooltipWrapper showTooltip={isMaxLayers}>
      <span className="btn-wrapper">
        <button
          className="btn btn-secondary btn-icon add-text"
          onClick={addTextBox}
          disabled={isMaxLayers}
        >
          <BsPlus />
          {t('addTextBox')}
        </button>
      </span>
    </TooltipWrapper>
  );
}

export default FabricTextBox;
