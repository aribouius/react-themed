import { createElement, Component, PureComponent } from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import themed from './themed'
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
  }

  const setup = ({
    theme,
    config,
    props,
    component = Foo,
    decorator = themed,
  } = {}) => {
    const Themed = decorator(theme, config)(component)
    const wrapper = shallow(createElement(Themed, props), {
      context: { theme: context },
    })

    return {
      Themed,
      wrapper,
      getTheme: () => (
        wrapper.find(Foo).prop('theme')
      ),
    }
  }

  describe('decorator', () => {
    it('handles a undefined theme', () => {
      const { getTheme } = setup()
      expect(getTheme()).to.equal(undefined)
    })

    it('handles a null theme', () => {
      const { getTheme } = setup({ theme: null })
      expect(getTheme()).to.equal(undefined)
    })

    it('handles a false theme', () => {
      const { getTheme } = setup({ theme: false })
      expect(getTheme()).to.equal(undefined)
    })

    it('handles a number theme', () => {
      const { getTheme } = setup({ theme: 1 })
      expect(getTheme()).to.equal(undefined)
    })

    it('handles a object theme', () => {
      const { getTheme } = setup({ theme: context.Foo })
      expect(getTheme()).to.eql(context.Foo)
    })

    it('handles a string theme', () => {
      const { getTheme } = setup({ theme: 'Foo' })
      expect(getTheme()).to.eql(context.Foo)
    })

    it('handles an array theme', () => {
      const { getTheme } = setup({ theme: ['Foo'] })
      expect(getTheme()).to.eql({ Foo: context.Foo })
    })

    it('handles a function theme', () => {
      const spy = sinon.spy(() => context.Foo)
      const { getTheme } = setup({ theme: spy })
      expect(getTheme()).to.equal(context.Foo)
      expect(spy.calledWith(undefined, context)).to.equal(true)
    })

    it('handles a "pure" option', () => {
      const { Themed } = setup({ config: { pure: true } })
      expect(Themed.prototype instanceof PureComponent).to.equal(true)
    })

    it('applies a default "pure" option', () => {
      const { Themed } = setup()
      expect(Themed.prototype instanceof Component).to.equal(true)
    })

    it('handles a "compose" option', () => {
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

    it('handles a "mergeProps" option', () => {
      const props = { foo: 'foo' }
      const merged = { ...props, bar: 'bar' }
      const mergeProps = sinon.spy(() => merged)
      const { wrapper } = setup({ props, config: { mergeProps } })
      expect(wrapper.find(Foo).props()).to.eql(merged)
      expect(mergeProps.calledWith(props, { theme: undefined, ref: undefined })).to.equal(true)
    })

    it('handles existing static properties', () => {
      const { Themed } = setup()
      expect(Themed.foo).to.equal('foo')
    })

    it('exposes the wrapped component', () => {
      const { Themed } = setup()
      expect(Themed.WrappedComponent).to.equal(Foo)
    })

    describe('when handling a Themed component', () => {
      const Bar = themed(context.Bar, { pure: true })(Foo)

      it('handles a undefined theme', () => {
        const { getTheme } = setup({ component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      it('handles a null theme', () => {
        const { getTheme } = setup({ theme: null, component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      it('handles a false theme', () => {
        const { getTheme } = setup({ theme: false, component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      it('handles a number theme', () => {
        const { getTheme } = setup({ theme: 1, component: Bar })
        expect(getTheme()).to.eql(context.Bar)
      })

      it('handles a object theme', () => {
        const { getTheme } = setup({ theme: context.Foo, component: Bar })
        expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
      })

      it('handles a string theme', () => {
        const { getTheme } = setup({ theme: 'Foo', component: Bar })
        expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
      })

      it('handles an array theme', () => {
        const { getTheme } = setup({ theme: ['Foo'], component: Bar })
        expect(getTheme()).to.eql({ ...context.Bar, Foo: context.Foo })
      })

      it('handles a function theme', () => {
        const spy = sinon.spy(() => context.Foo)
        const { getTheme } = setup({ theme: spy, component: Bar })
        expect(getTheme()).to.equal(context.Foo)
        expect(spy.calledWith(context.Bar, context)).to.equal(true)
      })

      it('merges the previous config', () => {
        const { Themed } = setup({ component: Bar, config: { propName: 'styles' } })
        expect(Themed[CONFIG_KEY].pure).to.equal(true)
        expect(Themed[CONFIG_KEY].propName).to.equal('styles')
      })

      it('does not mutate the previous config', () => {
        setup({ component: Bar, config: { propName: 'styles' } })
        expect(Bar[CONFIG_KEY].propName).to.equal('theme')
      })
    })
  })

  describe('component', () => {
    it('handles a undefined theme', () => {
      const { getTheme } = setup({ theme: context.Foo })
      expect(getTheme()).to.eql(context.Foo)
    })

    it('handles a null theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: null } })
      expect(getTheme()).to.eql(context.Foo)
    })

    it('handles a object theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: context.Bar } })
      expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
    })

    it('handles a string theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: 'Bar' } })
      expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
    })

    it('handles an array theme', () => {
      const { getTheme } = setup({ theme: context.Foo, props: { theme: ['Bar'] } })
      expect(getTheme()).to.eql({ ...context.Foo, Bar: context.Bar })
    })

    it('handles a function theme', () => {
      const spy = sinon.spy(() => context.Bar)
      const { getTheme } = setup({ theme: context.Foo, props: { theme: spy } })
      expect(getTheme()).to.equal(context.Bar)
      expect(spy.calledWith(context.Foo, context)).to.equal(true)
    })

    it('handles child props', () => {
      const { wrapper } = setup({ props: { bar: 'bar' } })
      expect(wrapper.find(Foo).prop('bar')).to.equal('bar')
    })

    it('handles a "childRef" prop', () => {
      const Bar = themed()(Foo)
      const spy = sinon.spy()
      mount(createElement(Bar, { childRef: spy }))
      expect(spy.called).to.equal(true)
    })

    it('caches themes', () => {
      const { wrapper } = setup()
      const spy = sinon.spy(wrapper.instance(), 'buildTheme')
      wrapper.setProps({})
      expect(spy.callCount).to.equal(0)
    })

    it('builds theme when theme prop updates', () => {
      const { wrapper, getTheme } = setup({ theme: context.Foo })
      const spy = sinon.spy(wrapper.instance(), 'buildTheme')
      wrapper.setProps({ theme: context.Bar })
      expect(spy.callCount).to.equal(1)
      expect(getTheme()).to.eql({ ...context.Foo, ...context.Bar })
    })
  })

  describe('extend', () => {
    it('returns a configured decorator', () => {
      const propName = 'styles'
      const styled = themed.extend({ propName })
      expect(styled.defaults.propName).to.equal(propName)
    })
  })
})
