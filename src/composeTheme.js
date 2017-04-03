/* eslint-disable no-param-reassign */

const combineFunctions = (fn1, fn2) => () => {
  const res1 = fn1()
  const res2 = fn2()
  return typeof res1 === 'string' && typeof res2 === 'string'
    ? `${res1}${res2}`
    : undefined
}

const mergeThemes = (target, mixin) => {
  Object.keys(mixin).forEach(key => {
    switch (typeof target[key]) {
      case 'undefined':
        if (mixin[key] !== null) {
          target[key] = mixin[key]
        }
        break
      case 'string':
        if (typeof mixin[key] === 'string') {
          target[key] = [target[key], mixin[key]].filter(x => x).join(' ')
        }
        break
      case 'object':
        if (typeof mixin[key] === 'object') {
          mergeThemes(target[key], mixin[key])
        }
        break
      case 'function':
        if (typeof mixin[key] === 'function') {
          target[key] = combineFunctions(target[key], mixin[key])
        }
        break
      default:
        // no default
    }
  })
  return target
}

export default function composeTheme(...themes) {
  return themes.reduce((target, theme = {}) => mergeThemes(target, theme), {})
}
