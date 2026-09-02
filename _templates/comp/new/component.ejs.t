---
to: src/components/<%=name%>/<%=name%>.js
---
import React, {
  useState,
  useEffect
} from 'react';
import types from 'prop-types';
import { withFormsy } from 'formsy-react';

import './<%=name%>.scss';

// PropTypes
// https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
<%=name %>.propTypes = {
  title: types.string,
  value: types.string,
  setValue: types.function
};

// Default props
<%=name %>.defaultProps = {
  title: 'The Title'
};

function <%=name %>(props) {

  // Local state
  const [count, setCount] = useState(props.value);

  function handleChange(val) {
    setCount(val);
    if (props.setValue) {
      props.setValue(val);
    }
  }

  // Lifecycle updates
  useEffect(
    () => {
      // Similar to componentDidMount and componentDidUpdate:
      console.log('Update!!', store.status);

      return function cleanup() {
        // Similar to componentWillUnmount:
        // Note: effects clean-up every time before executing the next effect
        console.log('CleanUp!!', store.status);
      };
    },
    [] // Will only run on-mount/on-unmount
    // [store.status] // Will only run on store change
  );

  // Render
  return (
    <div className="<%=h.inflection.dasherize(h.inflection.underscore(name))%>">{props.title}</div>
  );
}

export default withFormsy(<%=name%>);
