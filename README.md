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
  Button: {
    small: '.btn-small',
    large: '.btn-large',
  },
}
```

**Step 2.** Use the `ThemeProvider` component to provide access to the theme via context.
```javascript
import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'react-themed'
import theme from './theme'
import App from './App'

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)
```

**Step 3.** Use the `themed` decorator to merge parts of the theme into a component's props.
```javascript
import React, { Component, PropTypes } from 'react'
import { themed } from 'react-themed'

@themed(theme => ({
  styles: theme.Button,
}))

export default class Button extends Component {
  static propTypes = {
    size: PropTypes.oneOf([
      'small',
      'large',
    ]),
    styles: PropTypes.shape({
      small: PropTypes.string,
      large: PropTypes.string,
    }),
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
        className={styles[size]}
      />
    )
  }
}
```

## API
### `<ThemeProvider theme>`
Adds a theme to the context of a component tree, making it available to `themed()` calls.

### `themed([mapThemeToProps], [mergeProps])`
Returns a new _themed_ wrapped component (HOC).

- [`mapThemeToProps(theme): props`] \(*Function*): If specified, the new component will call this function to pluck/map parts of the theme context.  The results of `mapThemeToProps` must be a plain object, which will be merged into the component’s props. If omitted the entire theme will be added to the component's props via a `theme` key.
- [`mergeProps(ownProps, themeProps): props`] \(*Function*): If specified, it is passed the parent props and the result of `mapThemeToProps()`. The returned plain object is passed as props to the wrapped component.

### `composeTheme(...themes)`
Recursively merges CSS Module theme objects. Values for overlapping keys are concatenated.

## License
MIT
