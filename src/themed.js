import { createElement, Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import composeTheme from './composeTheme'
import { CONTEXT_KEY } from './const'

const mergeProps = (
  ownProps,
  themeProps,
) => ({
  ...ownProps,
  ...themeProps,
})

const defaultOptions = {
  mergeProps,
  pure: false,
  compose: true,
  propName: 'theme',
}

const getTheme = (selector, context) => {
  const type = selector
    ? Array.isArray(selector) ? 'array' : typeof selector
    : 'undefined'

  switch (type) {
    case 'function':
      return selector(context)
    case 'string':
      return context[selector]
    case 'object':
      return selector
    case 'undefined':
      return context
    default:
      throw new Error(`themed() received unexpected argument of type "${type}".`)
  }
}

const themed = (selector, options) => component => {
  const config = {
    ...defaultOptions,
    ...options,
  }

  const BaseComponent = config.pure
    ? PureComponent
    : Component

  return class Themed extends BaseComponent {
    static WrappedComponent = component

    static displayName = `Themed(${component.displayName || component.name})`

    static contextTypes = {
      [CONTEXT_KEY]: PropTypes.object,
    }

    static propTypes = {
      [config.propName]: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
      ]),
    }

    constructor(props, context) {
      super(props, context)
      this.buildTheme(props, context)
    }

    componentWillUpdate(props, state, context) {
      if (this.propsChanged(props) || this.contextChanged(context)) {
        this.buildTheme(props, context)
      }
    }

    propsChanged(props) {
      return this.props[config.propName] !== props[config.propName]
    }

    contextChanged(context) {
      return this.context[CONTEXT_KEY] !== context[CONTEXT_KEY]
    }

    buildTheme(props, context) {
      const base = context[CONTEXT_KEY] || {}
      const prop = props[config.propName]

      this.theme = getTheme(selector, base)

      if (typeof prop === 'function') {
        this.theme = prop(this.theme, base)
      } else if (prop) {
        this.theme = config.compose ? composeTheme(this.theme, prop) : prop
      }
    }

    render() {
      return createElement(component, config.mergeProps(this.props, {
        [config.propName]: this.theme,
      }))
    }
  }
}

themed.setDefaults = options => {
  Object.assign(defaultOptions, options)
}

export default themed
