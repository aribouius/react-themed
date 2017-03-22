# React Themed

A simple theme provider for react applications.

## Installation
```bash
$ npm i --save react-themed
```

## Usage
**Step 1.** Compose a theme for your application, using [CSS Modules](https://github.com/css-modules/css-modules) or inline styles.
```javascript
const theme = {
  button: {
    default: '.btn',
    small: '.btn-small',
    large: '.btn-large',
  },
}
```

**Step 2.** Use the `ThemeProvider` component to provide access to the theme via context.
```javascript
import React, { Component }  from 'react'
import { ThemeProvider } from 'react-themed'
import theme from './theme'

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        {this.props.children}
      </ThemeProvider>
    )
  }
}
```

**Step 3.** Use the `themed` decorator to merge parts of the theme into a component's props.
```javascript
import React, { Component, PropTypes } from 'react'
import { themed } from 'react-themed'

@themed(theme => ({
  styles: theme.button,
}))

export default class Button extends Component {
  static propTypes = {
    size: PropTypes.oneOf([
      'small',
      'large',
    ]),
    styles: PropTypes.shape({
      default: PropTypes.string.isRequired,
      small: PropTypes.string.isRequired,
      large: PropTypes.string.isRequired,
    }).isRequired,
  }

  render() {
    const {
      size = 'small',
      styles,
      ...props,
    } = this.props

    return (
      <button
        {...props}
        className={`${styles.default} ${styles[size]}`}
      />
    )
  }
}
```


## License
MIT
