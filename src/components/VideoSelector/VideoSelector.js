import React, { useState, useEffect } from 'react';
import types from 'prop-types';
import cx from 'classnames';
// import { OpenFolder, Remove} from '../../assets';
import t from '../../services/i18n';
import { RadioButtons } from '../RadioButtons/RadioButtons';
import { default as Checkbox } from '../Checkbox';
import { withFormsy } from 'formsy-react';

import './VideoSelector.scss';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
VideoSelector.propTypes = {
  title: types.string,
  posterItems: types.array,
  openCldAssetSelector: types.func,
  setValue: types.func
};

// Default props
VideoSelector.defaultProps = {
  title: 'The Title',
  posterItems: [
    { value: 'auto', label: 'Auto' },
    { value: 'first', label: 'First frame' }
  ]
};

function VideoSelector(props) {
  // Local state
  const [previewUrl, setPreviewUrl] = useState(null);
  const [asset, setAsset] = useState({});
  const [poster, setPoster] = useState('auto');
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState('false');
  const [autoPlay, setAutoPlay] = useState(false);
  const [controls, setControls] = useState(true);
  const openCldAssetSelector = props.openCldAssetSelector;

  useEffect(() => {
    props.setValue({
      asset: asset,
      poster: poster,
      loop: loop,
      muted: muted,
      autoPlay: autoPlay,
      controls: controls
    });
  }, [asset, poster, loop, muted, autoPlay, controls]);

  function handlePreviewError(event) {
    let target = event.currentTarget;
    target.src =
      'https://product-assets-res.cloudinary.com/image/upload/w_80,co_rgb:c23834,e_colorize:100,f_png/l_text:Arial_60_bold_text_align_center_line_spacing_8:INVALID%0ATRANSFORMATION,co_rgb:06060b,y_90,w_280/b_rgb:F3F2F2,c_lpad,w_300,h_260/PageDesigner/warning.png';
  }

  function onRemove() {
    setAsset(null);
  }
  // Render
  return (
    <div style={{ padding: '100px 50px', height: '100vh' }}>
      <div className="image-selector">
        <div className={cx('image-select', previewUrl ? 'has-image' : 'no-image')}>
          {previewUrl && (
            <div className="image-preview">
              <img className="preview-img" src={previewUrl} onError={handlePreviewError} />
            </div>
          )}
          <div className="image-data">
            {asset && asset.public_id ? (
              <div
                className="image-name"
                title={asset.public_id + (asset.format ? '.' + asset.format : '')}
              >
                {asset.public_id + (asset.format ? '.' + asset.format : '')}
              </div>
            ) : (
              <button className="image-name-input" onClick={openCldAssetSelector}></button>
            )}
            <button className="btn btn-secondary btn-icon add" onClick={openCldAssetSelector}>
              {/* <OpenFolder /> */}
              {/* t('labels.' + (asset && asset.public_id && field.buttonLabelSecondary ? field.buttonLabelSecondary : field.buttonLabel)) */}
            </button>
            {previewUrl && (
              <button className="btn btn-secondary btn-icon remove" onClick={onRemove}>
                {/* <Remove /> */}
                {t('labels.remove')}
              </button>
            )}
          </div>
        </div>
        ;
        <RadioButtons
          items={props.posterItems}
          value={poster}
          setValue={setPoster}
          label={'Poster'}
          className={'radio-group'}
        />
        <Checkbox label={'Loop'} setValue={setLoop} value={loop} />
        <Checkbox label={'Start Muted'} setValue={setMuted} value={muted} />
        <Checkbox label={'Auto Play'} setValue={setAutoPlay} value={autoPlay} />
        <Checkbox label={'Show Controls'} setValue={setControls} value={controls} />
      </div>
    </div>
  );
}

export default withFormsy(VideoSelector);
