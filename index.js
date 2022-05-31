import {xbr2x,xbr4x} from 'xbr-js';

var debugging;

function base64ToArray(base64) {
    var binstr = atob(base64);
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
}

function partial(fn,...args){
  return (...rest)=>{
    return fn(...args,...rest);
  }
}

function emptyRow(row){
  for(let i=0;i<row.length;i++){
    if (row.charAt(i)!==' ')
      return false;
  }
  return true;
}

function normalizeArt(art){//Set the width of all lines identical and make art compact
  art=art.split("\n");
  while(art.length>0 && emptyRow(art[0]))
    art.splice(0,1);
  while(art.langth>0 && emptyRow(art[art.length-1]))
    art.pop();
  var wid=0;
  var leftPad=Number.MAX_SAFE_INTEGER;
  art.forEach(row => {
    let curLeftPad=0;
    let i=0;
    for(;i<row.length;i++){
      if (row.charAt(i)===' ')
        curLeftPad++;
      else
        break;
    }
    if(i===row.length)
      curLeftPad=Number.MAX_SAFE_INTEGER;
    leftPad=Math.min(leftPad,curLeftPad);
    let curWid=row.length;
    while(curWid>0&&row.charAt(curWid-1)===' ')
      curWid--;
    wid=Math.max(wid,curWid)});
  art=art.map(row=>{
    return row.substring(leftPad,wid).padEnd(wid-leftPad,' ');
  })
  return art;
}

function digitizeArt(art){
  const artWidth=art[0].length
  const artHeight=art.length;
  const width=artWidth*5;
  const height=artHeight*5;
  const bmp=new Uint8Array(width*height);
  for(let y=0;y<artHeight;y++)
    for(let x=0;x<artWidth;x++){
      const offset=art[y].charCodeAt(x)-32
      for(let yy=0;yy<5;yy++)
        for(let xx=0;xx<5;xx++)
          bmp[(y*5+yy)*width+(x*5+xx)]=font[5*5*offset+yy*5+xx];
    }
  return {bmp:bmp,
          width:width,
          height:height};
}

const colors=[{name:  "blue",
               short: "blu",
               rgb:   [42,75,215]},
              {name:  "green",
               short: "grn",
               rgb:   [29,105,20]},
              {name:  "red",
               short: "red",
               rgb:   [173,35,35]},
              {name:  "purple",
               short: "prp",
               rgb:   [129,38,192]},
              {name:  "yellow",
               short: "yel",
               rgb:   [255,238,51]},
              {name:  "orange",
               short: "org",
               rgb:   [255,146,51]},
              {name:  "gray",
               short: "gry",
               rgb:   [100,100,100]},
              {name:  "pink",
               short: "pnk",
               rgb:   [255,180,180]},
              {name:  "tan",
               short: "tan",
               rgb:   [243,202,167]},
              {name:  "brown",
               short: "brn",
               rgb:   [129,74,25]},
              {name:  "silver",
               short: "slv",
               rgb:   [160,160,160]},
              {name:  "lime",
               short: "lim",
               rgb:   [129,197,122]},
              {name:  "teal",
               short: "tel",
               rgb:   [157,175,255]},
              {name:  "sky",
               short: "sky",
               rgb:   [41,208,208]},
              {name:  "white",
               short: "wht",
               rgb:   [255,255,255]},
              {name:  "black",
               short: "blk",
               rgb:   [39,39,39]}];

const allColors=[];
colors.forEach(({rgb})=>{
  allColors.push(rgb);
});
colors.forEach(({rgb})=>{
  if(rgb[0]+rgb[1]+rgb[2]>550)
    allColors.push(rgb.map((n)=>Math.floor(128+n/2)))
  else
    allColors.push(rgb.map((n)=>Math.min(255,n+60)));
});
colors.forEach(({rgb})=>{
  allColors.push(rgb.map((n)=>Math.floor(n*0.7)));
});

const nameToColor=[];
colors.forEach(({name,short},index)=>{
  nameToColor[name]=index;
  nameToColor[short]=index;
});

function generateImageData(width,height,bmp){
  const resultBmp=new Uint8ClampedArray((width+2)*(height+2)*4);
  for(let i=0;i<width*height;i++){
    const col=bmp[i];
    let r,g,b,a;
    a=255;
    if(col===255) {
      [r,g,b]=[255,255,255];
      a=0;
    }
    else if(col===254)
      [r,g,b]=[0,0,0];
    else 
      [r,g,b]=allColors[col%48];
    const off=(Math.floor(i/width)*(width+2)+(i%width)+1)*4;
    resultBmp[off+0]=r;
    resultBmp[off+1]=g;
    resultBmp[off+2]=b;
    resultBmp[off+3]=a;
  }
  return new ImageData(resultBmp,width+2);
}

// #

// ##
// O# [1 0] [0 -1]

//  # 
// #O#
//  #  reset [-1 0] [1 0] [0 1] [0 -1]

//  ##
// ####
// ##O#
//  ##   [-1 0] [0 -1]

//  ###
// #####
// ##O##
// #####
//  ###  [1 0] [0 1]

function shiftBmp(width,height,bmpReference,bmp,offset){
  const [offx,offy]=offset;
  for(let y=Math.max(0,-offy);y<Math.min(height,height-offy);y++){
    for(let x=Math.max(0,-offx);x<Math.min(width,width-offx);x++){
      const col=bmpReference[y*width+x];
      if(col===254){
        bmp[(y+offy)*width+x+offx]=col;
      }
    }
  }
}

function unionInPlace(dst,src){
  for(let e of src){
    dst.add(e);
  }
}

function dbg(s,val){
  if(!debugging)
    return;
  if(typeof s==="object"){
    const key=Object.keys(s)[0];
    val=s[key];
    s=key;
  }
  console.log(s+"=");
  console.log(val);
}

function findRegions(fullBackground,width,height,bmp){
  let regions=[];
  let scanline=Array(width);//each x position is assigned a region, region objects are shared in the object if regions merge
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const above=scanline[x];
      const left=(x>0)?scanline[x-1]:null;
      const empty=(bmp[y*width+x]===255);
      const pos=y*width+x;
      if (empty){
        if (above&&left){
          if(above===left)
            above.add(pos);
          else{
            unionInPlace(left,above);
            left.add(pos);
            for(let xx=0;xx<width;xx++){
              if(scanline[xx]===above){
                scanline[xx]=left;
              }
            }
          }
        }
        else{
          if(above)
            above.add(pos)
          else if(left){
            left.add(pos);
            scanline[x]=left;
          }
          else{
            const set=new Set();
            set.add(pos);
            scanline[x]=set;
          }
        }
      }
      else{
        if(above){
          let found=false;
          for(let xx=0;xx<width;xx++){
            if(scanline[xx]===above&&xx!==x){
              found=true;
            }
          }
          if(!found){
            regions.push(above);
          }
          scanline[x]=null;
        }
      }
    }
  }
  if(fullBackground){
    for(let x=0;x<width;x++){
      if(scanline[x])
        regions.push(scanline[x]);
    }
  }
  else{
    regions=regions.filter((region)=>{
      for(let pos of region){
        let n=pos%width;
        if(n===0 || n===width-1 || pos<width)
          return false;
      }
      return true;});
  }  
  return regions;
}

function printRegions(s,regions){
  s+="  ";
  for(const region of regions){
    s+="(";
    for(const pos of region){
      s+=" "+pos;
    }
    s+=") ";
  }
  console.log(s);
}

function findSubregions(width,region){
  const subregions=[];
  const stack=[];
  while(region.size>0){
    const subregion=new Set();
    const [initial]=region;
    stack.push(initial);
    while(stack.length>0){
      const pos=stack.pop();
      if(region.has(pos)){
        subregion.add(pos);
        region.delete(pos);
        stack.push(pos+1);
        stack.push(pos-1);
        stack.push(pos+width);
        stack.push(pos-width);
      }
    }
    subregions.push(subregion);
  }
  return subregions;
}

function mergeRegions(width,regions,regionsSrc){
  for(const regionSrc of regionsSrc){
    const oldSize=regionSrc.size;
    let num=regions.length;
    for(let i=0;i<num;i++){
      const region=regions[i];
      for(const pos of regionSrc)
        if(region.has(pos))
          regionSrc.delete(pos);
    }
    if(regionSrc.size>0){
      if (oldSize!=regionSrc.size){
        //It's possible that the regionSrc got split into pieces by subracting the existing regions: We need to fix this by sorting through every pixel and see if it has contact with an existing subregion
        const subregions=findSubregions(width,regionSrc);
        regions=regions.concat(subregions);
      }
      else {
         regions.push(regionSrc);
      }
    }
  }
  return regions;
}

function printSet(s,set){
  s+=" (";
  for(const n of set){
    s+=" "+n;
  }
  s+=") ";
  console.log(s);
}

function fillPass(acc,item){
  let {width,height,bmp,regions}=acc;
  const [brushId,burn]=item;
  const brush=brushes[brushId];
  //with "burn" it means we apply all previously found regions as black to the image before looking for new regions. This can patch up holes that allow new regions to be foudn
  if(burn){
    regions.forEach((region)=>region.forEach((pos)=>bmp[pos]=254));
  }
  //We are going to create a new temporary bitmap that uses the current brush to "smear" existing bitmap, to plug holes that would prevent filling
  const bmpTemp=new Uint8Array(bmp);
  brush.forEach(partial(shiftBmp,width,height,bmp,bmpTemp));
  //Now we find all watertight regions in the smeared image
  const regionsNew=findRegions(false,width,height,bmpTemp);
  //Since the regions are specific to the smeared image, they are missing pixels along the edges of regions. Therefore, we will now fatten the regions, so that they are relevant to the original image.
  const regionsFat=[];
  regionsNew.forEach((regionNew)=>{
    const regionFat=new Set();
    for(const pos of regionNew){
      regionFat.add(pos)
      for (const off of brush){
        const [offx,offy]=off;
        regionFat.add(pos-(offy*width+offx))
      }
    };
    regionsFat.push(regionFat);
  });
  //The fat regions are added to our accumulated regions. However, since they may include already-assigned pixels, we need to run an algo to come up with a new canonical set of regions
  acc.regions=mergeRegions(width,regions,regionsFat);
  acc.bmpTemp=bmpTemp;
  return acc;
}

function average(arr){
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function regionSummaries(width,regions){
  const summaries=[];
  for(let i=0;i<regions.length;i++){
    const region=regions[i];
    const xs=[];
    const ys=[];
    for(const pos of region){
      xs.push(pos%width);
      ys.push(Math.floor(pos/width));
    }
    const y=average(ys);
    const x=average(xs);
    const center=Math.floor(y)*width+Math.floor(x);
    const outline=[];
    for(const pos of region){
      [pos-1,pos+1,pos-width,pos+width].forEach((k)=>{
        if(!region.has(k))
          outline.push(k);
      });
    }
    const neighbors=[];
    for(let k=0;k<regions.length;k++){
      if(k!=i){
        const regionOther=regions[k];
        for(const pos of outline)
          if(regionOther.has(pos)){
            neighbors.push(k);
            break;
          }
      }
    }
    summaries.push({id:i,
                    x:x,
                    y:y,
                    center:center,
                    num:region.size,
                    neighbors:neighbors});
  }
  return summaries;
}

function estimate([bias,...more],...xs){
  if(more.length!==xs.length){
    throw "wrong length";
  }
  let n=bias;
  for(let i=0;i<more.length;i++){
    n+=more[i]*xs[i];
  }
  return n;
}

const largeRegionCutoffRegression=[2.1445760763310275,-0.02566328196508394,0.008719882234830244,-0.0028791308610713667,0.3445271459218784];

function bestLargeRegionCutoff(width,height,summary){
  const sizeSum=width+height;
  const size=width*height;
  const pixels=summary.reduce((acc,item)=>item.num+acc,0);
  const regionNum=summary.length;
  return estimate(largeRegionCutoffRegression,sizeSum,size,pixels,regionNum);
}

function squareDist(pt1,pt2){
  return (pt1.x-pt2.x)*(pt1.x-pt2.x)+(pt1.y-pt2.y)*(pt1.y-pt2.y);
}

function clusterColors(width,largeRegionCutoff,summary,labels){
  const big=[];
  const small=[];
  //first we break all regions into big or small regions, based on the cutoff
  const vals=Array.from(summary.values());
  vals.forEach((item)=>{
    if(item.num>=largeRegionCutoff)
      big.push(item);
    else
      small.push(item);
  });
  //we are now creating a data structure that tells you for any region, what the closest "big" region is that it is connected to
  const connectedBig={};
  //all big maps are directly connected to themselves
  big.forEach((item)=>connectedBig[item.id]=item.id);
  //have to exhaustively go through the graph of connections to find what large regions the small regions are connected to
  while(true){
    const newConnected={};
    small.forEach((item)=>{
      if(!connectedBig.hasOwnProperty(item.id)){
        var big=null;
        item.neighbors.forEach((id)=>{
          if(connectedBig.hasOwnProperty(id)){
            newConnected[item.id]=connectedBig[id];
          }
        })
      }
    });
    if(Object.keys(newConnected).length===0)
      break;
    for(const [k,v] of Object.entries(newConnected)){
      connectedBig[k]=v;
    }
  }
  //If colors are labeled, figure out which label is closest to the center of which large region, until all labels are assigned
  const colors={};
  while(true){
    var bestDist=100000;
    var bestId=-1;
    var bestLabelIndex=null;
    big.forEach((item)=>{
      if(!colors.hasOwnProperty(item.id)){
      labels.forEach((label,labelIndex)=>{
        const dist=squareDist(summary[item.id],label);
        if(dist<bestDist){
          bestDist=dist;
          bestId=item.id;
          bestLabelIndex=labelIndex;
        }})}});
    if(bestId===-1)
      break;
    colors[bestId]=labels[bestLabelIndex].col;
    labels.splice(bestLabelIndex,1);
  }
  //We'll keep iterating through the four most popular colors (blue green red purple) to pick good arbitrary colors
  const remainingColors=[0,1,2,3];
  let colorIndex=(big.length+3)%remainingColors.length;
  big.forEach((item)=>{
    if(!colors.hasOwnProperty(item.id)){
      colors[item.id]=remainingColors[colorIndex];
      colorIndex=(colorIndex+1)%remainingColors.length;
    }});
  //small regions borrow the color of the large regions, except we darken/lighten them based on whether they are above/below the large region
  small.forEach((item)=>{
    const bigid=connectedBig[item.id];
    if(connectedBig.hasOwnProperty(item.id)){
      if(item.center<summary[bigid].center)
        colors[item.id]=colors[bigid]+16;
      else
        colors[item.id]=colors[bigid]+32;
    }
    else if(item.num>=2 && item.num<10 && item.neighbors.length===0)
      colors[item.id]=10;
    else
      colors[item.id]=6;
  });
  return colors;
}

const brushImages=[[`
`,0]
                   ,[`
##
#`,1]
                   ,[`
 #
# #
 #`,1]
                   ,[`
###
# #
###`,1]
                   ,[`
 ## 
# ##
####
 ##`,1]
                   ,[`
 ###
#####
## ##
#####
 ###`,2]];

const brushes=brushImages.map(([s,radius],index)=>{
  s=s.split("\n");
  const brush=[];
  for(let y=0;y<5;y++)
    for(let x=0;x<5;x++)
      if(y+1<s.length && s[y+1].charAt(x)=='#')
        brush.push([x-radius,y-radius]);
  return brush;
})

function fillHighNeighborPixels(width,height,amnt,bmpReference,bmp){
  for(let pos=width+1;pos<width*(height-1)-1;pos++){
    if(bmp[pos]===255){
      let num=0;
      let col=6;
      [(pos-1),(pos+1),(pos-width),(pos-width-1),(pos-width+1),(pos+width),(pos+width-1),(pos+width+1)].forEach((p)=>{
        const val=bmpReference[p];
        if(val!=255){
          num++;
          if(val!=254){
            col=val;
          }
        }
      });
      if(num>=amnt){
        let found=false;
        [(pos-1),(pos+1),(pos-width),(pos+width)].forEach((p)=>{
          const val=bmpReference[p];
          if(val<254){
            col=val;
            found=true;
          }
        });
        if (found){
          bmp[pos]=col;
        }
      }
    }
  }
}

function extractLabelsHorizontal(art){
  var labels=[];
  for(var y=0;y<art.length;y++){
    var found=true;
    while (found){
      found=false;
      for(const [key,value] of Object.entries(nameToColor)){
        const n=art[y].indexOf(key);
        if(n!=-1){
          art[y]=art[y].substring(0,n)+(' '.repeat(key.length))+art[y].substring(n+key.length);
          labels.push({x:(n+0.5+key.length/2)*5,y:(y+0.5)*5,col:value});
          found=true;
        }
      }
    }
  }
  return labels;
}

function flipStringArray(arr){
  var k=[]
  for(var i=0;i<arr[0].length;i++){
    k.push([]);
  }
  arr.forEach((s,index)=>{
    for(var i=0;i<s.length;i++){
      k[i].push(s.charAt(i));
    }});
  return k.map((g)=>g.join(""));
}

function extractLabels(art){
  const labels=extractLabelsHorizontal(art);
  const flip=flipStringArray(art);
  const labelsv=extractLabelsHorizontal(flip);
  const flip2=flipStringArray(flip);
  flip2.forEach((s,index)=>{art[index]=s});
  labelsv.forEach((label)=>{labels.push({x:label.y,y:label.x,col:label.col})});
  if(art.length>0 && art[0].length>0){
    while(true){
      var found=false;
      if(art.every((s)=>{return s.charAt(0)===" "})){
        art.forEach((s,i)=>art[i]=s.slice(1));
        labels.forEach((label)=>label.x-=5);
        found=true;
      }
      if(!found)
        break;
    }
    while(true){
      var found=false;
      if(art[0].trim().length===0){
        art.splice(0,1);
        labels.forEach((label)=>label.y-=5);
        found=true;
      }
      if(!found)
        break;
    }
    while(true){
      var found=false;
      if(art.every((s)=>{return s.charAt(s.length-1)===" ";})){
        art.forEach((s,i)=>art[i]=s.slice(0,s.length-1));
        found=true;
      }
      if(!found)
        break;
    }
    while(true){
      var found=false;
      if(art[art.length-1].trim().length===0){
        art.pop();
        found=true;
      }
      if(!found)
        break;
    }
  }
  return labels;
}

function ezbitmap(art,options){
  art=normalizeArt(art);
  if(art.length===0){
    return null;
  }
  debugging=options.debugging;
  const labels=extractLabels(art);
  const {bmp,width,height}=digitizeArt(art);
  const passes=[[0,false],[1,false],[2,false],[3,false],[4,false],[5,false],[0,true],[1,false],[2,false],[3,false],[4,false],[0,true]];
  const bmpOriginal=new Uint8Array(bmp);
  const {regions,bmpTemp}=passes.reduce(fillPass,{width:width,
                                                  height:height,
                                                  bmp:bmp,
                                                  regions:[]});
  const summary=regionSummaries(width,regions);
  const largeRegionCutoff=bestLargeRegionCutoff(width,height,summary);
  const colors=clusterColors(width,largeRegionCutoff,summary,labels);
  for(let i=0;i<regions.length;i++){
    const region=regions[i];
    const col=colors[i];
    if (col!==null){
      region.forEach((pos)=>{
        if(bmpOriginal[pos]===255){
          bmpOriginal[pos]=col;}});
    }
  }
  const bmpReference=new Uint8Array(bmpOriginal);
  fillHighNeighborPixels(width,height,4,bmpReference,bmpOriginal);
  const bmpReference2=new Uint8Array(bmpOriginal);
  fillHighNeighborPixels(width,height,4,bmpReference2,bmpOriginal);

  const imageData=generateImageData(width,height,bmpOriginal);
  const originalPixelView = new Uint32Array(imageData.data.buffer);
  const scaledPixelView = xbr4x(originalPixelView, width+2,height+2);
  const resultBmp=new Uint8ClampedArray(scaledPixelView.buffer);
  return new ImageData(resultBmp,(width+2)*4);
}

const font=base64ToArray("/////////////////////////////////////v/////+//////7////////////+/////v/+///+//7///////////////////////7//v/+/v7+/v/+//7//v7+/v7//v/+///+/v7+/v/+//7//v7+/////v/+/v7+/v/+/v///v7+//7////+/////v/+/v7///7+//7+///+///+///+/v/+/v///v///v7//v///v/////+///////////////////////////+/v///v/////+//////7///////7+/v7///////7//////v/////+///+/v///////v///v/+//7//v7+//7//v/+///+//////7//////v///v7+/v7///7//////v/////////////////////////+/////v/////////////////+/v7+/v////////////////////////////////////7+/////v7///////7////+/////v////7////+///////+/v7//v////7+//7//v7////+//7+/v////7////+/v/////+//////7///7+/v7+//7+/v/+/////v///v7///7////+/v7+/v/+/v7//v////7///7+//7////+//7+/v/////+/////v7///7//v/+/v7+/v////7//v7+/v7+//////7+/v7///////7+/v7+///+/v7+/v/////+/v7+//7////+//7+/v/+/v7+/v/////+//////7//////v/////+//7+/v/+/////v/+/v7//v////7//v7+///+/v7//v////7//v7+/v/////+//////7//////////v7///////////7+//////////////////7+///////////+/v///v7///////7+///+///+/v///////v///////v7///////7+/v7+///////+/v7+/v///////v7///////7///////7+///+///+/v/////+/v7//v////7////+/////v/////+/////v7+//7+/v7+/v7///7+/v///v/+/v7///7+/v/+/////v7+/v7+/v////7+/////v7+/v7//v////7+/v7+//7////+/v7+/v///v7+/v7//////v/////+///////+/v7+/v7+/v/+/////v7////+/v////7+/v7+//7+/v7+/v/////+/v7///7//////v7+/v7+/v7+/v7//////v7+/v7+//////7///////7+/v7+//////7///7+/v////7//v7+//7////+/v////7+/v7+/v7////+/v////7+/v7+/v///v/////+//////7///7+/v7+//////7//////v/////+/v////7//v7+//7////+/v///v/+/v7///7///7//v////7+//////7//////v/////+//////7+/v7+//7//v/+//7//v7//v/+/v/+//7+//7//v7////+/v7///7+//7//v7///7+/v////7//v7+//7////+/v////7+/////v/+/v7//v7+/v/+/////v7+/v7//v/////+///////+/v7//v////7+/////v7///7+//7+/v7+/v7+//7////+/v7+/v/+///+//7////+//7+/v7+/v/////+/v7//////v7+/v7+//7+/v7+///+//////7//////v/////+///+/////v7////+/v////7+/////v/+/v7//v////7+/////v/+//7///7//v////7///7////+/v/+//7+//7//v7//v/+//7+/v/+/////v/+//7////+/////v/+//7////+/v////7//v/+/////v/////+//////7///7+/v7+/////v////7////+/////v7+/v7///7+/v///v/////+//////7//////v7+/v///////v///////v///////v///////v7+/v/////+//////7//////v///v7+//////7////+//7//v////7////////////////////////////////////////+/v7+/v/+///////+///////////////////////////////+/v7///7+/v7+/////v/+/v7+/v/////+//////7+/v7//v////7+/v7+/////////////////v7+/v7///////7+/v7//////v/////+//7+/v7+/////v/+/v7+/////////v7+//7+/v7+/v///////v7+/////v////7+/////v/////+/v////7//////v7+//7////+//7+/v7//////v/+/v7//v/////+//////7+/v7//v////7+/////v/////////+/////////////v/////+///////+//////7//////v///v/+/////v///v/////+//////7///7+/v7+///+///+/v///v/////+//////7//////v/////+/v///////////////v7+/v7+//7//v7//v/+//////////////7+/v7//v////7+/////v////////7+/v/+/////v7////+//7+/v///v7////+//7///7+/////v/////+/////v7+/v7+/////v7+/v7+//////7//////v/////////////+//7+/v/+//////7////////////+/v7+/v7+//////7+/v7+/v7////+/////v7+/////v/////+//////7////////////////+/////v7////+//7+/v7//////////////v////7//v/+/////v////////////////7//v/+/v/+//7//v/+///////////////+/v/+/v///v///v7//v7///////7////+//7//v////7///7+///////////+/v7+/v///v7///7+///+/v7+/v///v7////+/////v7//////v/////+/v////7//////v/////+//////7//////v////7+//////7//////v7////+/////v7///////////7+//7+///+////////////////////////////////////////////////");

export {colors};
export default ezbitmap;
