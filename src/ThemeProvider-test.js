import React, { PropTypes } from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'
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
      <Theme theme={theme2} compose children={<Foo />} />,
      { context: { theme: theme1 } },
    )

    expect(wrapper.find(Foo).get(0).context.theme).to.eql({
      foo: 'foo bar',
    })
  })

  it('merges themes using a provided function', () => {
    const merge = (parent, child) => ({
      ...parent,
      ...child,
      baz: 'baz',
    })

    const theme1 = { foo: 'foo' }
    const theme2 = { bar: 'bar' }

    const wrapper = mount(
      <Theme theme={theme2} compose={merge} children={<Foo />} />,
      { context: { theme: theme1 } },
    )

    expect(wrapper.find(Foo).get(0).context.theme).to.eql({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    })
  })

  it('only composes themes when theme prop changes', () => {
    const theme = { foo: 'bar' }
    const merge = sinon.spy(() => ({}))

    const wrapper = mount(
      <Theme theme={theme} compose={merge} children={<Foo />} />,
      { context: { theme: {} } },
    )

    expect(merge.callCount).to.equal(1)

    wrapper.setProps({ theme })
    expect(merge.callCount).to.equal(1)

    wrapper.setProps({ theme: {} })
    expect(merge.callCount).to.equal(2)
  })
})
