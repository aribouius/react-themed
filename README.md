# React Themed

A simple theme provider for react applications.

## Installation
```bash
$ npm i --save react-themed
```

## Usage
**Step 1.** Compose a theme for your application, using [CSS Modules](https://github.com/css-modules/css-modules), [JSS](https://github.com/cssinjs/jss), or any other library that generates a mapping of classname references. The theme shape is optional, but we find namespacing styles by component name works well.
```javascript
const theme = {
  Button: {
    small: '.btn-small',
    large: '.btn-large',
  },
}
```

**Step 2.** Use the `ThemeProvider` component to make the theme available via context.
```javascript
import { render } from 'react-dom'
import { ThemeProvider } from 'react-themed'
import MyRootComponent from './MyRootComponent'
import theme from './theme'

render(
  <ThemeProvider theme={theme}>
    <MyRootComponent />
  </ThemeProvider>,
  document.getElementById('root')
)
```

**Step 3.** Create a component that defines a theme interface, and generate a _themed_ version of it by using the `themed` decorator to select which part(s) of the context theme should be provided as a prop.
```javascript
import React, { Component, PropTypes } from 'react'
import { themed } from 'react-themed'

export default class Button extends Component {
  static propTypes = {
    size: PropTypes.oneOf([
      'small',
      'large',
    ]),
    theme: PropTypes.shape({
      small: PropTypes.string,
      large: PropTypes.string,
    }),
  }

  render() {
    const {
      size = 'small',
      theme,
      ...props,
    } = this.props

    return (
      <button
        {...props}
        className={theme[size]}
      />
    )
  }
}

// select theme by name
export const ThemedButton = themed('Button')(Button)

// or pluck it out yourself
export const ThemedButton = themed(theme => theme.Button)(Button)
```

## API
### `<ThemeProvider theme [compose]>`
Adds a theme to the context of a component tree, making it available to `themed()` calls.  Optionally composes provided theme with theme(s) already added to the context by a separate `ThemeProvider` higher up.

### `themed([theme], [options])`
Creates a new [HOC](https://facebook.github.io/react/docs/higher-order-components.html) that returns a _themed_ component.

- [`identifier|selector(theme):theme`] \(*String|Function*): A string identifier, or selector function, used to pluck out parts of the context theme that should be provided as a prop to the component.  If not specified, the entire context theme is provided.
- [`options`] \(*Object*): A configuration object.
  - [`propName = "theme"`] \(*String*): The name of the prop the theme gets assigned to.
  - [`mergeProps(ownProps, themeProps): props`] \(*Function*): If specified, it is passed the parent props and an object containing the theme prop. The returned plain object is passed as props to the wrapped component.

### `composeTheme(...themes)`
Recursively merges theme objects. Values for overlapping keys are concatenated.

## License
MIT
