# react-themed
A flexible library for styling React components. Intended for projects using global CSS, [JSS](https://github.com/cssinjs/jss), [CSS Modules](https://github.com/css-modules/css-modules), or any other [CSS in JS](https://github.com/MicheleBertoli/css-in-js) based library that compiles CSS classname reference objects.

[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)](https://github.com/aribouius/react-themed)
[![npm](https://img.shields.io/npm/v/react-themed.svg?style=flat-square)](https://www.npmjs.com/package/react-themed)
[![npm](https://img.shields.io/npm/l/express.svg?style=flat-square)]()

## Documentation
- [Features](#features)
- [Installation](#installation)
- [Terminology](#terminology)
- [Basic Usage](#basic-usage)
- [Theme Composition](#theme-composition)
- [Context Themes](#context-themes)
- [API Reference](#api-reference)

***

## Features
- A [higher-order](https://facebook.github.io/react/docs/higher-order-components.html) React component for injecting and customizing styles.
- A [provider](https://medium.com/@bloodyowl/the-provider-and-higher-order-component-patterns-with-react-d16ab2d1636) component for supplying context themes.
- Tools for theme composition and transformation.

***

## Installation
Install the stable version:
```bash
$ npm i --save react-themed
```
***

## Terminology
##### _`theme`_
A plain object containing CSS classname references used by one or more React components.

##### _`theme composition`_
The merging of two or more theme objects, where values for overlapping keys are concatenated.
```javascript
const theme1 = { list: 'list', item: 'list-item' }
const theme2 = { list: 'list-inline' }

compose(theme1, theme2)
// => { list: 'list list-inline', item: 'list-item' }
```

***

## Basic Usage
The HOC provided by `react-themed` can be used as a ES7 decorator, or a curried function. It allows you to inject themes into a React component (as a prop), customize themed components, and configure the wrapping component.

#### Use ES7 decorator
```javascript
import themed from 'react-themed'
import styles from './Button.css'

@themed(styles)

export default ({ theme, ...props }) => (
  <button {...props} className={theme.button} />
)
```

#### Use curried function
```javascript
import themed from 'react-themed'
import styles from './Button.css'

const Button = ({ theme, ...props }) => (
  <button {...props} className={theme.button} />
)

export default themed(styles)(Button)
```

#### Configure wrapped component
```javascript
import themed from 'react-themed'
import styles from './Button.css'

@themed(styles, {
  pure: true, // extend PureComponent
  propName: 'classes', // customize the prop name, defaults to "theme"
})

export default ({ classes, ...props }) => (
  <button {...props} className={classes.button} />
)
```

***

## Theme Composition
Themes can be composed in several ways, either at the time of component creation, or while rendering.

#### Compose themes
```javascript
import { compose } from 'react-themed'
import defaultStyles from './Button.css'
import primaryStyles from './ButtonPrimary.css'

export default compose({}, defaultStyles, primaryStyles)
```

#### Compose components
```javascript
import themed from 'react-themed'
import defaultStyles from './Button.css'
import primaryStyles from './ButtonPrimary.css'

const Button = ({ theme, ...props }) => (
  <button {...props} className={theme.button} />
)

const Default = themed(defaultStyles)(Button)
const Primary = themed(primaryStyles)(Default)
```

#### Compose during render
```javascript
import themed from 'react-themed'
import Button from './Button'
import styles from './Form.css'

const buttonStyles = {
  button: styles.button,
}

export default props => (
  <form className={styles.form}>
    <Button theme={buttonStyles}>Submit</Button>
  </form>
)
```

#### Customize composition (e.g. for regular merging)
```javascript
import themed from 'react-themed'
import Button from './Button'
import primaryStyles from './ButtonPrimary.css'

export default themed(prevStyles => ({
  ...prevStyles,
  ...primaryStyles,
}))(Button)
```

***

## Context Themes
This library currently supports two context theme shapes.

```javascript
// Flat
const theme = {
  Button: 'button',
  Button_primary: 'button-primary'
}

// Nested
const theme = {
  Button: {
    button: 'button',
    primary: 'button-primary',
  },
}
```

#### Activate a context theme
```javascript
import { ThemeProvider } from 'react-themed'

const App = props => (
  <ThemeProvider theme={props.theme} />
    {props.children}
  </ThemeProvider>
)
```

#### Use a flat context theme
```javascript
import themed from 'react-themed'

// pluck classnames
@themed([
  'Button',
  'Button_primary',
])

export default ({ theme, ...props }) => (
  <button {...props} className={theme.Button} />
)
```

#### Use a nested context theme
```javascript
import themed from 'react-themed'

// select theme namespace
@themed('Button')

export default ({ theme, ...props }) => (
  <button {...props} className={theme.button} />
)
```

#### Customize context themes
```javascript
import themed from 'react-themed'
import styles from './Button.css'

@themed((prevTheme, contextTheme) => ({
  ...contextTheme.Button,
  ...styles,
}))

export default ({ theme, ...props }) => (
  <button {...props} className={theme.button} />
)
```

***

## API Reference
#### `<ThemeProvider theme [compose]>`
Adds theme to a React component context, making it available to `themed()` calls.
- `theme` \(*Object|Function*): Can be either a theme object, or a function that receives a previously added theme, and is expected to return the final theme to use.
- `compose` \(*Bool*): Indicates whether the theme should be composed with previously added themes (does not apply to function themes). Defaults to `true`.

#### `themed([theme], [options])`
Creates a new HOC for generating a `Themed` component.
- `theme` \(*Object|String|Array|Function*): The theme to bind to the component.  Can be either a plain object, a string/array for selecting context theme(s), or a function that receives the previously assigned theme (if any) and context theme (if any), and is expected to return the final theme to use.
- `options` \(*Object*): Configures the default options for the `Themed` component.
  - `propName` \(*String*): The name of the prop that receives the theme, defaults to `theme`.
  - `pure` \(*Bool*): Indicates the component should inherit from `PureComponent`.
  - `compose` \(*Func*): Specifies the default function to use when composing themes.
  - `mergeProps(ownProps, themeProps): props` \(*Function*): If specified, it is passed the parent props and theme props, and is expected to return a merged object to pass as props to the wrapped component.

#### `themed.extend(options)`
Creates a new `themed` function that uses a customized set of default options when generating themed components.
- `options` \(*Object*): The options to merge into the previous default options.

#### `<Themed [theme] [childRef]>`
The *themed* component created by the `themed` decorator.
- `theme` \(*Object|String|Array|Function*): A theme or context theme (selector) that should be composed with the previous theme, or a function that customizes the previous theme.  
- `childRef` \(Function*): Specifies a [ref](https://facebook.github.io/react/docs/refs-and-the-dom.html) callback function to pass to the wrapped component.

#### `compose(target, ...themes)`
Recursively merges theme objects by concatenating values for overlapping keys, and copies result into a target object.

***

## License
MIT
