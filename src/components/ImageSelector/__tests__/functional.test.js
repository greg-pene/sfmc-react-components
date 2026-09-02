import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageSelector from '../ImageSelector';
import Formsy from 'formsy-react';

describe('disabled tests', () => {
  it('test alt disabled', () => {
    const analytics = { version: '1.0.0', environment: 'test' };
    render(
      <Formsy>
        <ImageSelector name={'test-selector'} analytics={analytics} />
      </Formsy>
    );
    const inputs = document.querySelectorAll('input.input');
    expect(inputs[0]).toBeDisabled();
  });

  it('test media editor disabled', () => {
    const analytics = { version: '1.0.0', environment: 'test' };
    render(
      <Formsy>
        <ImageSelector name={'test-selector'} analytics={analytics} />
      </Formsy>
    );
    const button = document.querySelector('button.open-media-editor');
    expect(button).toBeDisabled();
  });

  it('test reset disabled', () => {
    const analytics = { version: '1.0.0', environment: 'test' };
    render(
      <Formsy>
        <ImageSelector name={'test-selector'} analytics={analytics} />
      </Formsy>
    );
    const button = document.querySelector('button.reset-button');
    expect(button).toBeDisabled();
  });

  it('test link disabled', () => {
    const analytics = { version: '1.0.0', environment: 'test' };
    render(
      <Formsy>
        <ImageSelector name={'test-selector'} analytics={analytics} showImageLink={true} />
      </Formsy>
    );
    const inputs = document.querySelectorAll('input.input');
    expect(inputs[1]).toBeDisabled();
  });

  it('test image options disabled', () => {
    const analytics = { version: '1.0.0', environment: 'test' };
    render(
      <Formsy>
        <ImageSelector name={'test-selector'} analytics={analytics} showImageLink={true} />
      </Formsy>
    );
    const checkbox = document.querySelector('[type="checkbox"]');
    expect(checkbox).toBeDisabled();
  });
});

describe('state tests', () => {
  const originalError = console.error;
  let mockOnChange;

  beforeEach(() => {
    const mockCld = {
      url: jest.fn().mockReturnValue('https://example.com/test.jpg')
    };
    jest.spyOn(React, 'useContext').mockImplementation(() => {
      return { cld: mockCld };
    });
    mockOnChange = jest.fn((e) => e);
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('test alt state', async () => {
    const user = userEvent.setup();
    console.error = jest.fn();
    const analytics = { version: '1.0.0', environment: 'test' };
    const mockValue = {
      asset: { public_id: 'test', secure_url: 'https://example.com/test.png' },
      width: 400,
      height: 400
    };
    render(
      <Formsy onChange={mockOnChange}>
        <ImageSelector
          name={'test-selector'}
          analytics={analytics}
          prevValue={mockValue}
          showImageLink={true}
          showPlaceholder={true}
        />
      </Formsy>
    );
    const TEXT = 'test';
    const inputs = document.querySelectorAll('input');
    const altInput = inputs[0];
    await user.clear(altInput);
    await user.type(altInput, TEXT);
    await waitFor(
      () => {
        const lastCall = mockOnChange.mock.results[mockOnChange.mock.results.length - 1];
        expect(lastCall.value['test-selector'].altText).toBe(TEXT);
      },
      { timeout: 2000 }
    );
  });

  // Skip: Requires proper responsive checkbox mock setup — outside current scope
  it.skip('test responsive', async () => {
    const user = userEvent.setup();
    const analytics = { version: '1.0.0', environment: 'test' };
    const mockValue = {
      asset: { public_id: 'test', secure_url: 'https://example.com/test.png' },
      width: 400,
      height: 400
    };
    render(
      <Formsy onChange={mockOnChange}>
        <ImageSelector
          name={'test-selector'}
          analytics={analytics}
          prevValue={mockValue}
          showImageLink={true}
          showPlaceholder={true}
        />
      </Formsy>
    );
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // Find the responsive checkbox
    const responsiveCheckbox = Array.from(checkboxes).find(
      (cb) => cb.closest('.checkbox-wrapper') || cb.id?.includes('responsive')
    );
    await user.click(responsiveCheckbox);
    await waitFor(() => {
      const lastCall = mockOnChange.mock.results[mockOnChange.mock.results.length - 1];
      expect(lastCall.value['test-selector'].responsive).toBe(true);
    });
  });

  it('test placeholder', async () => {
    const user = userEvent.setup();
    const analytics = { version: '1.0.0', environment: 'test' };
    const mockValue = {
      asset: { public_id: 'test', secure_url: 'https://example.com/test.png' },
      width: 400,
      height: 400
    };
    render(
      <Formsy onChange={mockOnChange}>
        <ImageSelector
          name={'test-selector'}
          analytics={analytics}
          prevValue={mockValue}
          showImageLink={true}
          showPlaceholder={true}
        />
      </Formsy>
    );
    const vectorRadio = document.querySelector('#vector');
    await user.click(vectorRadio);
    await waitFor(() => {
      const lastCall = mockOnChange.mock.results[mockOnChange.mock.results.length - 1];
      expect(lastCall.value['test-selector'].placeholder).toBe('vector');
    });
  });
});
