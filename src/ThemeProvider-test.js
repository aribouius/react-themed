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

  it('caches composed themes between renders', () => {
    const theme = { foo: 'bar' }
    const merge = sinon.spy(() => ({}))

    const wrapper = mount(
      <Theme theme={theme} compose={merge} children={<Foo />} />,
      { context: { theme: {} } },
    )

    wrapper.setProps({ theme })
    wrapper.setProps({ theme })

    expect(merge.callCount).to.equal(1)
  })

  it('rebuilds theme when theme prop is changed', () => {
    const theme = { foo: 'bar' }
    const merge = sinon.spy(() => ({}))

    const wrapper = mount(
      <Theme theme={theme} compose={merge} children={<Foo />} />,
      { context: { theme: {} } },
    )

    wrapper.setProps({ theme: {} })
    expect(merge.callCount).to.equal(2)
  })

  it('rebuilds theme when theme context is changed', () => {
    const theme1 = { foo: 'foo' }
    const theme2 = { bar: 'bar' }
    const merge = sinon.spy(() => ({}))

    const wrapper = mount(
      <Theme theme={theme1}>
        <Theme theme={theme2} compose={merge} children={<Foo />} />
      </Theme>,
    )

    wrapper.setProps({ theme: {} })
    expect(merge.callCount).to.equal(2)
  })
})
