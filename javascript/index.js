import {xbr2x,xbr4x} from 'xbr-js';

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
               rgb:   [0,0,0]}];

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
function generateImageData(width,height,bmp){
  const resultBmp=new Uint8ClampedArray(width*height*4);
  for(let i=0;i<width*height;i++){
    const col=bmp[i];
    let r,g,b;
    if(col===255)
      [r,g,b]=[255,255,255];
    else if(col===254)
      [r,g,b]=[0,0,0];
    else 
      [r,g,b]=allColors[col%48];
    resultBmp[i*4+0]=r;
    resultBmp[i*4+1]=g;
    resultBmp[i*4+2]=b;
    resultBmp[i*4+3]=255;
  }
  return new ImageData(resultBmp,width);
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

function shiftBmpx(width,height,bmpReference,bmp,offset){
  const [offx,offy]=offset;
  const [startx,terminatex,incrementx]=(()=>{
    if(offx==1)
      return [width-2,(k)=>k>=0,-1]
    else
      return [(offx==-1)?1:0,(k)=>k<width,1]
    })();
  const [starty,terminatey,incrementy]=(()=>{
    if(offy==1)
      return [height-2,(k)=>k>=0,-1]
    else
      return [(offy==-1)?1:0,(k)=>k<height,1]
  })();
  for(let y=starty;terminatey(y);y+=incrementy){
    //console.log("y"+y);
    for(let x=startx;terminatex(x);x+=incrementx){
      //console.log("x"+x);
      if(bmpReference[y*width+x]===254)
        bmp[(y+offy)*width+x+offx]=254;
    }
  }
}

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

function db(s,val){
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

function mergeRegions(regions,regionsSrc){
  for(const regionSrc of regionsSrc){
    let num=regions.length;
    for(let i=0;i<num;i++){
      const region=regions[i];
      for(const pos of regionSrc)
        if(region.has(pos))
          regionSrc.delete(pos);
    }
    if(regionSrc.size>0)
      regions.push(regionSrc);
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
  if(burn){
    regions.forEach((region)=>region.forEach((pos)=>bmp[pos]=254));
  }
  const bmpTemp=new Uint8Array(bmp);
  brush.forEach(partial(shiftBmp,width,height,bmp,bmpTemp));
  const regionsNew=findRegions(false,width,height,bmpTemp);
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
  acc.regions=mergeRegions(regions,regionsFat);
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
    const center=Math.floor(average(ys))*width+Math.floor(average(xs));
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

function clusterColors(largeRegionCutoff,summary){
  const big=[];
  const small=[];
  const vals=Array.from(summary.values());
  vals.forEach((item)=>{
    if(item.num>=largeRegionCutoff)
      big.push(item);
    else
      small.push(item);
  });
  const connectedBig={};
  big.forEach((item)=>connectedBig[item.id]=item.id);
  while(true){
    const newConnected={};
    small.forEach((item)=>{
      if(!connectedBig[item.id]){
        var big=null;
        item.neighbors.forEach((id)=>{
          if(connectedBig[id]){
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
  const remainingColors=[0,1,2,3];
  let colorIndex=(big.length+3)%remainingColors.length;
  const colors={};
  big.forEach((item)=>{
    colors[item.id]=remainingColors[colorIndex];
    colorIndex=(colorIndex+1)%remainingColors.length;
  });
  small.forEach((item)=>{
    const bigid=connectedBig[item.id];
    if(bigid){
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
  for(let pos=width+1;pos<(width-1)*height-1;pos++){
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
      if(num>=amnt)
        bmp[pos]=col;
    }
  }
}

function ezbitmap(art){
  art=normalizeArt(art);
  if(art.length===0){
    return null;
  }
  const {bmp,width,height}=digitizeArt(art);
  const passes=[[0,false],[1,false],[2,false],[3,false],[4,false],[5,false],[0,true],[1,false],[2,false],[3,false],[4,false],[0,true]];
  const bmpOriginal=new Uint8Array(bmp);
  const {regions,bmpTemp}=passes.reduce(fillPass,{width:width,
                                                   height:height,
                                                   bmp:bmp,
                                                   regions:[]});
  const summary=regionSummaries(width,regions);
  const largeRegionCutoff=bestLargeRegionCutoff(width,height,summary);
  const colors=clusterColors(largeRegionCutoff,summary);
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
  fillHighNeighborPixels(width,height,4,bmpReference,bmpOriginal);

  const imageData=generateImageData(width,height,bmpOriginal);
  const originalPixelView = new Uint32Array(imageData.data.buffer);
  const scaledPixelView = xbr4x(originalPixelView, width,height);
  const resultBmp=new Uint8ClampedArray(scaledPixelView.buffer);
  return new ImageData(resultBmp,width*4);
}

const font=base64ToArray("/////////////////////////////////////////////////////////////////////v/+///+//7///////////////////////7//v/+/v7+/v/+//7//v7+/v7//v/+/////////////////////////////////////////////////////////////////////////////////////////////////////////v/////+//////////////////////////7+///+//////7//////v///////v7///7+///////+//////7//////v///v7//////v///v/+//7//v7+//7//v/+///+//////7//////v///v7+/v7///7//////v/////////////////////////+/////v/////////////////+/v7+/v////////////////////////////////////7+/////v7///////7////+/////v////7////+///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/////v7///7//v/+/v7+/v////7//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7///////////7+//////////////////7+///////////+/v///v7///////7+///+///+/v///////v///////v7///////7+/v7+///////+/v7+/v///////v7///////7///////7+///+///+/v///////////////////////////////////////v7+//7+/v7+/v7///7+/v///v/+/v7///7+/v/+/////v7+/v7+/v////7+/////v///////////////////////////////////v7+/v7//////v/////+///////+/v7+//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7////+/v////7+/v7+/v7////+/v////7///////////////////////////////////////////////////////////////////7////+/v///v/+/v7///7///7//v////7+//////7//////v/////+//////7+/v7+//7//v/+//7//v7//v/+/v/+//7+//7//v///////////////////////////////////v7+//7////+/v////7+/////v/+/v7//v7+/v/+/////v7+/v7//v/////+///////+/v7//v////7+/////v7///7+//7+/v7+/v7+//7////+/v7+/v/+///+//7////+//7+/v7+/v/////+/v7//////v7+/v7+//7+/v7+///+//////7//////v/////+//////////////////////////////////////////////////////////////////////7////+/v/+//7+//7//v7//v/+//7+/v///////////////////////////////////v////7//v/+/////v/////+//////7///////////////////////////////////////7+/v///v/////+//////7//////v7+/v///////v///////v///////v///////v7+/v/////+//////7//////v///v7+//////7////+//7//v////7////////////////////////////////////////+/v7+/v/+///////+//////////////////////////////////////7+/v/+/////v/+/v7+/////////////////////////////////////////////////v7+/v7///////7+/v7//////v/////+//7+/v7+/////v/+/v7+/////////v7+//7+/v7+/v///////v7+/////////////////////////////////////////////////////////////////////v/////+//////7+/v7//v////7+/////v/////////+/////////////v/////+/////////////////////////////////////v/////+//////7///7+/v7+///+///+/v///////////////////////////////////////////////v7+/v7+//7//v7//v/+//////////////7+/v7//v////7+/////v////////7+/v/+/////v7////+//7+/v/////////////////////////////////////////////////////////////////////////////////+//7+/v/+//////7////////////////////////////////////////+/////v7+/////v/////+//////7////////////////+/////v7////+//7+/v7////////////////////////////////////////////////////////////////////////////////+/v/+/v///v///v7//v7///////7////+//7//v////7///7+/////////////////////////////////////////v7////+/////v7//////v/////+/v////7//////v/////+//////7//////v////7+//////7//////v7////+/////v7///////////7+//7+///+////////////////////////////////////////////////");

export default ezbitmap;
