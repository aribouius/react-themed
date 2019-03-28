import { expect } from 'chai'
import expand from './expand'

describe('expandTheme', () => {
  const createTheme = sep => ({
    [`Foo${sep}foo`]: 'foo',
    [`Foo${sep}foo_bar`]: 'foo-bar',
    [`FooBar${sep}foo`]: 'foo',
    [`FooBar${sep}foo_bar`]: 'foo-bar',
    [`Foo${sep}Bar${sep}bar`]: 'bar',
  })

  test('expands a flattened theme', () => {
    const theme = createTheme('-')
    const result = expand(theme)

    expect(result).to.eql({
      Foo: {
        foo: 'foo',
        foo_bar: 'foo-bar',
        Bar: {
          bar: 'bar',
        },
      },
      FooBar: {
        foo: 'foo',
        foo_bar: 'foo-bar',
      },
    })
  })

  test('accepts a custom separator', () => {
    const theme = createTheme('_')
    const result = expand(theme, {
      separator: '_',
    })

    expect(result).to.eql({
      Foo: {
        foo: 'foo',
        foo_bar: 'foo-bar',
        Bar: {
          bar: 'bar',
        },
      },
      FooBar: {
        foo: 'foo',
        foo_bar: 'foo-bar',
      },
    })
  })
})
