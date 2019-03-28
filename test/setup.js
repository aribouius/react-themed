import { JSDOM } from 'jsdom'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  })
}

const jsdom = new JSDOM()
const { window } = jsdom

global.window = window
global.document = window.document

global.requestAnimationFrame = callback => {
  return setTimeout(callback, 0);
}

global.cancelAnimationFrame = id => {
  clearTimeout(id)
}

copyProps(window, global)

configure({ adapter: new Adapter() })
