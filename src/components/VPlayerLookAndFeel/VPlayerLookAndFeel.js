import React, { useState, useEffect } from 'react';
import types from 'prop-types';
import { withFormsy } from 'formsy-react';
import { RadioButtons } from '../RadioButtons/RadioButtons';
import { default as ColorPicker } from '../ColorPicker';
import { Input } from '../Input/Input';

import './VPlayerLookAndFeel.scss';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
VPlayerLookAndFeel.propTypes = {
  theme: types.string,
  baseColor: types.string,
  textColor: types.string,
  accentColor: types.string,
  logoUrl: types.string,
  imageLinkUrl: types.string,
  setValue: types.func
};

// Default props
VPlayerLookAndFeel.defaultProps = {
  theme: 'dark'
};

function VPlayerLookAndFeel(props) {
  // Local state
  const [theme, setTheme] = useState(props.theme);
  const [baseColor, setBaseColor] = useState(props.baseColor);
  const [textColor, setTextColor] = useState(props.textColor);
  const [accentColor, setAccentColor] = useState(props.accentColor);
  const [logoUrl, setLogoUrl] = useState(props.logoUrl);
  const [imageLinkUrl, setImageLinkUrl] = useState(props.imageLinkUrl);

  // Lifecycle updates
  useEffect(() => {
    if (props.setValue) {
      props.setValue({
        theme: theme,
        colors: {
          baseColor: baseColor,
          accentColor: accentColor,
          textColor: textColor
        },
        logo: {
          imageUrl: logoUrl,
          imageLinkUrl: imageLinkUrl
        }
      });
    }
  }, [theme, accentColor, textColor, baseColor, logoUrl, imageLinkUrl]);

  // Render
  return (
    <div className="v-player-look-and-feel">
      <RadioButtons
        items={[
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' }
        ]}
        value={theme}
        setValue={setTheme}
        label={'Theme'}
        className={'radio-group'}
      />
      <ColorPicker name={'Base'} setValue={setBaseColor} color={baseColor} />
      <ColorPicker name={'Text'} setValue={setTextColor} color={textColor} />
      <ColorPicker name={'Accent'} setValue={setAccentColor} color={accentColor} />
      <Input placeholder={'logo url'} setValue={setLogoUrl} value={logoUrl} label={'Logo url'} />
      <Input
        placeholder={'logo link'}
        setValue={setImageLinkUrl}
        value={imageLinkUrl}
        label={'Logo link'}
      />
    </div>
  );
}

export default withFormsy(VPlayerLookAndFeel);
