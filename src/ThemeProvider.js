import { PureComponent, PropTypes, Children } from 'react'
import deepMerge from 'lodash.merge'
import composeTheme from './composeTheme'

export default class ThemeProvider extends PureComponent {
  static contextTypes = {
    theme: PropTypes.object,
  }

  static propTypes = {
    theme: PropTypes.object.isRequired,
    merge: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    compose: PropTypes.bool,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    merge: false,
    compose: false,
  }

  static childContextTypes = {
    theme: PropTypes.object,
  }

  getChildContext() {
    let theme = this.props.theme
    const { merge, compose } = this.props
    const parentTheme = this.context.theme

    if (parentTheme) {
      if (compose) {
        theme = composeTheme(parentTheme, theme)
      } else if (typeof merge === 'function') {
        theme = merge(parentTheme, theme)
      } else if (merge) {
        theme = deepMerge({}, parentTheme, theme)
      }
    }

    return {
      theme,
    }
  }

  render() {
    return Children.only(this.props.children)
  }
}
