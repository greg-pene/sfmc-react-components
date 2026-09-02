import React from 'react';
import { render } from '@testing-library/react';
import ImageSelector from '../ImageSelector';
import Formsy from 'formsy-react';

describe('tests', () => {
  it('renders', () => {
    const analytics = { version: '1.0.0', environment: 'test' };
    const { container } = render(
      <Formsy>
        <ImageSelector name={'test-selector'} analytics={analytics} />
      </Formsy>
    );
    expect(container).toMatchSnapshot();
  });
});
