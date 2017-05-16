import { createElement, Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import composeTheme from './composeTheme'
import { CONTEXT_KEY, CONFIG_KEY } from './const'

const mergeProps = (
  ownProps,
  themeProps,
) => ({
  ...ownProps,
  ...themeProps,
})

const defaults = {
  mergeProps,
  pure: false,
  compose: composeTheme,
  propName: 'theme',
}

const pluck = (theme, keys) => (
  keys.reduce((acc, key) => {
    acc[key] = theme[key]
    return acc
  }, {})
)

const getTheme = (theme, context) => {
  const type = Array.isArray(theme)
    ? 'array'
    : typeof theme
  switch (type) {
    case 'function':
      return theme(context)
    case 'string':
      return context[theme]
    case 'array':
      return pluck(context, theme)
    default:
      return theme
  }
}

const themed = (theme, options = {}) => target => {
  let themes = []
  let config = { ...defaults }
  let component = target

  if (target[CONFIG_KEY]) {
    config = { ...target[CONFIG_KEY] }
    themes = [...config.themes]
    component = target.WrappedComponent
  }

  if (theme) {
    themes.push(theme)
  }

  Object.assign(config, options, {
    themes,
  })

  const BaseComponent = config.pure
    ? PureComponent
    : Component

  class Themed extends BaseComponent {
    static [CONFIG_KEY] = config

    static WrappedComponent = component

    static displayName = `Themed(${component.displayName || component.name})`

    static contextTypes = {
      [CONTEXT_KEY]: PropTypes.object,
    }

    static propTypes = {
      childRef: PropTypes.func,
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

      this.theme = config.themes.length ? composeTheme(
        ...config.themes.map(value => getTheme(value, base)),
      ) : undefined

      if (typeof prop === 'function') {
        this.theme = prop(this.theme, base)
      } else if (prop) {
        this.theme = config.compose ? config.compose(this.theme, prop) : prop
      }
    }

    render() {
      const { childRef, ...props } = this.props
      return createElement(component, config.mergeProps(props, {
        [config.propName]: this.theme,
        ref: childRef,
      }))
    }
  }

  return hoistStatics(Themed, component)
}

themed.setDefaults = options => {
  Object.assign(defaults, options)
}

export default themed
