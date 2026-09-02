import React, { useContext, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { FabricContext } from './context/FabricContext';
import types from 'prop-types';

FabricCanvas.propTypes = {
  jsonData: types.object,
  initData: types.object
};

function FabricCanvas({ jsonData = null, initData }) {
  const jData = useRef(initData);
  const { canvas, initCanvas, setActiveObject, loadFromJSON, canvasEl } = useContext(FabricContext);

  useLayoutEffect(() => {
    if (jsonData) {
      loadFromJSON(canvasEl.current, jsonData, initData.publicId);
    } else {
      initCanvas(canvasEl.current, {
        width: jData.current.width,
        height: jData.current.height,
        baseImage: jData.current.publicId
      });
    }
  }, [canvasEl, initCanvas]);

  const updateActiveObject = useCallback(
    (e) => {
      if (!e) {
        return;
      }
      setActiveObject(canvas.getActiveObject());
      canvas.renderAll();
    },
    [canvas, setActiveObject]
  );

  useEffect(() => {
    if (!canvas) {
      return;
    }
    canvas.on('selection:created', updateActiveObject);
    canvas.on('selection:updated', updateActiveObject);
    canvas.on('selection:cleared', updateActiveObject);

    return () => {
      canvas.off('selection:created');
      canvas.off('selection:cleared');
      canvas.off('selection:updated');
    };
  }, [canvas, updateActiveObject]);

  return (
    <div className="fabric-wrapper">
      <canvas
        ref={canvasEl}
        id="fabric-canvas"
        width={jData.current.width}
        height={jData.current.height}
      />
    </div>
  );
}

export default FabricCanvas;
