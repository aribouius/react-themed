import { createElement, Component } from 'react'
import PropTypes from 'prop-types'
import composeTheme from './composeTheme'

export default class ThemedComponent extends Component {
  static contextTypes = {
    theme: PropTypes.object,
  }

  constructor(...args) {
    super(...args)
    this.config = this.constructor.themeConfig
    this.buildTheme()
  }

  componentWillReceiveProps(props, context) {
    if (this.propsChanged(props) || this.contextChanged(context)) {
      this.buildTheme()
    }
  }

  propsChanged(props) {
    const {
      propName,
      configKey,
    } = this.config

    return (
      this.props[propName] !== props[propName] ||
      this.props[configKey].compose !== props[configKey].compose
    )
  }

  contextChanged(context) {
    return this.context.theme !== context.theme
  }

  buildTheme() {
    const {
      propName,
      configKey,
      selectTheme,
    } = this.config

    const {
      [propName]: propTheme,
    } = this.props

    const {
      compose = this.config.compose,
    } = this.props[configKey]

    this.theme = selectTheme(this.context.theme || {})

    if (propTheme) {
      if (typeof compose === 'function') {
        this.theme = compose(this.theme, propTheme)
      } else if (compose) {
        this.theme = composeTheme(this.theme, propTheme)
      } else {
        this.theme = propTheme
      }
    }
  }

  render() {
    const props = { ...this.props }

    delete props[this.config.propName]
    delete props[this.config.configKey]

    return createElement(this.config.component, this.config.mergeProps(props, {
      [this.config.propName]: this.theme,
    }))
  }
}
