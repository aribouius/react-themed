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

  it('allows theme prop override', () => {
    const Bar = themed()(Foo)
    const theme = { bar: 'bar' }
    const wrapper = shallow(<Bar theme={theme} />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql(theme)
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
})
