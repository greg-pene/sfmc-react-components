---
to: src/components/<%=name%>/__tests__/render.test.js
append:
---
import React from 'react';
import <%=name%> from '../<%=name%>';

import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

it('renders correctly enzyme', () => {
  const wrapper = shallow(< <%=name%> />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
