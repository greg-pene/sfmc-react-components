import React from 'react';
import { render } from '@testing-library/react';
import ToggleSwitch from '../ToggleSwitch';

describe('tests', () => {
  it('renders', () => {
    const { container } = render(<ToggleSwitch label={'image'} />);
    expect(container).toMatchSnapshot();
  });
});
