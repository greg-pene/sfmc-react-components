import React from 'react';
import { render } from '@testing-library/react';
import ColorPicker from '../ColorPicker';

describe('tests', () => {
  it('renders', () => {
    const { container } = render(<ColorPicker />);
    expect(container).toMatchSnapshot();
  });
});
