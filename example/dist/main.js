(()=>{"use strict";const t=255,n=65280,v=16711680,r=4278190080;function e(r){const e=r&t,o=(r&n)>>8,s=(r&v)>>16;return[.299*e+.587*o+.114*s,-.168736*e+-.331264*o+.5*s,.5*e+-.418688*o+-.081312*s]}function o(t,n,v){const o=(t&r)>>24&255,s=(n&r)>>24&255;if(0===o&&0===s)return 0;if(!v&&(o<255||s<255))return 1e6;if(0===o||0===s)return 1e6;const h=e(t),c=e(n);return 48*Math.abs(h[0]-c[0])+7*Math.abs(h[1]-c[1])+6*Math.abs(h[2]-c[2])}function s(t,n,v){const o=(t&r)>>24&255,s=(n&r)>>24&255;if(0===o&&0===s)return!0;if(!v&&(o<255||s<255))return!1;if(0===o||0===s)return!1;const h=e(t),c=e(n);return!(Math.abs(h[0]-c[0])>48||Math.abs(h[1]-c[1])>7||Math.abs(h[2]-c[2])>6)}function h(e,o,s,h){const c=(e&r)>>24&255,a=(o&r)>>24&255;let f,l,i,u;return 0===c?(f=o&t,l=(o&n)>>8,i=(o&v)>>16):0===a?(f=e&t,l=(e&n)>>8,i=(e&v)>>16):(f=(h*(o&t)+s*(e&t))/(s+h),l=(h*((o&n)>>8)+s*((e&n)>>8))/(s+h),i=(h*((o&v)>>16)+s*((e&v)>>16))/(s+h)),u=(h*a+s*c)/(s+h),~~f|~~l<<8|~~i<<16|~~u<<24}function c(t,n,v,r,e,o,s,h,c,a,f){const l=function(t,n,v,r,e){let o=n-1;o<0&&(o=0);let s=n-2;s<0&&(s=0);let h=n+1;h>=r&&(h=r-1);let c=n+2;c>=r&&(c=r-1);let a=v-1;a<0&&(a=0);let f=v-2;f<0&&(f=0);let l=v+1;l>=e&&(l=e-1);let i=v+2;return i>=e&&(i=e-1),[t[o+f*r],t[n+f*r],t[h+f*r],t[s+a*r],t[o+a*r],t[n+a*r],t[h+a*r],t[c+a*r],t[s+v*r],t[o+v*r],t[n+v*r],t[h+v*r],t[c+v*r],t[s+l*r],t[o+l*r],t[n+l*r],t[h+l*r],t[c+l*r],t[o+i*r],t[n+i*r],t[h+i*r]]}(t,n,v,r,e),[u,g,p,d,b,m,y,E,w,A,M,x,k,U,O,C,T,_,I,S,z]=l;let P,j,N,D,F,G,R,X,B,q,H,J,K,L,Q,V;P=j=N=D=F=G=R=X=B=q=H=J=K=L=Q=V=M,[V,Q,J,D,X,H,L,K]=i(M,T,C,x,O,y,A,m,k,_,S,z,V,Q,J,D,X,H,L,K,a,f),[D,X,N,P,j,R,J,V]=i(M,y,x,m,T,b,C,A,g,p,k,E,D,X,N,P,j,R,J,V,a,f),[P,j,F,K,B,G,N,D]=i(M,b,m,A,y,O,x,C,w,d,g,u,P,j,F,K,B,G,N,D,a,f),[K,B,L,V,Q,q,F,P]=i(M,O,A,C,b,T,m,x,S,I,w,U,K,B,L,V,Q,q,F,P,a,f),o[s+h*c]=P,o[s+1+h*c]=j,o[s+2+h*c]=N,o[s+3+h*c]=D,o[s+(h+1)*c]=F,o[s+1+(h+1)*c]=G,o[s+2+(h+1)*c]=R,o[s+3+(h+1)*c]=X,o[s+(h+2)*c]=B,o[s+1+(h+2)*c]=q,o[s+2+(h+2)*c]=H,o[s+3+(h+2)*c]=J,o[s+(h+3)*c]=K,o[s+1+(h+3)*c]=L,o[s+2+(h+3)*c]=Q,o[s+3+(h+3)*c]=V}function a(t,n,v){return v?h(t,n,3,1):t}function f(t,n,v){return v?h(t,n,1,1):t}function l(t,n,v){return v?h(t,n,1,3):n}function i(t,n,v,r,e,h,c,i,u,g,p,d,b,m,y,E,w,A,M,x,k,U){if(t==v||t==r)return[b,m,y,E,w,A,M,x];const O=o(t,h,U)+o(t,e,U)+o(n,p,U)+o(n,u,U)+(o(v,r,U)<<2),C=o(v,c,U)+o(v,d,U)+o(r,g,U)+o(r,i,U)+(o(t,n,U)<<2),T=o(t,r,U)<=o(t,v,U)?r:v;if(O<C&&(!s(r,i,U)&&!s(v,c,U)||s(t,n,U)&&!s(r,g,U)&&!s(v,d,U)||s(t,e,U)||s(t,h,U))){const n=o(r,e,U),s=o(v,h,U),u=t!=h&&i!=h,g=t!=e&&c!=e;n<<1<=s&&g||n>=s<<1&&u?(n<<1<=s&&g&&([b,m,y,M,x,A]=function(t,n,v,r,e,o,s,h){return[s,s,l(v,s,h),l(r,s,h),a(e,s,h),a(o,s,h)]}(0,0,y,M,x,A,T,k)),n>=s<<1&&u&&([b,m,y,E,w,A]=function(t,n,v,r,e,o,s,h){return[s,l(n,s,h),s,a(r,s,h),l(e,s,h),a(o,s,h)]}(0,m,0,E,w,A,T,k))):[b,m,y]=function(t,n,v,r,e){return[r,f(n,r,e),f(v,r,e)]}(0,m,y,T,k)}else O<=C&&(b=f(b,T,k));return[b,m,y,E,w,A,M,x]}function u(t){for(let n=0;n<t.length;n++)if(" "!==t.charAt(n))return!1;return!0}const g=[{name:"blue",short:"blu",rgb:[42,75,215]},{name:"green",short:"grn",rgb:[29,105,20]},{name:"red",short:"red",rgb:[173,35,35]},{name:"purple",short:"prp",rgb:[129,38,192]},{name:"yellow",short:"yel",rgb:[255,238,51]},{name:"orange",short:"org",rgb:[255,146,51]},{name:"gray",short:"gry",rgb:[100,100,100]},{name:"pink",short:"pnk",rgb:[255,180,180]},{name:"tan",short:"tan",rgb:[243,202,167]},{name:"brown",short:"brn",rgb:[129,74,25]},{name:"silver",short:"slv",rgb:[160,160,160]},{name:"lime",short:"lim",rgb:[129,197,122]},{name:"teal",short:"tel",rgb:[157,175,255]},{name:"sky",short:"sky",rgb:[41,208,208]},{name:"white",short:"wht",rgb:[255,255,255]},{name:"black",short:"blk",rgb:[39,39,39]}],p=[];g.forEach((({rgb:t})=>{p.push(t)})),g.forEach((({rgb:t})=>{t[0]+t[1]+t[2]>550?p.push(t.map((t=>Math.floor(128+t/2)))):p.push(t.map((t=>Math.min(255,t+60))))})),g.forEach((({rgb:t})=>{p.push(t.map((t=>Math.floor(.7*t))))}));const d=[];function b(t,n,v,r,e){const[o,s]=e;for(let e=Math.max(0,-s);e<Math.min(n,n-s);e++)for(let n=Math.max(0,-o);n<Math.min(t,t-o);n++){const h=v[e*t+n];254===h&&(r[(e+s)*t+n+o]=h)}}function m(t,n){for(let v of n)t.add(v)}function y(t,n){const v=[],r=[];for(;n.size>0;){const e=new Set,[o]=n;for(r.push(o);r.length>0;){const v=r.pop();n.has(v)&&(e.add(v),n.delete(v),r.push(v+1),r.push(v-1),r.push(v+t),r.push(v-t))}v.push(e)}return v}function E(t,n){let{width:v,height:r,bmp:e,regions:o}=t;const[s,h]=n,c=M[s];h&&o.forEach((t=>t.forEach((t=>e[t]=254))));const a=new Uint8Array(e);c.forEach(function(t,...n){return(...v)=>t(...n,...v)}(b,v,r,e,a));const f=function(t,n,v,r){let e=[],o=Array(n);for(let t=0;t<v;t++)for(let v=0;v<n;v++){const s=o[v],h=v>0?o[v-1]:null,c=255===r[t*n+v],a=t*n+v;if(c)if(s&&h)if(s===h)s.add(a);else{m(h,s),h.add(a);for(let t=0;t<n;t++)o[t]===s&&(o[t]=h)}else if(s)s.add(a);else if(h)h.add(a),o[v]=h;else{const t=new Set;t.add(a),o[v]=t}else if(s){let t=!1;for(let r=0;r<n;r++)o[r]===s&&r!==v&&(t=!0);t||e.push(s),o[v]=null}}return e=e.filter((t=>{for(let v of t){let t=v%n;if(0===t||t===n-1||v<n)return!1}return!0})),e}(0,v,r,a),l=[];return f.forEach((t=>{const n=new Set;for(const r of t){n.add(r);for(const t of c){const[e,o]=t;n.add(r-(o*v+e))}}l.push(n)})),t.regions=function(t,n,v){for(const r of v){const v=r.size;let e=n.length;for(let t=0;t<e;t++){const v=n[t];for(const t of r)v.has(t)&&r.delete(t)}if(r.size>0)if(v!=r.size){const v=y(t,r);n=n.concat(v)}else n.push(r)}return n}(v,o,l),t.bmpTemp=a,t}function w(t){return t.reduce(((t,n)=>t+n),0)/t.length}g.forEach((({name:t,short:n},v)=>{d[t]=v,d[n]=v}));const A=[2.1445760763310275,-.02566328196508394,.008719882234830244,-.0028791308610713667,.3445271459218784],M=[["\n",0],["\n##\n#",1],["\n #\n# #\n #",1],["\n###\n# #\n###",1],["\n ## \n# ##\n####\n ##",1],["\n ###\n#####\n## ##\n#####\n ###",2]].map((([t,n],v)=>{t=t.split("\n");const r=[];for(let v=0;v<5;v++)for(let e=0;e<5;e++)v+1<t.length&&"#"==t[v+1].charAt(e)&&r.push([e-n,v-n]);return r}));function x(t,n,v,r,e){for(let o=t+1;o<t*(n-1)-1;o++)if(255===e[o]){let n=0,s=6;if([o-1,o+1,o-t,o-t-1,o-t+1,o+t,o+t-1,o+t+1].forEach((t=>{const v=r[t];255!=v&&(n++,254!=v&&(s=v))})),n>=v){let n=!1;[o-1,o+1,o-t,o+t].forEach((t=>{const v=r[t];v<254&&(s=v,n=!0)})),n&&(e[o]=s)}}}function k(t){for(var n=[],v=0;v<t.length;v++)for(var r=!0;r;){r=!1;for(const[e,o]of Object.entries(d)){const s=t[v].indexOf(e);-1!=s&&(t[v]=t[v].substring(0,s)+" ".repeat(e.length)+t[v].substring(s+e.length),n.push({x:5*(s+.5+e.length/2),y:5*(v+.5),col:o}),r=!0)}}return n}function U(t){for(var n=[],v=0;v<t[0].length;v++)n.push([]);return t.forEach(((t,v)=>{for(var r=0;r<t.length;r++)n[r].push(t.charAt(r))})),n.map((t=>t.join("")))}const O=(C=atob("/////////////////////////////////////v/////+//////7////////////+/////v/+///+//7///////////////////////7//v/+/v7+/v/+//7//v7+/v7//v/+///+/v7+/v/+//7//v7+/////v/+/v7+/v/+/v///v7+//7////+/////v/+/v7///7+//7+///+///+///+/v/+/v///v///v7//v///v/////+///////////////////////////+/v///v/////+//////7///////7+/v7///////7//////v/////+///+/v///////v///v/+//7//v7+//7//v/+///+//////7//////v///v7+/v7///7//////v/////////////////////////+/////v/////////////////+/v7+/v////////////////////////////////////7+/////v7///////7////+/////v////7////+///////+/v7//v////7+//7//v7////+//7+/v////7////+/v/////+//////7///7+/v7+//7+/v/+/////v///v7///7////+/v7+/v/+/v7//v////7///7+//7////+//7+/v/////+/////v7///7//v/+/v7+/v////7//v7+/v7+//////7+/v7///////7+/v7+///+/v7+/v/////+/v7+//7////+//7+/v/+/v7+/v/////+//////7//////v/////+//7+/v/+/////v/+/v7//v////7//v7+///+/v7//v////7//v7+/v/////+//////7//////////v7///////////7+//////////////////7+///////////+/v///v7///////7+///+///+/v///////v///////v7///////7+/v7+///////+/v7+/v///////v7///////7///////7+///+///+/v/////+/v7//v////7////+/////v/////+/////v7+//7+/v7+/v7///7+/v///v/+/v7///7+/v/+/////v7+/v7+/v////7+/////v7+/v7//v////7+/v7+//7////+/v7+/v///v7+/v7//////v/////+///////+/v7+/v7+/v/+/////v7////+/v////7+/v7+//7+/v7+/v/////+/v7///7//////v7+/v7+/v7+/v7//////v7+/v7+//////7///////7+/v7+//////7///7+/v////7//v7+//7////+/v////7+/v7+/v7////+/v////7+/v7+/v///v/////+//////7///7+/v7+//////7//////v/////+/v////7//v7+//7////+/v///v/+/v7///7///7//v////7+//////7//////v/////+//////7+/v7+//7//v/+//7//v7//v/+/v/+//7+//7//v7////+/v7///7+//7//v7///7+/v////7//v7+//7////+/v////7+/////v/+/v7//v7+/v/+/////v7+/v7//v/////+///////+/v7//v////7+/////v7///7+//7+/v7+/v7+//7////+/v7+/v/+///+//7////+//7+/v7+/v/////+/v7//////v7+/v7+//7+/v7+///+//////7//////v/////+///+/////v7////+/v////7+/////v/+/v7//v////7+/////v/+//7///7//v////7///7////+/v/+//7+//7//v7//v/+//7+/v/+/////v/+//7////+/////v/+//7////+/v////7//v/+/////v/////+//////7///7+/v7+/////v////7////+/////v7+/v7///7+/v///v/////+//////7//////v7+/v///////v///////v///////v///////v7+/v/////+//////7//////v///v7+//////7////+//7//v////7////////////////////////////////////////+/v7+/v/+///////+///////////////////////////////+/v7///7+/v7+/////v/+/v7+/v/////+//////7+/v7//v////7+/v7+/////////////////v7+/v7///////7+/v7//////v/////+//7+/v7+/////v/+/v7+/////////v7+//7+/v7+/v///////v7+/////v////7+/////v/////+/v////7//////v7+//7////+//7+/v7//////v/+/v7//v/////+//////7+/v7//v////7+/////v/////////+/////////////v/////+///////+//////7//////v///v/+/////v///v/////+//////7///7+/v7+///+///+/v///v/////+//////7//////v/////+/v///////////////v7+/v7+//7//v7//v/+//////////////7+/v7//v////7+/////v////////7+/v/+/////v7////+//7+/v///v7////+//7///7+/////v/////+/////v7+/v7+/////v7+/v7+//////7//////v/////////////+//7+/v/+//////7////////////+/v7+/v7+//////7+/v7+/v7////+/////v7+/////v/////+//////7////////////////+/////v7////+//7+/v7//////////////v////7//v/+/////v////////////////7//v/+/v/+//7//v/+///////////////+/v/+/v///v///v7//v7///////7////+//7//v////7///7+///////////+/v7+/v///v7///7+///+/v7+/v///v7////+/////v7//////v/////+/v////7//////v/////+//////7//////v////7+//////7//////v7////+/////v7///////////7+//7+///+////////////////////////////////////////////////"),T=new Uint8Array(C.length),Array.prototype.forEach.call(C,(function(t,n){T[n]=t.charCodeAt(0)})),T);var C,T;const _=function(t,n){if(0===(t=function(t){for(t=t.split("\n");t.length>0&&u(t[0]);)t.splice(0,1);for(;t.langth>0&&u(t[t.length-1]);)t.pop();var n=0,v=Number.MAX_SAFE_INTEGER;return t.forEach((t=>{let r=0,e=0;for(;e<t.length&&" "===t.charAt(e);e++)r++;e===t.length&&(r=Number.MAX_SAFE_INTEGER),v=Math.min(v,r);let o=t.length;for(;o>0&&" "===t.charAt(o-1);)o--;n=Math.max(n,o)})),t.map((t=>t.substring(v,n).padEnd(n-v," ")))}(t)).length)return null;const v=function(t){const n=k(t),v=U(t),r=k(v);if(U(v).forEach(((n,v)=>{t[v]=n})),r.forEach((t=>{n.push({x:t.y,y:t.x,col:t.col})})),t.length>0&&t[0].length>0){for(;;){var e=!1;if(t.every((t=>" "===t.charAt(0)))&&(t.forEach(((n,v)=>t[v]=n.slice(1))),n.forEach((t=>t.x-=5)),e=!0),!e)break}for(;e=!1,0===t[0].trim().length&&(t.splice(0,1),n.forEach((t=>t.y-=5)),e=!0),e;);for(;e=!1,t.every((t=>" "===t.charAt(t.length-1)))&&(t.forEach(((n,v)=>t[v]=n.slice(0,n.length-1))),e=!0),e;);for(;e=!1,0===t[t.length-1].trim().length&&(t.pop(),e=!0),e;);}return n}(t),{bmp:r,width:e,height:o}=function(t){const n=t[0].length,v=t.length,r=5*n,e=5*v,o=new Uint8Array(r*e);for(let e=0;e<v;e++)for(let v=0;v<n;v++){const n=t[e].charCodeAt(v)-32;for(let t=0;t<5;t++)for(let s=0;s<5;s++)o[(5*e+t)*r+(5*v+s)]=O[25*n+5*t+s]}return{bmp:o,width:r,height:e}}(t),s=new Uint8Array(r),{regions:h,bmpTemp:a}=[[0,!1],[1,!1],[2,!1],[3,!1],[4,!1],[5,!1],[0,!0],[1,!1],[2,!1],[3,!1],[4,!1],[0,!0]].reduce(E,{width:e,height:o,bmp:r,regions:[]}),f=function(t,n){const v=[];for(let r=0;r<n.length;r++){const e=n[r],o=[],s=[];for(const n of e)o.push(n%t),s.push(Math.floor(n/t));const h=w(s),c=w(o),a=Math.floor(h)*t+Math.floor(c),f=[];for(const n of e)[n-1,n+1,n-t,n+t].forEach((t=>{e.has(t)||f.push(t)}));const l=[];for(let t=0;t<n.length;t++)if(t!=r){const v=n[t];for(const n of f)if(v.has(n)){l.push(t);break}}v.push({id:r,x:c,y:h,center:a,num:e.size,neighbors:l})}return v}(e,h),l=function(t,n,v){const r=t+n,e=t*n,o=v.reduce(((t,n)=>n.num+t),0),s=v.length;return function([t,...n],...v){if(n.length!==v.length)throw"wrong length";let r=t;for(let t=0;t<n.length;t++)r+=n[t]*v[t];return r}(A,r,e,o,s)}(e,o,f),i=function(t,n,v,r){const e=[],o=[];Array.from(v.values()).forEach((t=>{t.num>=n?e.push(t):o.push(t)}));const s={};for(e.forEach((t=>s[t.id]=t.id));;){const t={};if(o.forEach((n=>{s.hasOwnProperty(n.id)||n.neighbors.forEach((v=>{s.hasOwnProperty(v)&&(t[n.id]=s[v])}))})),0===Object.keys(t).length)break;for(const[n,v]of Object.entries(t))s[n]=v}const h={};for(;;){var c=1e5,a=-1,f=null;if(e.forEach((t=>{h.hasOwnProperty(t.id)||r.forEach(((n,r)=>{const e=(s=n,((o=v[t.id]).x-s.x)*(o.x-s.x)+(o.y-s.y)*(o.y-s.y));var o,s;e<c&&(c=e,a=t.id,f=r)}))})),-1===a)break;h[a]=r[f].col,r.splice(f,1)}const l=[0,1,2,3];let i=(e.length+3)%l.length;return e.forEach((t=>{h.hasOwnProperty(t.id)||(h[t.id]=l[i],i=(i+1)%l.length)})),o.forEach((t=>{const n=s[t.id];s.hasOwnProperty(t.id)?t.center<v[n].center?h[t.id]=h[n]+16:h[t.id]=h[n]+32:t.num>=2&&t.num<10&&0===t.neighbors.length?h[t.id]=10:h[t.id]=6})),h}(0,l,f,v);for(let t=0;t<h.length;t++){const n=h[t],v=i[t];null!==v&&n.forEach((t=>{255===s[t]&&(s[t]=v)}))}x(e,o,4,new Uint8Array(s),s),x(e,o,4,new Uint8Array(s),s);const g=function(t,n,v){const r=new Uint8ClampedArray((t+2)*(n+2)*4);for(let e=0;e<t*n;e++){const n=v[e];let o,s,h,c;c=255,255===n?([o,s,h]=[255,255,255],c=0):[o,s,h]=254===n?[0,0,0]:p[n%48];const a=4*(Math.floor(e/t)*(t+2)+e%t+1);r[a+0]=o,r[a+1]=s,r[a+2]=h,r[a+3]=c}return new ImageData(r,t+2)}(e,o,s),d=function(t,n,v,r){const{blendColors:e,scaleAlpha:o}=function(t){let n=!0,v=!1;return t&&(!1===t.blendColors&&(n=!1),!0===t.scaleAlpha&&(v=!0)),{blendColors:n,scaleAlpha:v}}(void 0),s=new Uint32Array(n*v*16);for(let r=0;r<n;r++)for(let h=0;h<v;h++)c(t,r,h,n,v,s,4*r,4*h,4*n,e,o);return s}(new Uint32Array(g.data.buffer),e+2,o+2),b=new Uint8ClampedArray(d.buffer);return new ImageData(b,4*(e+2))}(String.raw`
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
`);document.getElementById("canvas").getContext("2d").putImageData(_,0,0)})();