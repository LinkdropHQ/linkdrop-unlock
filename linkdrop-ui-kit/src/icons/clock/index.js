import React from 'react'
import variables from 'variables'

const Clock = props => (
  <svg width={48} height={48} fill='none' {...props}>
    <path
      d='M24 48c13.25 0 24-10.75 24-24S37.25 0 24 0 0 10.75 0 24s10.75 24 24 24zm0-44.63c11.39 0 20.63 9.24 20.63 20.63 0 11.39-9.24 20.63-20.63 20.63-11.39 0-20.63-9.24-20.63-20.63C3.37 12.61 12.61 3.37 24 3.37z'
      fill={variables.variables}
    />
    <path
      d='M21.85 26.499l7.729 5.811c.29.232.64.349.988.349.523 0 1.046-.233 1.336-.698.581-.755.407-1.801-.348-2.382l-6.974-5.23V11.622a1.686 1.686 0 0 0-3.37 0v13.54c0 .523.232 1.046.64 1.337z'
      fill={variables.blackColor}
    />
  </svg>
)

export default Clock
