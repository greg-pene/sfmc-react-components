import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CldMediaEditor from '../CldMediaEditor';

describe('functionality', () => {
  it('test open mew', async () => {
    const user = userEvent.setup();
    const show = jest.fn();
    global.cloudinary = {
      mediaEditor: jest.fn().mockImplementation(() => {
        return {
          on: jest.fn(),
          update: jest.fn(),
          show: show
        };
      })
    };
    const mockAsset = { public_id: 'test', secure_url: 'https://example.com/test.png' };
    render(<CldMediaEditor asset={mockAsset} cloudName={'testCloud'} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(show).toHaveBeenCalledTimes(1);
  });
});
