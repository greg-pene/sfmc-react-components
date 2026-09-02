import React, { useContext } from 'react';
import { FormPanel } from 'sf-component-lib2';
import 'sf-component-lib2/dist/index.css';
import { default as isEmpty } from 'lodash.isempty';
import types from 'prop-types';
import { Video2GifContext } from './Video2GifContext';
import { calcAspects } from './utils';
import  { ReactComponent as IcCenter } from './assets/align-horizontal-center.svg';
import  { ReactComponent as IcLeft } from './assets/align-horizontal-left.svg';
import  { ReactComponent as IcRight } from './assets/align-horizontal-right.svg';


import './Video2Gif.scss';

Video2Gif.propTypes = {
  cnf: types.object
};


export default function Video2Gif({ cnf }) {
  let { state, updateState} = useContext(Video2GifContext);
  const SOURCE = 'video2gif';
  function setAsset(asset) {
    if (asset === 'remove') {
      updateState({ asset: null });
    }
    let aspects = calcAspects(asset.width, asset.height);
    let calcWidth = Math.round(state.scale.width * aspects.wAsspect);
    let width = calcWidth > state.scale.width ? state.scale.width : calcWidth;
    let scaleVal = {width: width, height: Math.round(width * aspects.hAsspect)};
    updateState({asset: asset, scale: scaleVal});
  }

  function update(val) {
    const {asset} = val;
    if (asset === 'remove') {
      val.asset = {};
      val.videoTrimmer = null;
    }
    updateState(val);
  }
  function selectVideo() {
    if (cnf.assetSelector) {
      let opts = {
        sizeLimit: cnf.videoSizeLimit,
        validators: ['isNotRestricted', 'isNotOverSizeLimit', 'isRightType', 'hasDimensions'],
        infos: [`Select the video you want to insert, up to a limit of ${cnf.videoSizeLimit} MB.`]
      };
      const asset = state.asset;
      if (!isEmpty(asset) && asset !== 'remove') {
        opts.asset = {
          public_id: asset.public_id,
          resource_type: 'video',
          type: asset.type
        };
        if (asset.derived && asset.derived.length > 0) {
          opts.transformation = { url: asset.derived[0].secure_url };
        }
      } else {
        opts.folder = {
          path: null,
          resource_type: 'video'
        };
      }
      cnf.assetSelector(setAsset, opts, SOURCE);
    }
  }
  let width = 0;
  let height = 0;
  if (state.asset) {
    width = state.asset.width;
    height = state.asset.height;
  }

  const disabled = isEmpty(state.asset);
  const disabledClass = disabled ? 'disabled' : '';


  return (
    <FormPanel cldConf={cnf.cldConf} updateParentState={update} openCldAssetSelector={cnf.assetSelector} cld={cnf.cld} formConfig={[{
      title: 'Video',
      fieldSetInfo: 'Select a video from your Cloudinary cloud',
      fields: [
        {
          type: 'raw',
          content: <span className="subtitle">{'Your video will be converted to an animated GIF for maximum compatibility with email clients.'}</span>
        },
        {
          type: 'assetSelector',
          name: 'asset',
          cloudName: cnf.cldConf.cloud_name,
          value: state.asset,
          buttonLabel: 'Choose Video',
          description: `Select a video no larger than ${cnf.videoSizeLimit}MB`,
          openCldAssetSelector: selectVideo,
          analytics: cnf.ver
        }]},
    {
      title: '',
      additionalClasses: [disabledClass],
      fields: [
        {
          type: 'mediaEditor',
          name: 'videoTrimmer',
          label: 'Trim Video Length',
          icon: 'trim',
          buttonLabel: 'Trim Video',
          showReset: true,
          cloudName: cnf.cldConf.cloud_name,
          asset: state.asset,
          value: state.videoTrimmer,
          description: 'Maximum supported length is 15 seconds',
          mewUrl: process.env.REACT_APP_MEW_URL,
          texts: {
            'footer.export': 'Apply',
            'crop.sidebar.header': 'Crop',
            'header': 'Trim Video'
          },
          disabled: disabled
        },
        {
          type: 'imageScale',
          name: 'scale',
          disabled: disabled,
          value: state.scale,
          width: width,
          label: 'Scale',
          height: height
        },
        {
          type: 'radioButtons',
          className: 'styled-buttons',
          label: 'Alignment',
          name: 'alignments',
          options: [
            { value: 'left', label: 'Left', icon: <IcLeft /> },
            { value: 'center', label: 'Center', icon: <IcCenter /> },
            { value: 'right', label: 'Right', icon: <IcRight /> }
          ],
          disabled: disabled,
          selected: state.alignments
        },
        {
          type: 'textInput',
          name: 'videoLink',
          label: 'Link',
          disabled: disabled,
          value: state.videoLink
        },
        {
          type: 'textInput',
          name: 'alt',
          label: 'Alt Text',
          disabled: disabled,
          value: state.alt
        }
      ]
    }]} />
  );
}
