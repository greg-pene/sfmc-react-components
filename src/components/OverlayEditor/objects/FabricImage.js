import React, { useCallback } from 'react';
import types from 'prop-types';
import { FabricImage as FabricImageClass } from 'fabric';
import t from '../../../services/i18n';
import { FabricContext } from '../context/FabricContext';
import { FormPanelContext } from '../../../containers';
import FabricLayerToolbar from '../FabricLayerToolbar';
import { addSelectTime, setOverlayObjStyle } from '../libs/utils';
import { default as RcTooltip } from 'rc-tooltip';

import { BsPlus } from 'react-icons/bs';

FabricImage.propTypes = {
  hidden: types.bool
};

function FabricImage() {
  FabricContext.displayName = 'fabricContext';
  FormPanelContext.displayName = 'formPanelContext';
  const { canvas, addLayer, layers, maxLayers } = React.useContext(FabricContext);
  const { assetPicker } = React.useContext(FormPanelContext);
  const isMaxLayers = layers.length >= maxLayers;
  const SOURCE = 'overlay';
  const addImage = useCallback(
    (data) => {
      if (!isMaxLayers && canvas) {
        if (data && data.secure_url && data.source === SOURCE) {
          FabricImageClass.fromURL(data.secure_url, { crossOrigin: 'anonymous' }).then((img) => {
            const id = Date.now().toString();
            img.scaleToWidth(100);
            img.set({
              opacity: 0.7,
              publicId: data.public_id,
              id: id,
              originX: 'left',
              originY: 'top'
            });
            setOverlayObjStyle(img);
            addSelectTime(img);
            canvas.add(img);
            addLayer(<FabricLayerToolbar obj={img} key={id} id={id} />);
            canvas.renderAll();
          });
        }
      }
    },
    [canvas, layers]
  );

  const TooltipWrapper = ({ showTooltip, children }) => {
    return showTooltip ? (
      <RcTooltip placement="bottom" overlay={t('fieldTooltip.layerLimit')} mouseEnterDelay={0.1}>
        {children}
      </RcTooltip>
    ) : (
      children
    );
  };

  const openMLWidget = () => {
    let opts = {
      folder: {
        path: null,
        resource_type: 'image'
      }
    };
    assetPicker(addImage, opts, SOURCE);
  };

  return (
    <TooltipWrapper showTooltip={isMaxLayers}>
      <span className="btn-wrapper">
        <button
          id="mlw-open"
          className="btn btn-secondary btn-icon add-image"
          onClick={openMLWidget}
          disabled={isMaxLayers}
        >
          <BsPlus />
          {t('addImage')}
        </button>
      </span>
    </TooltipWrapper>
  );
}

export default FabricImage;
