import React from 'react';
import { render, screen } from '@testing-library/react';
import Checkbox from '../Checkbox';

describe('tests', () => {
  it('renders correctly', () => {
    const { container } = render(<Checkbox />);
    expect(container).toMatchSnapshot();
  });
  it('is not checked by default', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});
