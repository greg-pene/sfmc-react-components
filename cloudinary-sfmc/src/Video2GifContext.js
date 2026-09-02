import React, {createContext, useEffect, useReducer, useState } from 'react';
import { default as sdk}  from 'blocksdk';
import types from 'prop-types';
import { default as cloneDeep} from 'lodash.clonedeep';
import { default as isEmpty} from 'lodash.isempty';
import {buildGifUrl, buildGifHtml, pollImageReady, getGifDuration, buildPlaceholder, createMockSdk } from './utils';
import  { ReactComponent as IcExlmataion } from './assets/exclamation-mark-inside-a-circle.svg';
import  { ReactComponent as IcClock } from './assets/clock-130.svg';
import  { ReactComponent as IcError } from './assets/error.svg';

export const Video2GifContext = createContext([]);

const placeholderScale = {width: '50%', height: '100%'};

function buildTooLongVideoPlaceholder() {
  return buildPlaceholder(['This video is too long to process.','Try trimming it to less than 15 seconds.'], '#ce190d', <IcExlmataion />, placeholderScale);
}

function buildProcessingPlaceholder() {
  return buildPlaceholder(['The video is being processed.', 'This may take a few minutes.'], '#706e6b', <IcClock />, placeholderScale);
}

function buildError() {
  return buildPlaceholder(['Unable to show preview.', 'Check your configuration and ensure valid transformations are specified.'], '#CE190D', <IcError />, placeholderScale);
}

Video2GifContextProvider.propTypes = {
  qParams: types.string,
  imageSettingsDefaults: types.object,
  cld: types.object,
  children: types.any,
  errorImageUrl: types.string
};

Video2GifContextProvider.defaultProps = {
  errorImageUrl:'https://product-assets-res.cloudinary.com/image/upload/w_250,co_rgb:c23834,e_colorize:100,f_png/PageDesigner/warning.png'
};

function updateStateReducer(state, val) {
  return Object.assign({}, state, val);
}
const isLocalDev = window.location.hostname === 'localhost';

const settingsUrl = `https://${window.location.host}/gif-advanced${window.location.search}`;
const blocksdk = isLocalDev
  ? createMockSdk('cld-gif-sdk-data')
  : new sdk({
    blockEditorWidth: 800,
    tabs: [{name: 'Advanced', key: 'cld-advanced-gif', url: settingsUrl }, 'stylingblock', 'htmlblock'],
  });

export default function Video2GifContextProvider(props) {
  const {cld} = props;
  const defaultState = {
    alignments: 'center',
    scale: {width: 766, height: 300},
    qualitySlider: 50,
    qualityType: 'default',
    loop: true,
    lossy: true
  };
  // const settingsUrl = `https://${window.location.host}/gif-advanced?${qParams}`;
  const [gifProcessing, setGifProcesing] = useState(false);
  const [gifUrl, setGifUrl] = useState(null);
  const [errorUrl, setErrorUrl] = useState(null);
  const [processingElement, setProcessingElement] = useState(null);
  const [state, updateState] = useReducer(updateStateReducer, defaultState);

  useEffect(() => {
    if (state !== defaultState) {
      blocksdk.setData(cloneDeep(state));
    }
  }, [state, defaultState]);

  useEffect(() => {
    blocksdk.getData((data) => {
      updateState(data);
    });
  }, []);

  const {asset, videoTrimmer, scale, loop, lossy, custom, qualitySlider, qualityType} = state;
  useEffect(() => {
    async function setGif() {
      if (!isEmpty(asset)) {
        const placeholder = buildProcessingPlaceholder();
        if (placeholder !== processingElement && errorUrl === null) {
          setProcessingElement(placeholder);
        }
        const gUrl = buildGifUrl(asset, videoTrimmer, cld, scale, loop, lossy, custom, qualitySlider, qualityType);
        if (gUrl && gUrl !== gifUrl && gUrl !== errorUrl) {
          setGifProcesing(true);
          try {
            await pollImageReady(gUrl,20, 4);
            setGifProcesing(false);
            setGifUrl(gUrl);
            setErrorUrl(null);
            setProcessingElement(null);
          } catch (e) {
            setGifProcesing(false);
            setErrorUrl(gUrl);
            setGifUrl(null);
            console.log(e);
            setProcessingElement(buildError(scale, props.errorImageUrl));
          }
        }
      } else {
        setProcessingElement(null);
        setGifProcesing(false);
      }
    }
    const duration = getGifDuration(asset, videoTrimmer);
    if (duration <= 15 && duration > 0) {
      if (!gifProcessing) {
        setGif();
      }
    } else if (duration === 0) {
      setGifUrl(null);
      setProcessingElement(null);
    } else {
      setProcessingElement(buildTooLongVideoPlaceholder());
    }
  }, [asset, videoTrimmer, gifUrl, processingElement, cld, scale, gifProcessing, loop, lossy, custom, qualitySlider, qualityType, props.errorImageUrl, errorUrl]);

  const {alt, alignments, videoLink} = state;
  useEffect(() => {
    if (processingElement && !gifUrl) {
      blocksdk.setSuperContent(processingElement);
    } else if (gifUrl && !gifProcessing) {
      const content = buildGifHtml(gifUrl, alt, alignments, videoLink );
      blocksdk.setSuperContent(content);
      blocksdk.setContent(content);
    } else if (gifUrl === null && !processingElement) {
      blocksdk.setSuperContent('<div></div>');
    }
  }, [gifUrl, processingElement, gifProcessing, alt, alignments, videoLink]);

  return (
    <Video2GifContext.Provider value={{state, updateState, errorUrl}}>
      {props.children}
    </Video2GifContext.Provider>
  );
}
