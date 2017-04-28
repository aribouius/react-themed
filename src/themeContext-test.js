import React from 'react'
import PropTypes from 'prop-types'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import themeContext from './themeContext'
import { CONTEXT_KEY } from './const'

describe('themeContext', () => {
  it('assigns a `theme` context type', () => {
    const Foo = themeContext(() => null)
    const context = { [CONTEXT_KEY]: { foo: 'foo' } }
    const wrapper = shallow(<Foo />, { context })
    expect(wrapper.context()).to.eql(context)
  })

  it('merges existing context types', () => {
    const Foo = () => null
    Foo.contextTypes = { bar: PropTypes.string }
    const Bar = themeContext(Foo)
    const context = { [CONTEXT_KEY]: { foo: 'foo' }, bar: 'bar' }
    const wrapper = shallow(<Bar />, { context })
    expect(wrapper.context()).to.eql(context)
  })
})
