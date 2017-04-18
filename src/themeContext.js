import PropTypes from 'prop-types'

export default target => Object.assign(target, {
  contextTypes: {
    theme: PropTypes.object.isRequired,
    ...target.contextTypes,
  },
})
