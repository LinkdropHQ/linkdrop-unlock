import React from 'react'
import variables from 'variables'

const SvgVector1 = props => (
  <svg width={6} height={40} fill='none' {...props}>
    <path
      d='M2.71.012a1.95 1.95 0 0 0-1.735 1.98v21.44a1.95 1.95 0 1 0 3.898 0V1.992A1.95 1.95 0 0 0 2.71.011zm.214 34.14a2.924 2.924 0 1 0 0 5.848 2.924 2.924 0 0 0 0-5.848z'
      fill={props.fill || variables.blackColor}
    />
  </svg>
)

export default SvgVector1
