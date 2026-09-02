import React, { useContext } from 'react';

import { FormPanel } from 'sf-component-lib2';
import { ImageContext } from './ImageContext';


function AdvEditor({ cnf }) {
  let { imageState, setImageState } = useContext(ImageContext);
  return (
    <React.Fragment>
      <FormPanel cldConf={cnf.cldConf} updateParentState={setImageState} openCldAssetSelector={cnf.assetSelector} cld={cnf.cld} formConfig={[
        {
          fields: [
            {
              name: 'ovEd',
              imageState: imageState,
              cloudName: cnf.cldConf.cloud_name,
              baseImageUrl: 'https://res.cloudinary.com/demo/image/upload/dpr_auto,f_auto,q_auto/sample',
              type: 'overlyEditor',
              hidden: false
            }
          ]
        }]} />
    </React.Fragment>
  );
}

export default AdvEditor;
