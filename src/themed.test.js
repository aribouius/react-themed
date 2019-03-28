/**
 * @jest-environment jsdom
 */
import React, { createElement, Component } from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'
import themed from './themed'
import ThemeProvider from './ThemeProvider'
import { CONFIG_KEY } from './const'

describe('themed', () => {
  class Foo extends Component {
    static foo = 'foo'

    render() {
      return null
    }
  }

  const context = {
    Foo: { foo: 'foo' },
    Bar: { bar: 'bar' },
    Baz: { bar: 'baz' },
  }

  const setup = ({
    theme,
    config,
    props,
    component = Foo,
    decorator = themed,
  } = {}) => {
    const Themed = decorator(theme, config)(component)
    const wrapper = mount(
      <ThemeProvider theme={ context }>
        <Themed {...props} />
      </ThemeProvider>,
    )

    return {
      Themed,
      wrapper,
      themewrapper: () => (wrapper.find('Themed(Foo)')),
      getTheme: () => (
        wrapper.find(Foo).prop('theme')
      ),
    }
  }

  describe('decorator', () => {
    test('handles a undefined theme', () => {
      const { getTheme } = setup()
 
      expect(getTheme()).to.equal(undefined)
    })

    test('handles a null theme', () => {
      const { getTheme } = setup({ theme: null })
      expect(getTheme()).to.equal(undefined)
    })

    test('handles a false theme', () => {
      const { getTheme } = setup({ theme: false })
      expect(getTheme()).to.equal(undefined)
    })

    test('handles a number theme', () => {
      const { getTheme } = setup({ theme: 1 })
      expect(getTheme()).to.equal(undefined)
    })

    test('handles a object theme', () => {
      const { getTheme } = setup({ theme: context.Foo })

      expect(getTheme()).to.eql(context.Foo)
    })

    test('handles a string theme', () => {
      const { getTheme } = setup({ theme: 'Foo' })

      expect(getTheme()).to.eql(context.Foo)
    })

    test('handles a wildcard theme', () => {
      const { getTheme } = setup({ theme: '*' })
      expect(getTheme()).to.eql(context)
    })

    test('handles an array theme', () => {
      const { getTheme } = setup({ theme: ['Foo'] })
      expect(getTheme()).to.eql({ Foo: context.Foo })
    })

    test('handles a regex theme', () => {
      const { getTheme } = setup({ theme: /^Ba/ })
      expect(getTheme()).to.eql({
        Bar: context.Bar,
        Baz: context.Baz,
      })
    })

    test('handles a function theme', () => {
      const spy = sinon.spy(() => context.Foo)
      const { getTheme } = setup({ theme: spy })
      expect(getTheme()).to.equal(context.Foo)
      expect(spy.calledWith(undefined, context)).to.equal(true)
    })

    test('handles a "compose" option', () => {
      const { getTheme } = setup({
        theme: context.Foo,
        props: { theme: context.Bar },
        config: { compose: Object.assign.bind({}) },
      })
      expect(getTheme()).to.eql({
        ...context.Foo,
        ...context.Bar,
      })
    })

    test('handles a "mergeProps" option', () => {
      const props = { foo: 'foo' }
      const merged = { ...props, bar: 'bar' }
      const mergeProps = sinon.spy(() => merged)
      const { wrapper } = setup({ props, config: { mergeProps } })
      expect(wrapper.find(Foo).props()).to.eql(merged)
      expect(mergeProps.calledWith(props, { theme: undefined, ref: undefined })).to.equal(true)
    })

    test('handles existing static properties', () => {
      const { Themed } = setup()
      expect(Themed.foo).to.equal('foo')
    })

    test('exposes the wrapped component', () => {
      const { Themed } = setup()
      expect(Themed.WrappedComponent).to.equal(Foo)
    })

    describe('when handling a Themed component', () => {
      const Bar = themed(context.Bar, { pure: true })(Foo)

      test('handles a undefined theme', () => {
        const { getTheme } = setup({ component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      test('handles a null theme', () => {
        const { getTheme } = setup({ theme: null, component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      test('handles a false theme', () => {
        const { getTheme } = setup({ theme: false, component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      test('handles a number theme', () => {
        const { getTheme } = setup({ theme: 1, component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      test('handles a object theme', () => {
        const { getTheme } = setup({ theme: context.Foo, component: Bar })
        expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
      })

      test('handles a string theme', () => {
        const { getTheme } = setup({ theme: 'Foo', component: Bar })
        expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
      })

      test('handles a wildcard theme', () => {
        const { getTheme } = setup({ theme: '*', component: Bar })
        expect(getTheme()).to.eql({
          ...context,
          ...context.Bar,
        })
      })

      test('handles an array theme', () => {
        const { getTheme } = setup({ theme: ['Foo'], component: Bar })
        expect(getTheme()).to.eql({ ...context.Bar, Foo: context.Foo })
      })

      test('handles a regex theme', () => {
        const { getTheme } = setup({ theme: /^Baz/, component: Bar })
        expect(getTheme()).to.eql({
          ...context.Bar,
          Baz: context.Baz,
        })
      })

      test('handles a function theme', () => {
        const spy = sinon.spy(() => context.Foo)
        const { getTheme } = setup({ theme: spy, component: Bar })
        expect(getTheme()).to.equal(context.Foo)
        expect(spy.calledWith(context.Bar, context)).to.equal(true)
      })

      test('merges the previous config', () => {
        const { Themed } = setup({ component: Bar, config: { propName: 'styles' } })
        expect(Themed[CONFIG_KEY].pure).to.equal(true)
        expect(Themed[CONFIG_KEY].propName).to.equal('styles')
      })

      test('does not mutate the previous config', () => {
        setup({ component: Bar, config: { propName: 'styles' } })
        expect(Bar[CONFIG_KEY].propName).to.equal('theme')
      })
    })
  })

  describe('component', () => {
    test('handles a undefined theme', () => {
      const { getTheme } = setup({ theme: context.Foo })
      expect(getTheme()).to.eql(context.Foo)
    })

    test('handles a null theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: null } })
      expect(getTheme()).to.eql(context.Foo)
    })

    test('handles a object theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: context.Bar } })
      expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
    })

    test('handles a string theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: 'Bar' } })
      expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
    })

    test('handles an array theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: ['Bar'] } })
      expect(getTheme()).to.eql({ ...context.Foo, Bar: context.Bar })
    })

    test('handles a function theme', () => {
      const spy = sinon.spy(() => context.Bar)
      const { getTheme } = setup({ theme: context.Foo, props: { theme: spy } })
      expect(getTheme()).to.equal(context.Bar)
      expect(spy.calledWith(context.Foo, context)).to.equal(true)
    })

    test('handles child props', () => {
      const { wrapper } = setup({ props: { bar: 'bar' } })
      expect(wrapper.find(Foo).prop('bar')).to.equal('bar')
    })

    test('handles a "childRef" prop', () => {
      const Bar = themed()(Foo)
      const spy = sinon.spy()
      mount(createElement(Bar, { childRef: spy }))
      expect(spy.called).to.equal(true)
    })

    test('caches themes', () => {
      const { wrapper, themewrapper } = setup()
      const spy = sinon.spy(themewrapper().instance(), 'buildTheme')

      wrapper.setProps({})
      expect(spy.callCount).to.equal(0)
    })

    test('builds theme when theme prop updates', () => {
      const {
        wrapper,
        themewrapper,
        getTheme,
        Themed,
      } = setup({ theme: context.Foo })
      const spy = sinon.spy(themewrapper().instance(), 'buildTheme')
      wrapper.setProps({ children: <Themed theme={ context.Bar }/> })

      expect(spy.callCount).to.equal(1)
      expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
    })
  })

  describe('extend', () => {
    test('returns a configured decorator', () => {
      const propName = 'styles'
      const styled = themed.extend({ propName })
      expect(styled.defaults.propName).to.equal(propName)
    })
  })
})
