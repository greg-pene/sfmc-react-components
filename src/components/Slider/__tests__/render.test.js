import React from 'react';
import { render, screen } from '@testing-library/react';
import Slider from '../Slider';

it('renders correctly', () => {
  const { container } = render(<Slider />);
  expect(container).toMatchSnapshot();
});

it('test tooltip', () => {
  render(
    <Slider
      value={38}
      fieldInfo={'test 123'}
      sliderLabels={{ 1: '1', 100: '100' }}
      label={'quality'}
    />
  );
  // Tooltip content is rendered in the component with fieldInfo
  expect(screen.getByText('quality')).toBeInTheDocument();
});
