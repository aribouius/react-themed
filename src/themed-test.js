import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import themed from './themed'

describe('themed', () => {
  const Foo = () => null
  const theme = { foo: 'foo' }
  const context = { theme }

  it('provides a `theme` prop', () => {
    const Bar = themed()(Foo)
    const wrapper = shallow(<Bar />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.eql(theme)
  })

  it('passes through props', () => {
    const Bar = themed()(Foo)
    const wrapper = shallow(<Bar bar="bar" />, { context })
    expect(wrapper.find(Foo).prop('bar')).to.equal('bar')
  })

  it('merges theme props', () => {
    const Bar = themed()(Foo)
    const wrapper = shallow(<Bar theme="foo" />, { context })
    expect(wrapper.find(Foo).prop('theme')).to.equal('foo')
  })

  it('accepts a method for mapping theme to props', () => {
    const Bar = themed(styles => ({ styles }))(Foo)
    const wrapper = shallow(<Bar />, { context })
    expect(wrapper.find(Foo).prop('styles')).to.eql(theme)
  })

  it('accepts a method for merging props', () => {
    const props = { baz: 'baz' }
    const Bar = themed(null, () => props)(Foo)
    const wrapper = shallow(<Bar theme="foo" />, { context })
    expect(wrapper.find(Foo).props()).to.eql(props)
  })
})
