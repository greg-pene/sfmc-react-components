import React, { useContext } from 'react';

import { FormPanel } from 'sf-component-lib2';
import types from 'prop-types';
import { ImageContext } from './ImageContext';
import { buildImageUrl } from './utils';
import { default as isEmpty} from 'lodash.isempty';


Advanced.propTypes = {
  cnf: types.object
};

export default function Advanced({ cnf }) {
  let { imageState, setImageState, hasTransformationError } = useContext(ImageContext);
  const {imageSelect: {asset, width, height, cropAndResize}} = imageState;
  let baseImage = null;
  if (!isEmpty(asset)) {
    baseImage = buildImageUrl(asset, cnf.cld, { width: width, height: height }, cropAndResize);
  }
  let userAgent;
  if (cnf.ver) {
    userAgent = `CloudinarySFMC ${cnf.ver.version} ${cnf.ver.environment}`;
  }
  function GifMsg() {
    return (<span>Specify transformation parameters that are supported for animated GIFs in URL syntax.<br />See the transformation reference and the animated images documentation for details
      <br /><a href="https://cloudinary.com/documentation/transformation_reference" target={'_blank'} rel={'noopener noreferrer'} style={{color: 'white'}}>transformation reference</a>
      <br /><a href="https://cloudinary.com/documentation/animated_images" target={'_blank'} rel={'noopener noreferrer'} style={{color: 'white'}}>animated images</a></span>);
  }


  return (
    <React.Fragment>
      {(baseImage) &&
      <FormPanel cldConf={cnf.cldConf} updateParentState={setImageState} openCldAssetSelector={cnf.assetSelector} cld={cnf.cld} formConfig={[
        {
          title: 'widgetTitles.imageSettings',
          fields: [
            {
              type: 'radioButtons',
              name: 'overlaySelect',
              selected: imageState.overlaySelect || 'editor',
              options: [
                { value: 'editor', label: 'Image and Text Overlay Editor' },
                { value: 'custom', label: 'Custom Transformations' }
              ],
            },
            {
              name: 'ovEd',
              imageState: imageState.ovEd,
              baseImageUrl: baseImage,
              cldConf: cnf.cldConf,
              width: imageState.imageSelect.width,
              height: imageState.imageSelect.height,
              type: 'overlyEditor',
              userAgent: userAgent,
              hidden: (imageState.overlaySelect !== 'editor')
            },
            {
              type: 'textArea',
              name: 'transOverride',
              label: 'Custom Image Transformations',
              value: imageState.transOverride,
              placeholder: 'Transformation parameters in URL syntax',
              hidden: (imageState.overlaySelect !== 'custom'),
              errorText: 'Invalid transformation syntax',
              fieldInfo: imageState.imageSelect.nonEditable ? <GifMsg /> : null,
              isError: hasTransformationError
            }


          ]
        }]} />}
    </React.Fragment>
  );
}

