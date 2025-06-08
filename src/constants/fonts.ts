import {isIOS} from '../utils/platformUtils';

export const fontFamilies = {
  ARCHIVO: {
    light: isIOS() ? 'Archivo-Light' : 'ArchivoLight',
    regular: isIOS() ? 'Archivo-Regular' : 'ArchivoRegular',
  },
};
