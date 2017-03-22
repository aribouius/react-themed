import React, { PropTypes } from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import Provider from './ThemeProvider'

describe('ThemeProvider', () => {
  const Foo = () => null
  Foo.contextTypes = { theme: PropTypes.object }

  it('provides a `theme` context', () => {
    const theme = { foo: 'foo' }
    const wrapper = mount(<Provider theme={theme} children={<Foo />} />)
    expect(wrapper.find(Foo).get(0).context).to.eql({ theme })
  })
})
