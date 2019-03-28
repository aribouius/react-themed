const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

const isNode = typeof process !== 'undefined'
  && process.versions != null
  && process.versions.node != null

const isEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object

export {
  isBrowser,
  isNode,
  isEmpty,
}
