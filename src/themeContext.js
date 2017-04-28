import PropTypes from 'prop-types'
import { CONTEXT_KEY } from './const'

export default target => Object.assign(target, {
  contextTypes: {
    [CONTEXT_KEY]: PropTypes.object.isRequired,
    ...target.contextTypes,
  },
})
