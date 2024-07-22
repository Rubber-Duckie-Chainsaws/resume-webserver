import * as R from 'ramda'

export function debounce(fn, delay) {
  let timeout = null
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn()
    }, delay || 500);
  }
}

//https://stackoverflow.com/a/64090995/1365910
export function hsl2rgb(h,s,l) {
   let a=s*Math.min(l,1-l);
   let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
   return [f(0),f(8),f(4)];
}

//https://stackoverflow.com/a/54071699/1365910
export function rgb2hsl(r,g,b) {
  let v=Math.max(r,g,b), c=v-Math.min(r,g,b), f=(1-Math.abs(v+v-c-1));
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c));
  return [60*(h<0?h+6:h), f ? c/f : 0, Math.round((((v+v-c)/2)/255)*10)/10];
}

export function hex2rgb(hex) {
  return R.map(x => parseInt(x, 16), R.splitEvery(2, hex))
}

export function rgb2hex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
}

export function hsl2hex(hsl) {
  return rgb2hex(...R.map(R.multiply(255), hsl2rgb(hsl[0], hsl[1], hsl[2])))
}
