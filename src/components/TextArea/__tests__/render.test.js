import React from 'react';
import { render } from '@testing-library/react';
import { TextArea } from '../TextArea';

describe('tests', () => {
  it('renders', () => {
    const { container } = render(<TextArea />);
    expect(container).toMatchSnapshot();
  });
});
