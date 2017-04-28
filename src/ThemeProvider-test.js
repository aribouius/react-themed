import React from 'react'
import PropTypes from 'prop-types'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'
import Theme from './ThemeProvider'
import { CONTEXT_KEY } from './const'

describe('ThemeProvider', () => {
  const theme1 = { foo: 'foo', bar: 'bar' }
  const theme2 = { foo: 'baz' }

  const Foo = () => null
  Foo.contextTypes = {
    [CONTEXT_KEY]: PropTypes.object,
  }

  const setupContext = theme => ({
    [CONTEXT_KEY]: theme,
  })

  const getTheme = wrapper => (
    wrapper.find(Foo).get(0).context[CONTEXT_KEY]
  )

  it(`provides a '${CONTEXT_KEY}' context`, () => {
    const wrapper = mount(
      <Theme theme={theme1}>
        <Foo />
      </Theme>,
    )
    expect(getTheme(wrapper)).to.eql(theme1)
  })

  it('handles a object theme when compose is true', () => {
    const wrapper = mount(
      <Theme theme={theme2}>
        <Foo />
      </Theme>,
      { context: setupContext(theme1) },
    )
    expect(getTheme(wrapper)).to.eql({
      foo: 'foo baz',
      bar: 'bar',
    })
  })

  it('handles a object theme when compose is false', () => {
    const wrapper = mount(
      <Theme theme={theme2} compose={false}>
        <Foo />
      </Theme>,
      { context: setupContext(theme1) },
    )
    expect(getTheme(wrapper)).to.eql(theme2)
  })

  it('handles a function theme prop', () => {
    const theme = parent => ({
      ...parent,
      ...theme2,
    })
    const wrapper = mount(
      <Theme theme={theme}>
        <Foo />
      </Theme>,
      { context: setupContext(theme1) },
    )
    expect(getTheme(wrapper)).to.eql({
      foo: 'baz',
      bar: 'bar',
    })
  })

  it('caches built themes', () => {
    const wrapper = mount(
      <Theme theme={theme1}>
        <Foo />
      </Theme>,
      { context: {} },
    )
    const spy = sinon.spy(wrapper.instance(), 'buildTheme')
    wrapper.setProps({})
    wrapper.setContext({})
    expect(spy.callCount).to.equal(0)
  })

  it('builds theme if theme prop is updated', () => {
    const wrapper = mount(
      <Theme theme={theme1}>
        <Foo />
      </Theme>,
      { context: {} },
    )
    const spy = sinon.spy(wrapper.instance(), 'buildTheme')
    wrapper.setProps({ theme: theme2 })
    expect(spy.callCount).to.equal(1)
  })

  it('builds theme if context is updated', () => {
    const wrapper = mount(
      <Theme theme={theme1}>
        <Foo />
      </Theme>,
      { context: {} },
    )
    const instance = wrapper.instance()
    const spy = sinon.spy(instance, 'buildTheme')
    instance.componentWillUpdate(instance.props, {}, setupContext(theme2))
    expect(spy.callCount).to.equal(1)
  })

  it('rebuilds theme using correct props and context', () => {
    const wrapper = mount(
      <Theme theme={theme1} compose={false}>
        <Foo />
      </Theme>,
      { context: {} },
    )
    wrapper.setProps({ theme: theme2 })
    expect(getTheme(wrapper)).to.eql(theme2)
  })
})
