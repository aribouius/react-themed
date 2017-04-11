# React Themed

A simple theme provider and composition utility for react applications.

## Installation
```bash
$ npm i --save react-themed
```

## Usage
**Step 1.**  Create a base theme for your application, using [CSS Modules](https://github.com/css-modules/css-modules), [JSS](https://github.com/cssinjs/jss), or any other library that generates a mapping of classname references. The theme shape is optional, but we find namespacing styles by component name works well.
```javascript
const theme = {
  Form: {
    default: 'form',
  },
  Input: {
    default: 'input',
    invalid: 'input-invalid',
  },
  Button: {
    default: 'btn',
    primary: 'btn-primary',
    success: 'btn-success',
  },
}
```

**Step 2.**  Use the `ThemeProvider` component to make the base theme available via context.
```javascript
import { ThemeProvider } from 'react-themed'
import theme from './theme'

const App = (props) => (
  <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
)
```

**Step 3.**  Create *themed* components by using the `themed` decorator to select which part(s) of the base theme
the component should receive as a `theme` prop.

```javascript
import React from 'react'
import { themed } from 'react-themed'

// select theme by name
@themed('Button')
const Button = ({ theme, color, ...props }) => (
  <button
    {...props}
    className={theme[color || 'default']}
  />
)

// select theme via callback
@themed(theme => theme.Input)
const Input = ({ theme, invalid, ...props }) => (
  <input
    {...props}
    className={invalid ? theme.invalid : theme.default}
  />
)

// receive entire base theme
@themed()
const Form = ({ theme, ...props }) => (
  <form {...props} className={theme.Form.default}>
    <Input type="text" />
    <Button type="submit">Submit</Button>
  </form>
)
```

## API
### `<ThemeProvider theme [compose]>`
Adds a theme to the context of a component tree, making it available to `themed()` calls. *Note:* This also gets exported under a `Theme` alias.
- [`theme`] \(*Object*): The theme object.
- [`compose = false`] \(*Bool*): When `true`, the provided theme will get composed with any themes already added to the context via separate `ThemeProvider` components higher up the tree.

### `themed([theme], [options])`
Creates a new [HOC](https://facebook.github.io/react/docs/higher-order-components.html) that returns a `Themed` component.

- [`identifier|selector(theme):theme`] \(*String|Function*): A string identifier, or selector function, used to pluck out parts of the context theme that should be provided as a prop to the component.  If not specified, the entire context theme is provided.
- [`options`] \(*Object*): Configures the default options for the `Themed` component.
  - [`propName = "theme"`] \(*String*): The name of the prop the theme gets assigned to.
  - [`compose = false`] \(*Bool|Func*): Specifies default behavior for handling a prop passed to the `Themed` component that matches the configured `propName`.  When `false`, the prop replaces the context theme.  When `true`, the two themes get composed.  If the prop is a function, it is passed the prop theme and the context theme, and is expected to return a merged plain object.
  - [`mergeProps(ownProps, themeProps): props`] \(*Function*): If specified, it is passed the parent props and an object containing the theme prop. The returned plain object is passed as props to the wrapped component.

### `<Themed [theme] [themeConfig]>`
The *themed* component that gets created by the `themed` decorator.
- [`theme`] \(*Object*): A custom theme that either replaces the context theme, or composes it, depending on whether the `compose` option is enabled.
- [`themeConfig`] \(*Object*): A configuration object whose values override the default theming options applied to the component.
  - [`compose`] \(*Bool*): Overrides the default `compose` configuration.

### `composeTheme(...themes)`
Recursively merges theme objects by concatenating string values for overlapping keys.

## License
MIT
