const combineFunctions = (fn1, fn2) => () => {
  const res1 = fn1()
  const res2 = fn2()

  return typeof res1 === 'string' && typeof res2 === 'string'
    ? `${res1}${res2}`
    : undefined
}

const composeThemes = (target, mixin) => {
  if (!mixin) return target

  return Object.keys(mixin).reduce((acc, key) => {
    switch (typeof acc[key]) {
      case 'undefined':
        if (mixin[key] !== null) {
          acc[key] = mixin[key]
        }
        break
      case 'string':
        if (typeof mixin[key] === 'string') {
          acc[key] = [target[key], mixin[key]].filter(x => x).join(' ')
        }
        break
      case 'object':
        if (typeof mixin[key] === 'object') {
          composeThemes(acc[key], mixin[key])
        }
        break
      case 'function':
        if (typeof mixin[key] === 'function') {
          acc[key] = combineFunctions(acc[key], mixin[key])
        }
        break
      default:
        // no default
    }
    return acc
  }, target)
}

export default function compose(target = {}, ...themes) {
  // Minor optimization to skip reduce on already composed theme
  if (themes.length === 1) {
    return composeThemes(target, themes[0])
  }

  return themes.reduce((acc, theme) => composeThemes(acc, theme), target)
}
