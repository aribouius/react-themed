import { PropTypes } from 'react'

export default target => Object.assign(target, {
  contextTypes: {
    theme: PropTypes.object.isRequired,
    ...target.contextTypes,
  },
})
