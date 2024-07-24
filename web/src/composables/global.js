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

export function hsl2rgb(h,s,l) {
  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs((h / 60) % 2 - 1))
  let m = l - c/2
  let r = 0,
      g = 0,
      b = 0

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return [r, g, b]
}

export function rgb2hsl(r,g,b) {
  r /= 255
  g /= 255
  b /= 255
  let vMax=Math.max(r,g,b) //v
  let vMin=Math.min(r,g,b)
  let chroma=vMax-vMin //c
  let lightness=(vMax + vMin)/2
  let f=(1-Math.abs(2*lightness-1)) //f
  let hue= chroma && ((vMax==r) ? (g-b)/chroma % 6 : ((vMax==g) ? 2+(b-r)/chroma : 4+(r-g)/chroma));

  return [60*(hue<0?hue+6:hue), chroma ? chroma/f : 0, lightness];
}

export function hex2rgb(hex) {
  return R.map(x => parseInt(x, 16), R.splitEvery(2, hex))
}

export function rgb2hex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
}

export function hsl2hex(hsl) {
  const rgb1 = hsl2rgb(...hsl)
  const hsl1 = rgb2hsl(...rgb1)
  const hex1 = rgb2hex(...rgb1)
  const rgb2 = hex2rgb(hex1)
  const hsl2 = rgb2hsl(...rgb2)
  return rgb2hex(...hsl2rgb(...hsl))
}

export function hex2hsl(hex) {
  const rgb1 = hex2rgb(hex)
  const hex1 = rgb2hex(...rgb1)
  const hsl1 = rgb2hsl(...rgb1)
  const rgb2 = hsl2rgb(...hsl1)
  const hex2 = rgb2hex(...rgb2)
  return rgb2hsl(...hex2rgb(hex))
}

export function toRadians(degrees) {
  return (Math.PI/180)*degrees
}

export function radiansToXY(radians, radius) {
  return [radius * Math.cos(radians), radius * Math.sin(radians)]
}
