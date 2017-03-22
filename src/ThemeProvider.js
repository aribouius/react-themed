import { PureComponent, PropTypes, Children } from 'react'

export default class ThemeProvider extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = {
    theme: PropTypes.object.isRequired,
  }

  getChildContext() {
    return { theme: this.props.theme }
  }

  render() {
    return Children.only(this.props.children)
  }
}
