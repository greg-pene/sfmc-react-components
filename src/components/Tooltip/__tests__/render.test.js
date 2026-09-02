import React from 'react';
import { render } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('tests', () => {
  it('renders', () => {
    const { container } = render(<Tooltip />);
    expect(container).toMatchSnapshot();
  });
});
