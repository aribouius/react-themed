import { PureComponent, PropTypes, Children } from 'react'
import composeTheme from './composeTheme'

export default class ThemeProvider extends PureComponent {
  static contextTypes = {
    theme: PropTypes.object,
  }

  static propTypes = {
    theme: PropTypes.object.isRequired,
    compose: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    compose: false,
  }

  static childContextTypes = {
    theme: PropTypes.object,
  }

  getChildContext() {
    let theme = this.props.theme
    const { compose } = this.props
    const parentTheme = this.context.theme

    if (parentTheme) {
      if (typeof compose === 'function') {
        theme = compose(parentTheme, theme)
      } else if (compose) {
        theme = composeTheme(parentTheme, theme)
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
