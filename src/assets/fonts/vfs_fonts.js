// this.pdfMake = this.pdfMake || {};
import robotoItalic from './robotoItalic.js';
import robotoMedium from './robotoMedium.js';
import robotoMediumItalic from './robotoMediumItalic.js';
import robotoRegular from './robotoRegular.js';

const vfs = {
  //   'Roboto-Italic.ttf': robotoItalic['Roboto-Italic.ttf'],
  'Roboto-Medium.ttf': robotoMedium['Roboto-Medium.ttf'],
  //   'Roboto-MediumItalic.ttf': robotoMediumItalic['Roboto-MediumItalic.ttf'],
  'Roboto-Regular.ttf': robotoRegular['Roboto-Regular.ttf'],
};

// console.log('vfs 🍄', vfs);
// console.log('robotoItalic 🍧', robotoItalic['Roboto-Italic.ttf']);
// console.log('robotoMedium 🍫', robotoMedium['Roboto-Medium.ttf']);
// console.log('robotoMediumItalic 🧃', robotoMediumItalic['Roboto-MediumItalic.ttf']);
// console.log('robotoRegular 🍾', robotoRegular['Roboto-Regular.ttf']);
export default vfs;
