// @flow
type FieldType = 'text' | 'number' | 'toggle' | 'radio' | 'select' | 'color' | 'textarea';

export type Field = {
  //The field label translation key
  label: string,
  //The field type
  type: FieldType,
  //The field tooltip text translation key
  tooltip?: string,
  //Array of fields that the field depend on to be visible
  dependOnFields?: Array<{ name: string, value: string | number | boolean }>,
  //The property name to pass to the widget
  propertyName: string,
  //The parent group e.g zoomProps
  group: ?string,
  //Field set help text
  fieldSetHelp: ?string,
  //Max value for number field
  max: ?number,
  //Min value for number field (default is 0)
  min: ?number,
  //Step value for number field (default is 1)
  step: ?number
};

type SelectOption = {
  //The select option label
  label: string,
  //The select option value
  value: string | number,
  //The select option cls (for icon if needed)
  cls?: string
};

type OptionsField = Field & {
  //Define if the options field is multiple
  multiple: boolean,
  //The array of the options
  options: ?Array<SelectOption>,
  //The enum name.
  enum: ?string,
  //clearable
  clearable: ?boolean
};

export type FieldSet = {
  //The field-set title translation key
  fieldSetTitle: string,
  //Array of fields
  fields: Array<Field | OptionsField>
};

export const FontFamilies = [
  { value: 'Fira Sans', label: 'Fira Sans' },
  { value: 'Handlee', label: 'Handlee' },
  { value: 'Schoolbell', label: 'Schoolbell' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Courgette', label: 'Courgette' },
  { value: 'Caveat', label: 'Caveat' },
  { value: 'Merienda', label: 'Merienda' },
  { value: 'Orbitron', label: 'Orbitron' },
  { value: 'Kalam', label: 'Kalam' },
  { value: 'Bangers', label: 'Bangers' },
  { value: 'Neucha', label: 'Neucha' },
  { value: 'Modak', label: 'Modak' },
  { value: 'Rock Salt', label: 'Rock Salt' },
  { value: 'Galada', label: 'Galada' },
  { value: 'Fugaz One', label: 'Fugaz One' },
  { value: 'Bad Script', label: 'Bad Script' },
  { value: 'Carter One', label: 'Carter One' },
  { value: 'Ruda', label: 'Ruda' },
  { value: 'Allerta Stencil', label: 'Allerta Stencil' },
  { value: 'Architects Daughter', label: 'Architects Daughter' },
  { value: 'Boogaloo', label: 'Boogaloo' },
  { value: 'Audiowide', label: 'Audiowide' },
  { value: 'Patrick Hand', label: 'Patrick Hand' },
  { value: 'Special Elite', label: 'Special Elite' },
  { value: 'Fredoka One', label: 'Fredoka One' },
  { value: 'Playball', label: 'Playball' },
  { value: 'Russo One', label: 'Russo One' },
  { value: 'Acme', label: 'Acme' },
  { value: 'Wendy One', label: 'Wendy One' },
  { value: 'Oswald', label: 'Oswald' }
];

export const FontSizes = ['24', '36', '48', '56', '96'];
