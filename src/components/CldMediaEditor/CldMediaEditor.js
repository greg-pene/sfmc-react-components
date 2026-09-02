/* global cloudinary */
import React, { useEffect, useCallback, useRef, useState } from 'react';
import types from 'prop-types';
import { default as FieldWrapper } from '../FieldWrapper';
import { IoMdUndo } from 'react-icons/io';
import t from '../../services/i18n';
import { withFormsy } from 'formsy-react';
import { applyDefaults } from '../../utils';

// import t from '../../services/i18n';

import './CldMediaEditor.scss';

import { MdCropRotate } from 'react-icons/md';
import { ReactComponent as IcDisabled } from '../../assets/disabled--sync.svg';

function parseStartEndTransformation(trans) {
  const startRegExp = /(so_(?<start>[0-9]+))/;
  const endRegExp = /(eo_(?<end>[0-9]+))/;
  let sMatch = trans.match(startRegExp);
  let start = 0;
  let end = 0;
  if (sMatch && sMatch.groups && sMatch.groups.start) {
    start = Number(sMatch.groups.start);
  }
  let eMatch = trans.match(endRegExp);
  if (eMatch && eMatch.groups && eMatch.groups.end) {
    end = Number(eMatch.groups.end);
  }
  return { start: start, end: end };
}

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
CldMediaEditor.propTypes = {
  label: types.string,
  cloudName: types.string,
  asset: types.object,
  value: types.object,
  setValue: types.any,
  disabled: types.bool,
  version: types.string,
  description: types.string,
  buttonLabel: types.string,
  texts: types.object,
  showReset: types.bool,
  mewUrl: types.string,
  maxWidth: types.number,
  maxHeight: types.number,
  env: types.string
};

const CLD_MEDIA_EDITOR_DEFAULTS = {
  disabled: false,
  buttonLabel: 'Edit Image',
  showReset: false,
  mewUrl: 'https://media-editor.cloudinary.com/all.js',
  maxHeight: 0,
  maxWidth: 0,
  version: '0.0.4',
  env: 'dev',
  texts: {
    'footer.export': 'Apply',
    'crop.sidebar.header': 'Crop'
  }
};

export default function CldMediaEditor(rawProps) {
  const props = applyDefaults(CLD_MEDIA_EDITOR_DEFAULTS, rawProps);
  const { asset, cloudName, texts, version, env, maxWidth, maxHeight, value } = props;
  const mew = useRef(null);
  const [output, setOutput] = useState(value);
  function handleExport(val) {
    cleanMew();
    if (props.setValue) {
      props.setValue(val);
    }
    setOutput(val);
  }

  function cleanMew() {
    document.body.style.overflow = '';
    mew.current.destroy();
    mew.current = null;
  }

  // Lifecycle updates
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.id = 'mewScript';
    document.body.appendChild(script);
    script.src = props.mewUrl;
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleResetClick() {
    if (props.setValue) {
      props.setValue(null);
      setOutput(null);
    }
  }
  useEffect(() => {
    if (props.value && props.value !== output) {
      setOutput(props.value);
    }
  }, [props.value]);

  const openMew = useCallback(() => {
    if (asset && cloudName) {
      const mewAsset = {
        publicId: asset.public_id,
        resourceType: asset.resource_type
      };
      // cloudinary is loaded as a global from the external MEW script
      if (mew.current === null) {
        mew.current = cloudinary.mediaEditor();
        mew.current.on('export', handleExport);
        mew.current.on('close', cleanMew);
        let conf = {
          cloudName: cloudName,
          image: {
            steps: ['resizeAndCrop'],
            resizeAndCrop: {
              interactiveCrop: true,
              toggleAspectRatio: true,
              aspectRatioLock: false
            }
          },
          language: {
            messages: {
              en_US: texts
            }
          },
          source: {
            type: 'sfmc_cartridge',
            platform: 'salesforce_marketing_cloud',
            version: version,
            environment: env
          },
          publicIds: [mewAsset]
        };
        if (maxWidth > 0 && maxHeight > 0) {
          conf.image.maxWidth = maxWidth;
          conf.image.maxHeight = maxHeight;
        }
        if (asset.resource_type === 'video') {
          if (value) {
            const startEnd = parseStartEndTransformation(value.transformation);
            conf.video = {
              trim: {
                startOffset: startEnd.start,
                endOffset: startEnd.end,
                maxDuration: 15
              }
            };
          } else {
            conf.video = {
              trim: {
                startOffset: 0,
                endOffset: 15,
                maxDuration: 15
              }
            };
          }
        }
        mew.current.update(conf);
        mew.current.show();
      } else {
        mew.current.show();
      }
    }
  }, [asset, cloudName, maxWidth, maxHeight, value, version, env, texts, mew.current]);

  // Render
  return (
    <FieldWrapper type={'cld-media-editor'}>
      <label>{props.label}</label>
      <button
        className={'open-media-editor btn btn-secondary btn-icon'}
        onClick={openMew}
        disabled={props.disabled}
      >
        {props.icon && props.icon == 'trim' ? <IcDisabled /> : <MdCropRotate />}
        {props.buttonLabel}
      </button>
      {props.showReset && (
        <button className="btn btn-secondary btn-borderless btn-icon" onClick={handleResetClick}>
          {t('reset')}
          <IoMdUndo />
        </button>
      )}
      {props.description && <span className="description">{props.description}</span>}
    </FieldWrapper>
  );
}

export const formsyCldMediaEditor = withFormsy(CldMediaEditor);
