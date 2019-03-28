import { PureComponent, Children } from 'react'
import PropTypes from 'prop-types'
import compose from './compose'
import { ThemeProvider } from './context'

export default class ThemeProviderWrapper extends PureComponent {
  static propTypes = {
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    compose: PropTypes.bool,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    compose: true,
  }

  constructor(props) {
    super(props)
    this.buildTheme(props)
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.theme !== nextProps.theme) {
      this.buildTheme(this.props, nextProps)
    }
  }

  buildTheme(props, newProps) {
    const { theme } = props
    const { theme: newTheme } = newProps

    if (props && newProps) {
      this.theme = compose({}, theme, newTheme)
    } else {
      this.theme = theme
    }
  }

  render() {
    return (
      <ThemeProvider value={this.props.theme}>
        { Children.only(this.props.children) }
      </ThemeProvider>
    )
  }
}
