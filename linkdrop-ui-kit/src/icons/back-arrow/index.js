import React from 'react'
import variables from 'variables'

const BackArrow = props => (
  <svg width={12} height={22} fill='none' {...props}>
    <path
      d='M10.293 21.707a1 1 0 0 0 1.414-1.414l-1.414 1.414zM1 11l-.707-.707a1 1 0 0 0 0 1.414L1 11zm10.707-9.293A1 1 0 0 0 10.293.293l1.414 1.414zm0 18.586l-10-10-1.414 1.414 10 10 1.414-1.414zm-10-8.586l10-10L10.293.293l-10 10 1.414 1.414z'
      fill={props.fill || variables.blackColor}
    />
  </svg>
)

export default BackArrow
