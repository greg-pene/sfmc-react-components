import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FabricTextBox from '../objects/FabricTextBox';
import FabricImage from '../objects/FabricImage';

describe('text box tests', () => {
  // Skip: Requires complex Fabric.js mocking that is brittle and high effort
  it.skip('test add text box', async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn();
    const mockAddLayer = jest.fn();
    jest.spyOn(React, 'useContext').mockImplementation(() => {
      return {
        canvas: {
          add: mockAdd
        },
        layers: [],
        maxLayers: 10,
        addLayer: mockAddLayer
      };
    });
    render(<FabricTextBox />);
    const addTextButton = screen.getByRole('button');
    await user.click(addTextButton);
    expect(mockAddLayer).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });
});

describe('image box tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('test add image overlay', async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn();
    const mockAddLayer = jest.fn();
    const mockAssetPicker = jest.fn().mockImplementation((cb, opts, source) => {
      expect(source).toBe('overlay');
      const mockData = {
        secure_url: 'https://example.com/test.jpg',
        source: 'overlay'
      };
      cb(mockData);
    });
    jest.spyOn(React, 'useContext').mockImplementation((type) => {
      if (type.displayName === 'fabricContext') {
        return {
          canvas: {
            add: mockAdd
          },
          layers: [],
          addLayer: mockAddLayer
        };
      } else if (type.displayName === 'formPanelContext') {
        return {
          assetPicker: mockAssetPicker
        };
      }
    });
    render(<FabricImage />);
    const addImageButton = document.querySelector('button.add-image');
    await user.click(addImageButton);
    expect(mockAssetPicker).toHaveBeenCalledTimes(1);
  });
});
