/**
 * @jest-environment jsdom
 */
import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import Theme from './ThemeProvider'
import { CONTEXT_KEY, ThemeContext } from './const'

describe('ThemeProvider', () => {
  const theme = { foo: 'foo', bar: 'bar' }

  class Foo extends React.Component {
    render() {
      return null
    }
  }
  Foo.contextType = ThemeContext

  const wrapper = mount(
    <Theme theme={theme}>
      <Foo/>
    </Theme>
  )

  test(`provides a '${CONTEXT_KEY}'`, () => {
    expect(wrapper.prop('theme')).to.be.eql(theme)
  })

  test('Embedded component shared same context', () => {
    expect(wrapper.find(Foo).instance().context).to.be.eql(theme)
  })

  test.only('Expect empty theme prop to still be okay', () => {
    const emptyThemeWrapper = mount(
      <Theme theme={{}}>
        <Foo/>
      </Theme>
    )

    expect(emptyThemeWrapper.prop('theme')).to.be.eql({})
  })
})
