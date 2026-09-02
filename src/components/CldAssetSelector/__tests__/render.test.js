import React from 'react';
import { render } from '@testing-library/react';
import CldAssetSelector from '../CldAssetSelector';

// Mock context
beforeEach(() => {
  const mockCld = {
    url: jest.fn().mockReturnValue('https://example.com/test.jpg')
  };
  jest.spyOn(React, 'useContext').mockImplementation(() => {
    return { cld: mockCld };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('tests', () => {
  it('renders no asset', () => {
    const { container } = render(<CldAssetSelector />);
    expect(container).toMatchSnapshot();
  });
  it('renders with asset', () => {
    const mockValue = { public_id: 'test', secure_url: 'https://example.com/test.png' };
    const { container } = render(<CldAssetSelector value={mockValue} />);
    expect(container).toMatchSnapshot();
  });
});
