import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import themed from './themed'

describe('themed', () => {
  const Foo = () => null
  const context = { theme: { Foo: { foo: 'foo' } } }

  it('provides context theme as `theme` prop', () => {
    const Bar = themed()(Foo)
    const wrapper = shallow(<Bar />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql(context.theme)
  })

  it('accepts string theme selector', () => {
    const Bar = themed('Foo')(Foo)
    const wrapper = shallow(<Bar />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql(context.theme.Foo)
  })

  it('accepts function theme selector', () => {
    const Bar = themed(theme => theme.Foo)(Foo)
    const wrapper = shallow(<Bar />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql(context.theme.Foo)
  })

  it('passes through props', () => {
    const Bar = themed()(Foo)
    const wrapper = shallow(<Bar bar="bar" />, { context })
    expect(wrapper.find(Foo).prop('bar')).to.equal('bar')
  })

  it('overrides theme prop by default', () => {
    const Bar = themed()(Foo)
    const theme = { bar: 'bar' }
    const wrapper = shallow(<Bar theme={theme} />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql(theme)
  })

  it('can be configured to compose passed in theme', () => {
    const Bar = themed('Foo')(Foo)
    const theme = { foo: 'bar' }
    const config = { compose: true }
    const wrapper = shallow(<Bar theme={theme} themeConfig={config} />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql({
      foo: 'foo bar',
    })
  })

  it('can be configured to compose passed in theme using a custom function', () => {
    const Bar = themed('Foo')(Foo)
    const theme = { bar: 'bar' }
    const merge = (...args) => Object.assign({ baz: 'baz' }, ...args)
    const config = { compose: merge }
    const wrapper = shallow(<Bar theme={theme} themeConfig={config} />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    })
  })

  it('supports custom theme prop name', () => {
    const Bar = themed(null, { propName: 'styles' })(Foo)
    const wrapper = shallow(<Bar />, { context })
    expect(wrapper.find(Foo).props()).to.eql({
      styles: context.theme,
    })
  })

  it('supports custom function for merging props', () => {
    const mergeProps = (one, two) => ({ ...one, ...two, foo: 'foo' })
    const Bar = themed(null, { mergeProps })(Foo)
    const wrapper = shallow(<Bar bar="bar" />, { context })
    expect(wrapper.find(Foo).props()).to.eql({
      foo: 'foo',
      bar: 'bar',
      theme: context.theme,
    })
  })

  describe('setDefaults', () => {
    it('assigns default global options for `themed`', () => {
      themed.setDefaults({ propName: 'foo' })
      const Bar = themed('Foo')(Foo)
      const wrapper = shallow(<Bar />, { context })
      expect(wrapper.find(Foo).prop('foo')).to.eql(context.theme.Foo)
      themed.setDefaults({ propName: 'theme' })
    })
  })
})
