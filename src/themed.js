import { createElement } from 'react'
import themeContext from './themeContext'

const mergeProps = (ownProps, themeProps) => (
  { ...themeProps, ...ownProps }
)

export default (mapThemeToProps, merge = mergeProps) => target => {
  const Themed = (props, { theme = {} }) => (
    createElement(target, merge(props, (
      mapThemeToProps ? mapThemeToProps(theme) : { theme }
    )))
  )
  return Object.assign(themeContext(Themed), {
    displayName: `Themed(${target.displayName || target.name})`,
  })
}
