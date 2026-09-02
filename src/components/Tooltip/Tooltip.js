import React from 'react';
import types from 'prop-types';
import 'rc-tooltip/assets/bootstrap.css';
import { default as RcTooltip } from 'rc-tooltip';
import { ReactComponent as InfoIcon } from '../../assets/Info.svg';

import './Tooltip.scss';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
Tooltip.propTypes = {
  children: types.any,
  content: types.any,
  placement: types.string
};

function Tooltip({ placement = 'top', ...restProps }) {
  const props = { placement, ...restProps };
  return (
    <RcTooltip placement={props.placement} overlay={props.content} mouseEnterDelay={0.1}>
      <i className="tooltip">
        <InfoIcon style={{ width: '11px', height: '11px', margin: '0 8px' }} />
      </i>
    </RcTooltip>
  );
}

export default Tooltip;
