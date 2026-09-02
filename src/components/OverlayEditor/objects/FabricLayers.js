import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { FabricContext } from '../context/FabricContext';
import cx from 'classnames';
import types from 'prop-types';
import t from '../../../services/i18n';

import { AiOutlineCheck } from 'react-icons/ai';

FabricLayers.propTypes = {
  cldConf: types.object,
  dirty: types.bool
};

function FabricLayers(props) {
  const {
    layers,
    canvas,
    uploadToCloudinary,
    resetPoint,
    loadFromJSON,
    canvasEl,
    setLayers,
    maxLayers,
    dirty,
    exportJson
  } = useContext(FabricContext);
  const [uploadError, setUploadError] = useState(null);
  const [applied, setApplied] = useState(false);
  const timeoutRef = useRef(null);

  function handleUploadResult(isError, msg) {
    if (isError) {
      if (msg) {
        setUploadError(msg);
      } else {
        setUploadError(t('errors.presetDefault'));
      }
    } else {
      setApplied(t('labels.applied'));
    }
  }

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    if (applied) {
      timeoutRef.current = setTimeout(() => {
        setApplied(false);
      }, 2000);
    }
  }, [applied]);

  const toCld = useCallback(() => {
    let bgImage = canvas.backgroundImage;
    canvas.backgroundImage = null;
    let svg = canvas.toSVG();
    canvas.backgroundImage = bgImage;
    uploadToCloudinary(svg, props.cldConf, handleUploadResult);
  }, [canvas]);

  const handleApply = useCallback(() => {
    setUploadError(null);
    resetPoint.current = exportJson(canvas);
    toCld();
  }, [toCld, canvas]);

  const handleResetClick = () => {
    // If we have a reset point set
    if (resetPoint && resetPoint.current) {
      setLayers([]);
      canvas.dispose();
      loadFromJSON(canvasEl.current, resetPoint.current, resetPoint.current.backgroundImage.src);
    } else {
      // remove all layers
      let objs = canvas.getObjects();
      objs.forEach((o) => {
        canvas.remove(o);
      });
      canvas.setZoom(1);
      canvas.renderAll.bind(canvas);
      setLayers([]);
    }
  };

  return (
    <React.Fragment>
      {layers.length > 0 ? (
        <h5 className="section-header">
          {t('widgetTitles.layersOpts', { val: layers.length, maxLayers: maxLayers })}
        </h5>
      ) : null}
      <div className="layers">{layers}</div>
      <div className="actions">
        <button className="reset-btn btn btn-secondary btn-borderless" onClick={handleResetClick}>
          {t('reset')}
        </button>
        {uploadError !== null && <h5 className="error-message">{uploadError}</h5>}
        <button
          className={cx('to-cld btn btn-primary', { 'btn-icon': applied })}
          onClick={handleApply}
          disabled={!(dirty && dirty.current)}
        >
          {applied && <AiOutlineCheck />}
          {t(applied ? 'labels.applied' : 'labels.apply')}
        </button>
      </div>
    </React.Fragment>
  );
}

export default FabricLayers;
