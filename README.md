# Introduction

The `ezbitmap` library lets you generate a beautiful image directly from ASCII art right in your source code. Go to the website [ezbitmap.com](https://ezbitmap.com) to see this library in action, and to use the ezbitmap art editor!

There is also a version of this library [for React programmers](https://github.com/drcode/ezbitmap-react), as well as one for [Clojure programmers](https://github.com/drcode/ezbitmap-clj).

Follow me on [twitter](https://twitter.com/lisperati) for any future news on this library.

# Installation

This is an NPM library, letting you create images inside a web app. Simply load the library into your web app via:

```
npm add @lisperati/ezbitmap
```

Now, you can create javascript imagedata directly from ASCII art in your javascript code:


```javascript
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
```

This is what you will see after running this code:

![alt text](https://github.com/drcode/ezbitmap/blob/master/screenshot.png?raw=true)

A full working example is in the `example` directory.

# License

This library is open source under the Eclipse Public License 1.0
