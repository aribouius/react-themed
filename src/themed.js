import PropTypes from 'prop-types'
import ThemedComponent from './ThemedComponent'

const mergeProps = (
  ownProps,
  themeProps,
) => ({
  ...themeProps,
  ...ownProps,
})

const defaultOptions = {
  mergeProps,
  compose: false,
  propName: 'theme',
}

const themeSelector = selector => {
  const type = selector
    ? Array.isArray(selector) ? 'array' : typeof selector
    : 'undefined'

  switch (type) {
    case 'function':
      return selector
    case 'string':
      return ctx => ctx[selector]
    case 'object':
      return () => selector
    default:
      return ctx => ctx
  }
}

const themed = (selector, options) => component => {
  const config = {
    ...defaultOptions,
    ...options,
    selectTheme: themeSelector(selector),
    component,
  }

  Object.assign(config, {
    configKey: `${config.propName}Config`,
  })

  return class Themed extends ThemedComponent {
    static displayName = `Themed(${component.displayName || component.name})`

    static themeConfig = config

    static propTypes = {
      [config.propName]: PropTypes.object,
      [config.configKey]: PropTypes.object,
    }

    static defaultProps = {
      [config.configKey]: {},
    }
  }
}

themed.setDefaults = options => {
  Object.assign(defaultOptions, options)
}

export default themed
