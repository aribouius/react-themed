/* eslint-disable no-param-reassign */
const merge = (t1, t2) => (
  Object.keys(t2).reduce((acc, key) => {
    if (!acc[key]) {
      acc[key] = t2[key]
    } else if (typeof t2[key] === 'object') {
      acc[key] = merge(acc[key], t2[key])
    } else {
      acc[key] = `${acc[key]} ${t2[key]}`
    }
    return acc
  }, t1)
)

export default function composeTheme(...themes) {
  return themes.reduce((target, theme) => merge(target, theme), {})
}
