import React, {useContext } from 'react';
import { FormPanel } from 'sf-component-lib2';
import 'sf-component-lib2/dist/index.css';
import types from 'prop-types';
import { Video2GifContext } from './Video2GifContext';

import './Video2GifAdv.scss';

Video2GifAdv.propTypes = {
  cnf: types.object
};

export default function Video2GifAdv({ cnf }) {
  let { state, updateState, errorUrl} = useContext(Video2GifContext);

  function update(val) {
    updateState(val);
  }
  function VideoMsg() {
    return (
      <span>
        Specify video transformation parameters in URL syntax. See the <a href="https://cloudinary.com/documentation/transformation_reference" target={'_blank'} rel={'noopener noreferrer'} style={{color: '#10a0de'}}>transformation</a> reference for supported video transformations.
      </span>
    );
  }

  return (
    <FormPanel cldConf={cnf.cldConf} updateParentState={update} openCldAssetSelector={cnf.assetSelector} cld={cnf.cld} formConfig={[{
      title: 'Video2gif-advanced',
      text: 'widgetTitles.TransformationSettings',
      fields: [
        {
          type: 'checkbox',
          label: 'Lossy compression',
          name: 'lossy',
          value: state.lossy,
          tooltipPlacement: 'right',
          fieldInfo: 'Applying lossy compression reduces the file size, but may impact visual quality.',
        },
        {
          type: 'checkbox',
          label: 'Infinite looping',
          name: 'loop',
          fieldInfo: 'Play the animated GIF in an infinite loop.',
          tooltipPlacement: 'right',
          value: state.loop
        },
        {
          type: 'select',
          label: 'Quality',
          fieldInfo: 'Apply a level of compression to reduce the file size, with minimal impact to visual quality.',
          name: 'qualityType',
          options: [
            {label: 'Default (50%)', value: 'default'},
            {label: 'Low', value: 'low'},
            {label: 'Eco', value: 'eco'},
            {label: 'Good', value: 'good'},
            {label: 'Best', value: 'best'},
            {label: 'Manual', value: 'manual'}
          ],
          pristine: state.qualityType,
        },
        {
          type: 'slider',
          name: 'qualitySlider',
          min: 1,
          max: 100,
          sliderLabels: {1: '1', 100: '100'},
          value: state.qualitySlider,
          hidden: state.qualityType !== 'manual'
        },
        {
          type: 'textArea',
          label: 'Additional Transformations',
          name: 'custom',
          value: state.custom,
          tooltipPlacement: 'right',
          fieldInfo: <VideoMsg />,
          placeholder: 'Transformation parameters in URL syntax, for example:\n' +
            'a_90/bo_10px_solid_black',
          isError: !!errorUrl,
          errorText: 'Invalid transformation syntax'
        }
      ]
    }]}/>);
}
