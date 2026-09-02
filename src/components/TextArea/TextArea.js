import React, { useState, useEffect, useCallback } from 'react';
import types from 'prop-types';
import { withFormsy } from 'formsy-react';
import debounce from 'lodash.debounce';
import cx from 'classnames';
import t from '../../services/i18n';

import './TextArea.scss';
import { default as Tooltip } from '../Tooltip';
// import { Info } from '../../assets';
import { default as FieldWrapper } from '../FieldWrapper';

import { MdWarning } from 'react-icons/md';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
TextArea.propTypes = {
  label: types.string,
  disabled: types.bool,
  placeholder: types.string,
  fieldInfo: types.any,
  tooltipPlacement: types.string,
  delay: types.number,
  hidden: types.bool,
  value: types.string,
  setValue: types.any,
  errorText: types.string,
  isError: types.bool
};

export function TextArea({ disabled = false, delay = 1000, ...restProps }) {
  const props = { disabled, delay, ...restProps };
  // Local state
  const [text, setText] = useState(props.value);
  const setParent = useCallback(
    debounce((v) => {
      if (props.setValue) {
        props.setValue(v);
      }
    }, props.delay),
    []
  );

  function handleChange(val) {
    setText(val);
    setParent(val);
  }

  useEffect(() => {
    if (props.value && props.value !== text) {
      setText(props.value);
    }
  }, [props.value]);

  let inp;
  let input = (
    <div className={cx('text-area', { error: props.isError })}>
      <textarea
        placeholder={props.placeholder}
        value={text}
        disabled={props.disabled}
        onChange={(v) => handleChange(v.target.value)}
      />
      {props.isError && (
        <div className="error-wrapper">
          <MdWarning />
          <h5 className="error-message">{t(props.errorText)}</h5>
        </div>
      )}
    </div>
  );

  if (props.label) {
    inp = (
      <label>
        {props.label}
        {props.fieldInfo && (
          <Tooltip content={props.fieldInfo} placement={props.tooltipPlacement} />
        )}
        {input}
      </label>
    );
  } else {
    inp = input;
  }

  // Render
  return (
    <React.Fragment>
      {!props.hidden && <FieldWrapper type={'textarea'}>{inp}</FieldWrapper>}
    </React.Fragment>
  );
}

export default withFormsy(TextArea);
