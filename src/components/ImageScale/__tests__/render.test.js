import React from 'react';
import { render } from '@testing-library/react';
import ImageScale from '../ImageScale';

it('renders correctly', () => {
  const val = { width: 100, height: 100 };
  const { container } = render(<ImageScale value={val} width={100} height={100} />);
  expect(container).toMatchSnapshot();
});
