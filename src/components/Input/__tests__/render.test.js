import React from 'react';
import { render } from '@testing-library/react';
import { Input } from '../Input';

describe('tests', () => {
  it('renders', () => {
    const { container } = render(<Input />);
    expect(container).toMatchSnapshot();
  });
});
