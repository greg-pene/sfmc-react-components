import React from 'react';
import { render } from '@testing-library/react';
import { RadioButtons } from '../RadioButtons';

describe('tests', () => {
  it('renders', () => {
    const items = [
      { value: 1, label: 'one' },
      { value: 2, label: 'two' },
      { value: 3, label: 'three' },
      { value: 4, label: 'four' },
      { value: 5, label: 'five' }
    ];
    const { container } = render(<RadioButtons items={items} />);
    expect(container).toMatchSnapshot();
  });
});
