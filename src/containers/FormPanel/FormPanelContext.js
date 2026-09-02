import React, { createContext } from 'react';
import types from 'prop-types';

export const FormPanelContext = createContext([]);

FormPanelContextProvider.propTypes = {
  cld: types.any,
  assetPicker: types.any,
  children: types.any
};

export function FormPanelContextProvider(props) {
  return (
    <FormPanelContext.Provider value={{ cld: props.cld, assetPicker: props.assetPicker }}>
      {props.children}
    </FormPanelContext.Provider>
  );
}
