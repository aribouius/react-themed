import React, { PropTypes } from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import Theme from './ThemeProvider'

describe('ThemeProvider', () => {
  const Foo = () => null
  Foo.contextTypes = { theme: PropTypes.object }

  it('provides a `theme` context', () => {
    const theme = { foo: 'foo' }
    const wrapper = mount(<Theme theme={theme} children={<Foo />} />)

    expect(wrapper.find(Foo).get(0).context).to.eql({ theme })
  })

  it('composes themes', () => {
    const theme1 = { foo: 'foo' }
    const theme2 = { foo: 'bar' }

    const wrapper = mount(
      <Theme theme={theme1}>
        <Theme theme={theme2} compose>
          <Foo />
        </Theme>
      </Theme>,
    )

    expect(wrapper.find(Foo).get(0).context.theme).to.eql({
      foo: 'foo bar',
    })
  })

  it('merges themes', () => {
    const theme1 = { foo: 'foo', bar: 'bar' }
    const theme2 = { foo: 'bar' }

    const wrapper = mount(
      <Theme theme={theme1}>
        <Theme theme={theme2} merge>
          <Foo />
        </Theme>
      </Theme>,
    )

    expect(wrapper.find(Foo).get(0).context.theme).to.eql({
      foo: 'bar',
      bar: 'bar',
    })
  })

  it('merges themes using a custom merge function', () => {
    const merge = (parent, child) => ({
      ...parent,
      ...child,
      baz: 'baz',
    })

    const theme1 = { foo: 'foo' }
    const theme2 = { bar: 'bar' }

    const wrapper = mount(
      <Theme theme={theme1}>
        <Theme theme={theme2} merge={merge}>
          <Foo />
        </Theme>
      </Theme>,
    )

    expect(wrapper.find(Foo).get(0).context.theme).to.eql({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    })
  })
})
