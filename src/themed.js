import { createElement, PropTypes } from 'react'
import themeContext from './themeContext'

const mergeProps = (
  ownProps,
  themeProps,
) => ({
  ...themeProps,
  ...ownProps,
})

const defaultOptions = {
  mergeProps,
  propName: 'theme',
}

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

const themed = (selector, options) => target => {
  const config = {
    ...defaultOptions,
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

themed.setDefaults = options => {
  Object.assign(defaultOptions, options)
}

export default themed
