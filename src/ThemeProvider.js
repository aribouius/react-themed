import { PureComponent, Children } from 'react'
import PropTypes from 'prop-types'
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

  constructor(props, context) {
    super(props, context)
    this.buildTheme(props, context)
  }

  componentWillReceiveProps(props, context) {
    if (this.context.theme !== context.theme || this.props.theme !== props.theme) {
      this.buildTheme(props, context)
    }
  }

  buildTheme(props, context) {
    this.theme = props.theme
    const { compose } = this.props
    const parentTheme = context.theme

    if (parentTheme) {
      if (typeof compose === 'function') {
        this.theme = compose(parentTheme, this.theme)
      } else if (compose) {
        this.theme = composeTheme(parentTheme, this.theme)
      }
    }
  }

  getChildContext() {
    return { theme: this.theme }
  }

  render() {
    return Children.only(this.props.children)
  }
}
