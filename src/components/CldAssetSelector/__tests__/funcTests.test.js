import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CldAssetSelector from '../CldAssetSelector';

describe('functionality', () => {
  it('test call selector on click', async () => {
    const user = userEvent.setup();
    const mockSelector = jest.fn();
    render(<CldAssetSelector openCldAssetSelector={mockSelector} />);
    const button = screen.getAllByRole('button')[0];
    await user.click(button);
    expect(mockSelector).toHaveBeenCalledTimes(1);
  });

  it('test call selector with image', async () => {
    const user = userEvent.setup();
    const mockSelector = jest.fn();
    const mockValue = { public_id: 'test' };
    render(<CldAssetSelector openCldAssetSelector={mockSelector} value={mockValue} />);
    // The button has name "Replace" when there's a value
    const replaceButton = screen.getByRole('button', { name: /replace/i });
    await user.click(replaceButton);
    expect(mockSelector).toHaveBeenCalledTimes(1);
  });

  it('test remove called', async () => {
    const user = userEvent.setup();
    const mockValue = { public_id: 'test', secure_url: 'https://example.com/test.png' };
    const mockSetValue = jest.fn();
    const mockCld = {
      url: jest.fn().mockReturnValue('https://example.com/test.jpg')
    };
    jest.spyOn(React, 'useContext').mockImplementation(() => {
      return { cld: mockCld };
    });
    render(<CldAssetSelector value={mockValue} setValue={mockSetValue} />);
    const removeButton = document.querySelector('button.remove');
    await user.click(removeButton);
    expect(mockSetValue).toHaveBeenCalled();
  });

  it('test preview image', () => {
    const mockValue = { public_id: 'test', secure_url: 'https://example.com/test.png' };
    const mockSetValue = jest.fn();
    const mockCld = {
      url: jest.fn().mockImplementation((pubId) => {
        if (pubId === 'test2') {
          return 'https://example.com/test2.jpg';
        } else {
          return 'https://example.com/test1.jpg';
        }
      })
    };
    jest.spyOn(React, 'useContext').mockImplementation(() => {
      return { cld: mockCld };
    });
    const { rerender } = render(<CldAssetSelector value={mockValue} setValue={mockSetValue} />);
    rerender(
      <CldAssetSelector
        value={{ public_id: 'test2', secure_url: 'https://example.com/test' }}
        setValue={mockSetValue}
      />
    );
    const img = document.querySelector('img.preview-img');
    expect(img.src).toBe('https://example.com/test2.jpg');
  });
});
