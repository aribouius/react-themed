import React, { Component, PureComponent } from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import themed from './themed'
import { CONTEXT_KEY, CONFIG_KEY } from './const'

describe('themed', () => {
  const Foo = () => null
  Foo.staticProp = 'foo'

  const context = {
    [CONTEXT_KEY]: {
      Foo: { foo: 'foo' },
    },
  }

  describe('decorator', () => {
    it('handles an undefined theme', () => {
      const Bar = themed()(Foo)
      const wrapper = shallow(<Bar />)
      expect(wrapper.find(Foo).prop('theme')).to.equal(undefined)
    })

    it('handles a null theme', () => {
      const Bar = themed(null)(Foo)
      const wrapper = shallow(<Bar />)
      expect(wrapper.find(Foo).prop('theme')).to.equal(undefined)
    })

    it('handles a string theme', () => {
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(context[CONTEXT_KEY].Foo)
    })

    it('handles an array theme', () => {
      const Bar = themed(['Foo'])(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql({
        Foo: context[CONTEXT_KEY].Foo,
      })
    })

    it('handles a function theme', () => {
      const Bar = themed(theme => theme.Foo)(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(context[CONTEXT_KEY].Foo)
    })

    it('handles a object theme', () => {
      const theme = { bar: 'bar' }
      const Bar = themed(theme)(Foo)
      const wrapper = shallow(<Bar />)
      expect(wrapper.find(Foo).prop('theme')).to.eql(theme)
    })

    it('handles a propName option', () => {
      const Bar = themed({}, { propName: 'styles' })(Foo)
      const wrapper = shallow(<Bar />)
      expect(wrapper.find(Foo).props()).to.eql({ styles: {} })
    })

    it('handles a compose option', () => {
      const compose = (one, two) => ({ ...one, ...two })
      const Bar = themed({ foo: 'foo' }, { compose })(Foo)
      const wrapper = shallow(<Bar theme={{ bar: 'bar' }} />)
      expect(wrapper.find(Foo).prop('theme')).to.eql({
        foo: 'foo',
        bar: 'bar',
      })
    })

    it('handles a mergeProps option', () => {
      const mergeProps = (one, two) => ({ ...one, ...two, foo: 'foo' })
      const Bar = themed({}, { mergeProps })(Foo)
      const wrapper = shallow(<Bar />)
      expect(wrapper.find(Foo).props()).to.eql({ foo: 'foo', theme: {} })
    })

    it('handles a pure option', () => {
      const Bar = themed(null, { pure: true })(Foo)
      expect(Bar.prototype instanceof PureComponent).to.equal(true)
    })

    it('inherits from Component by default', () => {
      const Bar = themed()(Foo)
      expect(Bar.prototype instanceof Component).to.equal(true)
    })

    it('hoists statics from the wrapped component', () => {
      const Bar = themed()(Foo)
      expect(Bar.staticProp).to.equal('foo')
    })

    it('exposes the component it wraps', () => {
      const Bar = themed()(Foo)
      expect(Bar.WrappedComponent).to.equal(Foo)
    })

    describe('when given a Themed component', () => {
      it('uses its config as default options', () => {
        const Bar = themed('Foo', { propName: 'styles' })(Foo)
        const Baz = themed()(Bar)
        const wrapper = mount(<Baz />, { context })
        expect(wrapper.find(Foo).prop('styles')).to.eql(context[CONTEXT_KEY].Foo)
      })

      it('composes its theme(s)', () => {
        const Bar = themed('Foo')(Foo)
        const Baz = themed({ bar: 'bar' })(Bar)
        const wrapper = mount(<Baz />, { context })
        expect(wrapper.find(Foo).prop('theme')).to.eql({
          ...context[CONTEXT_KEY].Foo,
          bar: 'bar',
        })
      })

      it('does not mutate the source component', () => {
        const Bar = themed({ foo: 'foo' }, { propName: 'theme' })(Foo)
        const Baz = themed({ bar: 'bar' }, { propName: 'styles' })(Bar)
        expect(Bar).to.not.equal(Baz)
        expect(Bar[CONFIG_KEY].propName).to.equal('theme')
      })
    })
  })

  describe('component', () => {
    it('handles child props', () => {
      const Bar = themed()(Foo)
      const wrapper = shallow(<Bar bar="bar" />)
      expect(wrapper.find(Foo).prop('bar')).to.equal('bar')
    })

    it('handles a empty theme prop', () => {
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar theme={null} />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(context[CONTEXT_KEY].Foo)
    })

    it('handles a function theme prop', () => {
      const Bar = themed('Foo')(Foo)
      const theme = base => ({ ...base, bar: 'bar' })
      const wrapper = shallow(<Bar theme={theme} />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql({
        foo: 'foo',
        bar: 'bar',
      })
    })

    it('handles a theme prop when compose is false', () => {
      const Bar = themed('Foo', { compose: false })(Foo)
      const theme = { bar: 'bar' }
      const wrapper = shallow(<Bar theme={theme} />, { context })
      expect(wrapper.find(Foo).prop('theme')).to.eql(theme)
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
      mount(<Bar childRef={callback} />)
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
