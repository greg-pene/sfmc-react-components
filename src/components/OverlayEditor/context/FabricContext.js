import React, { useCallback, createContext, useState, useEffect, useRef } from 'react';
import { Canvas, FabricImage, Point } from 'fabric';
import types from 'prop-types';
import { addSelectTime, reapplyDelta, setCanvasSize, setOverlayObjStyle } from '../libs/utils';
import { default as debounce } from 'lodash.debounce';
import FabricLayerToolbar from '../FabricLayerToolbar';
import t from '../../../services/i18n';

export const FabricContext = createContext([]);

FabricContextProvider.propTypes = {
  onUpload: types.func,
  onUpdate: types.func,
  maxLayers: types.number,
  userAgent: types.string
};

export function FabricContextProvider({ maxLayers = 12, ...restProps }) {
  const props = { maxLayers, ...restProps };
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [layers, setLayers] = useState([]);
  const resetPoint = useRef(null);
  const dirty = useRef(false);
  const canvasEl = useRef(null);

  const removeLayer = useCallback(
    (id) => {
      setLayers((lys) => lys.filter((l) => l.props.id !== id));
      if (props.onUpdate) {
        const canvasExport = canvasToJson();
        if (canvasExport) {
          props.onUpdate(exportJson(canvas));
        }
        dirty.current = true;
      }
    },
    [setLayers]
  );

  const canvasToJson = useCallback(() => {
    if (canvas) {
      return exportJson(canvas);
    }
    return null;
  }, [canvas]);

  const handleUploadError = useCallback((httpCode) => {
    let errorMsg = t('errors.presetDefault');
    switch (httpCode) {
      case 400:
        errorMsg = t('errors.presetError');
        break;
      case 401:
        errorMsg = t('errors.invalidCloudName');
        break;
    }
    return errorMsg;
  }, []);

  const uploadToCloudinary = useCallback(
    async (svg, cldConf, setStatus) => {
      const { cloud_name, upload_prefix } = cldConf;
      const cldUploadUrl = `https://${upload_prefix}/v1_1/${cloud_name}/image/upload`;
      let uploadFD = new FormData();
      let bl = new Blob([svg], { type: 'image/svg+xml' });
      uploadFD.append('upload_preset', 'sfmc_preset');
      uploadFD.append('tags', 'sfmc_int');
      uploadFD.append('file', bl);
      /*
      let headers = new Headers({
        // 'X-Cld-User-Agent': props.userAgent,
        'Content-Type': 'image/svg+xml'
      });
*/
      fetch(cldUploadUrl, {
        method: 'POST',
        body: uploadFD
      })
        .then((res) => {
          if (res.status === 200) {
            console.log('uploaded');
          } else {
            setStatus(true, handleUploadError(res.status, ''));
          }
          res.json().then((data) => {
            if (data && !data.error) {
              if (props.onUpload && canvas) {
                props.onUpload(data, exportJson(canvas));
                dirty.current = false;
              }
              setStatus(false, '');
            }
          });
        })
        .catch(() => {
          // set generic error
          setStatus(true);
        });
    },
    [props.onUpload, canvas]
  );

  const addLayer = useCallback(
    (layer) => {
      setLayers((lys) => {
        return [layer, ...lys];
      });
    },
    [layers]
  );

  useEffect(() => {
    if (props.onUpdate && canvas) {
      props.onUpdate(exportJson(canvas));
    }
  }, [layers]);

  function exportJson(c) {
    if (c) {
      dirty.current = true;
      return c.toJSON(['id', 'type', 'quill']);
    }
    return {};
  }

  const addUpdateEvents = useCallback(
    (c) => {
      c.on('object:moved', () => {
        if (props.onUpdate && c.getObjects().length > 0) {
          props.onUpdate(exportJson(c));
        }
      });
      c.on('object:scaled', () => {
        if (props.onUpdate && c.getObjects().length > 0) {
          props.onUpdate(exportJson(c));
        }
      });
      c.on('object:skewing', () => {
        if (props.onUpdate && c.getObjects().length > 0) {
          props.onUpdate(exportJson(c));
        }
      });
      c.on(
        'object:rotating',
        debounce(() => {
          if (props.onUpdate && c.getObjects().length > 0) {
            props.onUpdate(exportJson(c));
          }
        }),
        1000
      );
      /*
      c.on('mouse:out', () => {
        if (props.onUpdate && c.getObjects().length > 0) {
          props.onUpdate(exportJson(c));
        }
      });
*/
    },
    [props]
  );

  const initCanvas = useCallback((el, opts) => {
    const canvasOptions = {
      preserveObjectStacking: true,
      selection: true,
      defaultCursor: 'default',
      width: opts.width,
      height: opts.height
    };
    let c = new Canvas(el, canvasOptions);

    FabricImage.fromURL(opts.baseImage, { crossOrigin: 'anonymous' }).then((img) => {
      setCanvasSize(img, c).then(() => {
        setCanvas(c);
      });
    });

    addUpdateEvents(c);
    // initAligningGuidelines(c);
    c.on('selection:created', function (o) {
      let sel = o.selected[0];
      if (sel.get('type') === 'activeSelection') {
        sel.set({ borderScaleFactor: 4 });
      }
    });
  }, []);

  const loadFromJSON = (el, json, baseImage) => {
    let c = new Canvas(el);
    try {
      c.loadFromJSON(json, function (o, object) {
        object.set('dirty', true);
        setOverlayObjStyle(object);
        addSelectTime(object);
        addLayer(<FabricLayerToolbar key={object.id} id={object.id} obj={object} />);
        reapplyDelta(object);
      }).then(() => {
        c.backgroundImage = null;
        FabricImage.fromURL(baseImage, { crossOrigin: 'anonymous' }).then((img) => {
          setCanvasSize(img, c).then(() => {
            setCanvas(c);
            c.requestRenderAll();
          });
        });
      });
    } catch (e) {
      return;
      // seems to fix an FF bug even with out
    }
    addUpdateEvents(c);
  };

  return (
    <FabricContext.Provider
      value={{
        canvas,
        initCanvas,
        loadFromJSON,
        activeObject,
        setActiveObject,
        layers,
        addLayer,
        removeLayer,
        setLayers,
        uploadToCloudinary,
        resetPoint,
        canvasEl,
        dirty,
        maxLayers,
        exportJson
      }}
    >
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </FabricContext.Provider>
  );
}
