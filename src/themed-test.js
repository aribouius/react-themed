import React, { Component, PureComponent } from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import themed from './themed'
import { CONTEXT_KEY } from './const'

describe('themed', () => {
  const Foo = () => null
  Foo.staticProp = 'foo'

  const context = {
    [CONTEXT_KEY]: {
      Foo: { foo: 'foo' },
      Bar: { bar: 'bar' },
    },
  }

  describe('decorator', () => {
    it('handles a empty selector', () => {
      const Bar = themed()(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(context[CONTEXT_KEY])
    })

    it('handles a string selector', () => {
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(context[CONTEXT_KEY].Foo)
    })

    it('handles a function selector', () => {
      const Bar = themed(theme => theme.Foo)(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(context[CONTEXT_KEY].Foo)
    })

    it('handles a object selector', () => {
      const theme = { baz: 'baz' }
      const Bar = themed(theme)(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(theme)
    })

    it('throws for unexpected selectors', () => {
      const Bar = themed([])(Foo)
      const fn = () => shallow(<Bar />, { context })
      expect(fn).to.throw(Error)
    })

    it('handles a configured prop name', () => {
      const Bar = themed(null, { propName: 'styles' })(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).props()).to.eql({
        styles: context[CONTEXT_KEY],
      })
    })

    it('handles a configured mergeProps function', () => {
      const mergeProps = (one, two) => ({ ...one, ...two, foo: 'foo' })
      const Bar = themed(null, { mergeProps })(Foo)
      const wrapper = shallow(<Bar bar="bar" />, { context })
      expect(wrapper.find(Foo).props()).to.eql({
        foo: 'foo',
        bar: 'bar',
        theme: context[CONTEXT_KEY],
      })
    })

    it('hoists statics from wrapped component', () => {
      const Bar = themed()(Foo)
      expect(Bar.staticProp).to.equal('foo')
    })
  })

  describe('component', () => {
    it('handles child props', () => {
      const Bar = themed()(Foo)
      const wrapper = shallow(<Bar bar="bar" />, { context })
      expect(wrapper.find(Foo).prop('bar')).to.equal('bar')
    })

    it('inherits from Component by default', () => {
      const Bar = themed(null)(Foo)
      expect(Bar.prototype instanceof Component).to.equal(true)
    })

    it('inherits from PureComponent when pure', () => {
      const Bar = themed(null, { pure: true })(Foo)
      expect(Bar.prototype instanceof PureComponent).to.equal(true)
    })

    it('exposes the component it wraps', () => {
      const Bar = themed()(Foo)
      expect(Bar.WrappedComponent).to.equal(Foo)
    })

    it('handles a empty theme prop', () => {
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar theme={null} />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(context[CONTEXT_KEY].Foo)
    })

    it('handles a function theme prop', () => {
      const Bar = themed('Foo')(Foo)
      const theme = base => ({ ...base, foo: 'baz' })
      const wrapper = shallow(<Bar theme={theme} />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql({ foo: 'baz' })
    })

    it('handles a object theme prop when compose is true', () => {
      const Bar = themed('Foo')(Foo)
      const theme = { foo: 'baz' }
      const wrapper = shallow(<Bar theme={theme} />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql({
        foo: 'foo baz',
      })
    })

    it('handles a object theme prop when compose is false', () => {
      const Bar = themed('Foo', { compose: false })(Foo)
      const theme = { foo: 'baz' }
      const wrapper = shallow(<Bar theme={theme} />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql({
        foo: 'baz',
      })
    })

    it('caches built themes', () => {
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar />, { context })
      const spy = sinon.spy(wrapper.instance(), 'buildTheme')
      wrapper.setProps({})
      wrapper.setContext(context)
      expect(spy.callCount).to.equal(0)
    })

    it('builds theme if theme prop is updated', () => {
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar />, { context })
      const spy = sinon.spy(wrapper.instance(), 'buildTheme')
      wrapper.setProps({ theme: { } })
      expect(spy.callCount).to.equal(1)
    })

    it('builds theme if context is updated', () => {
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar />, { context })
      const spy = sinon.spy(wrapper.instance(), 'buildTheme')
      wrapper.setContext({ [CONTEXT_KEY]: { ...context[CONTEXT_KEY] } })
      expect(spy.callCount).to.equal(1)
    })

    it('rebuilds theme using correct props and context', () => {
      const Bar = themed('Foo', { compose: false })(Foo)
      const theme = { foo: 'baz' }
      const wrapper = shallow(<Bar />, { context })
      wrapper.setProps({ theme })
      expect(wrapper.find(Foo).prop('theme')).to.eql(theme)
    })

    it('handles a `childRef` prop', () => {
      const Bar = themed()(Foo)
      const callback = sinon.spy()
      const wrapper = mount(<Bar childRef={callback} />)
      expect(callback.called).to.equal(true)
    })
  })

  describe('setDefaults', () => {
    it('assigns default global options for `themed`', () => {
      themed.setDefaults({ propName: 'foo' })
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('foo')).to.eql(context[CONTEXT_KEY].Foo)
      themed.setDefaults({ propName: 'theme' })
    })
  })
})
