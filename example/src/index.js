import ezbitmap from '@lisperati/ezbitmap';

const image=ezbitmap(`
            __/\\__            
            ==/\\==            
 ____________/__\\____________ 
/_____________brn____________\\
  __||__||__/m--m\\__||__||__  
 /__|___|___( >< )___|___|__\\ 
     brnbrn_/\`--\`\\_brnbrn     
          (/------\\)
            gray
`);

document
    .getElementById('canvas')
    .getContext('2d')
    .putImageData(image,0,0)
