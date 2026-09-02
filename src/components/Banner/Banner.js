import React from 'react';
import types from 'prop-types';
import cx from 'classnames';

import { MdError, MdWarning, MdCheck, MdInfo } from 'react-icons/md';

import './Banner.scss';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
Banner.propTypes = {
  type: types.string, // error|warning|success|primary|secondary|subtle
  click: types.func,
  content: types.string,
  icon: types.elementType
};

function Banner(props) {
  const icons = {
    error: <MdError />,
    warning: <MdWarning />,
    success: <MdCheck />,
    info: <MdInfo />
  };

  return (
    <React.Fragment>
      <div className={cx('banner', props.type)} onClick={props.click}>
        {props.icon ? props.icon : icons[props.type] || icons.info}
        {props.content}
      </div>
    </React.Fragment>
  );
}

export default Banner;
