import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from './const'

export default class ThemeProviderWrapper extends Component {
  static propTypes = {
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    children: PropTypes.element.isRequired,
  }

  render() {
    return (
      <ThemeProvider value={this.props.theme}>
        { Children.only(this.props.children) }
      </ThemeProvider>
    )
  }
}
