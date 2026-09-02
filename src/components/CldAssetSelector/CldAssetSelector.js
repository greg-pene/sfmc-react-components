import React, { useState, useEffect } from 'react';
import types from 'prop-types';
import t from '../../services/i18n';
import { withFormsy } from 'formsy-react';
import './CldAssetSelector.scss';
import cx from 'classnames';

import { IoIosFolder, IoIosTrash } from 'react-icons/io';

import { FormPanelContext } from '../../containers/FormPanel/FormPanelContext';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
CldAssetSelector.propTypes = {
  buttonLabel: types.string,
  value: types.object,
  setValue: types.any,
  description: types.string,
  openCldAssetSelector: types.any
};

export default function CldAssetSelector({
  buttonLabel = 'Choose Image',
  value = null,
  ...restProps
}) {
  const props = { buttonLabel, value, ...restProps };
  const { cld } = React.useContext(FormPanelContext);
  // let asset = props.value;
  // Local state
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mlTransformations, setMlTransformations] = useState(null);

  // Lifecycle updates
  useEffect(() => {
    if (props.value && props.value.secure_url) {
      let trns = {
        height: 300,
        crop: 'thumb',
        fetchFormat: 'auto',
        resource_type: props.value.resource_type
      };
      if (props.value.derived && props.value.derived.length > 0) {
        setMlTransformations(props.value.derived[0].raw_transformation);
        Object.assign(trns, { raw_transformation: props.value.derived[0].raw_transformation });
      }
      setPreviewUrl(cld.url(props.value.public_id, trns));
      if (props.setValue) {
        props.setValue(props.value);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [props.value]);

  function onRemove() {
    if (props.value) {
      props.setValue('remove');
      setMlTransformations(null);
    }
  }

  function handlePreviewError(event) {
    let target = event.currentTarget;
    target.src =
      'https://product-assets-res.cloudinary.com/image/upload/w_80,co_rgb:c23834,e_colorize:100,f_png/l_text:Arial_60_bold_text_align_center_line_spacing_8:INVALID%0ATRANSFORMATION,co_rgb:06060b,y_90,w_280/b_rgb:F3F2F2,c_lpad,w_300,h_260/PageDesigner/warning.png';
  }

  // Render
  return (
    <div className={cx('image-select', previewUrl ? 'has-image' : 'no-image')}>
      {previewUrl && (
        <div className="image-preview">
          <img className="preview-img" src={previewUrl} onError={handlePreviewError} />
        </div>
      )}
      {props.value && props.value.public_id ? (
        <div className="image-data">
          <div
            className="image-name"
            title={props.value.public_id + (props.value.format ? '.' + props.value.format : '')}
          >
            {props.value.public_id + (props.value.format ? '.' + props.value.format : '')}
          </div>
          <button
            className="btn btn-secondary btn-icon add"
            onClick={props.openCldAssetSelector}
            title={t('replace')}
          >
            <IoIosFolder />
            {t('replace')}
          </button>
          {previewUrl && (
            <button
              className="btn btn-secondary btn-icon remove"
              onClick={onRemove}
              title={t('remove')}
            >
              <IoIosTrash />
              {t('remove')}
            </button>
          )}
        </div>
      ) : (
        <div className="image-data">
          <button
            className="image-name-input btn btn-secondary btn-icon"
            onClick={props.openCldAssetSelector}
          >
            <IoIosFolder />
            {props.buttonLabel}
          </button>
          {props.description && <div className="description">{props.description}</div>}
        </div>
      )}
      {mlTransformations && (
        <label>
          Image Transformations<div className="ml-transformations">{mlTransformations}</div>
        </label>
      )}
    </div>
  );
}

export const formsyCldAssetSelector = withFormsy(CldAssetSelector);
