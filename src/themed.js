import { createElement, Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import hoist from 'hoist-non-react-statics'
import { CONTEXT_KEY, CONFIG_KEY } from './const'
import compose from './compose'

const mergeProps = (
  ownProps,
  themeProps,
) => ({
  ...ownProps,
  ...themeProps,
})

const pluck = (theme, keys) => (
  keys.reduce((acc, key) => {
    acc[key] = theme[key]
    return acc
  }, {})
)

const match = (theme, regex) => (
  Object.keys(theme).reduce((acc, key) => {
    if (key.match(regex)) acc[key] = theme[key]
    return acc
  }, {})
)

const create = (component, config) => {
  const BaseComponent = config.pure
    ? PureComponent
    : Component

  class Themed extends BaseComponent {
    static [CONFIG_KEY] = config

    static displayName = `Themed(${component.displayName || component.name})`
    static WrappedComponent = component

    static contextTypes = {
      [CONTEXT_KEY]: PropTypes.object,
    }

    static propTypes = {
      childRef: PropTypes.func,
      [config.propName]: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
        PropTypes.array,
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

    compose(target, theme) {
      return theme ? config.compose(target || {}, theme) : theme
    }

    buildTheme(props, context) {
      this.theme = undefined

      const themes = config.themes.slice()
      const shared = context[CONTEXT_KEY] || {}

      if (props[config.propName]) {
        themes.push(props[config.propName])
      }

      themes.forEach(theme => {
        if (Array.isArray(theme)) {
          this.theme = this.compose(this.theme, pluck(shared, theme))
        } else if (typeof theme === 'string') {
          this.theme = this.compose(this.theme, theme === '*' ? shared : shared[theme])
        } else if (theme instanceof RegExp) {
          this.theme = this.compose(this.theme, match(shared, theme))
        } else if (typeof theme === 'object') {
          this.theme = this.compose(this.theme, theme)
        } else if (typeof theme === 'function') {
          this.theme = theme(this.theme, shared)
        }
      })
    }

    render() {
      const {
        childRef,
        ...props
      } = this.props

      return createElement(component, config.mergeProps(props, {
        [config.propName]: this.theme,
        ref: childRef,
      }))
    }
  }

  return hoist(
    Themed,
    component,
  )
}

const factory = defaults => {
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

    return create(
      component,
      config,
    )
  }

  return Object.assign(themed, {
    defaults,
    extend: config => (
      factory({
        ...defaults,
        ...config,
      })
    ),
  })
}

export default factory({
  compose,
  mergeProps,
  pure: false,
  propName: 'theme',
})
