import {isIOS} from '../utils/platform';

export const fontFamilies = {
  ARCHIVO: {
    light: isIOS() ? 'Archivo-Light' : 'ArchivoLight',
    regular: isIOS() ? 'Archivo-Regular' : 'ArchivoRegular',
  },
};
