import ezbitmap from '@lisperati/ezbitmap';

const image=ezbitmap(String.raw`
   __,---.      
  /__|o\  )     
  "--\ / /      
     ,|^:\
    //   \\     
   {(     )}    
 #===M===M===#
     T|||T
     |||||
     |||||
      T|T      
      |||       
       U        
`);

document
  .getElementById('canvas')
  .getContext('2d')
  .putImageData(image,0,0);

