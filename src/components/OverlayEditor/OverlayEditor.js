import React, { useEffect, useReducer, useRef, useState } from 'react';
import types from 'prop-types';
import { withFormsy } from 'formsy-react';
import FabricCanvas from './FabricCanvas';
import { FabricContextProvider } from './context/FabricContext';
import './OverlayEditor.scss';
import FabricTextBox from './objects/FabricTextBox';
import FabricImage from './objects/FabricImage';
import FabricLayersAlign from './objects/FabricLayersAlign';

import { default as FabricLayers } from './objects/FabricLayers';
import { extractFontsFromQuill, loadGoogleFonts } from './libs/utils';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
OverlayEditor.propTypes = {
  canvasWidth: types.number,
  canvasHeight: types.number,
  baseImage: types.string,
  cloudName: types.string,
  userAgent: types.string,
  openCldAssetSelector: types.any,
  value: types.object,
  hidden: types.bool,
  setValue: types.any,
  canvasJson: types.object
};

function updateStateReducer(state, val) {
  return Object.assign({}, state, val);
}

function OverlayEditor(props) {
  const [state, setState] = useReducer(updateStateReducer, {});
  let reinstate = useRef(true);
  function onUpdate(json) {
    setState({ overlaysJson: json });
  }

  function onUpload(cldData, json) {
    let up = {};
    if (!cldData.error) {
      up.overlay = cldData;
    }
    up.overlaysJson = json;
    up.dataUrl = null;
    setState(up);
  }
  useEffect(() => {
    let v = {};
    if (props.value && reinstate.current) {
      const { overlaysJson, overlay } = props.value;
      v.overlaysJson = overlaysJson;
      /*
      if (overlaysJson && overlaysJson.objects && overlaysJson.objects.length > 0) {
        let fonts = [];
        overlaysJson.objects.forEach((ob) => {
          if (ob.quill) {
            fonts = fonts.concat(extractFontsFromQuill(ob.quill));
          }
        });
        if (fonts.length > 0) {
          loadGoogleFonts(fonts, {
            active: () => {
              setFontsLoaded(true);
            }
          });
          console.log(fonts);
        }
      }
*/
      v.overlay = overlay;
      setState(v);
      reinstate.current = false;
    }
  }, [props.value]);

  useEffect(() => {
    if (props.setValue) {
      props.setValue(state);
    }
  }, [state, props.setValue]);

  const initData = {
    publicId: props.baseImage,
    width: props.canvasWidth,
    height: props.canvasHeight
  };

  // Render
  return (
    <React.Fragment>
      {!props.hidden && props.baseImage && (
        <div className="overlay-editor">
          <FabricContextProvider
            onUpload={onUpload}
            onUpdate={onUpdate}
            userAgent={props.userAgent}
          >
            <FabricCanvas
              jsonData={props.value && props.value.overlaysJson ? props.value.overlaysJson : null}
              initData={initData}
            />
            <FabricTextBox />
            <FabricImage />
            <FabricLayersAlign />
            <FabricLayers cldConf={props.cldConf} />
          </FabricContextProvider>
        </div>
      )}
    </React.Fragment>
  );
}

export default withFormsy(OverlayEditor);
