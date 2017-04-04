import { createElement, PropTypes } from 'react'
import themeContext from './themeContext'

const mergeProps = (ownProps, themeProps) => (
  { ...themeProps, ...ownProps }
)

const selectTheme = (selector, theme) => {
  switch (typeof selector) {
    case 'function':
      return selector(theme)
    case 'string':
      return theme[selector]
    default:
      return theme
  }
}

export default (selector, options) => target => {
  const config = {
    mergeProps,
    propName: 'theme',
    ...options,
  }

  const Themed = (props, { theme = {} }) => (
    createElement(target, config.mergeProps(props, {
      [config.propName]: selectTheme(selector, theme),
    }))
  )

  return Object.assign(themeContext(Themed), {
    displayName: `Themed(${target.displayName || target.name})`,
    propTypes: {
      [config.propName]: PropTypes.object,
    },
  })
}
