import React from 'react'
import variables from 'variables'

const Check = props => (
  <svg width={33} height={21} fill='none' {...props}>
    <path
      d='M11.216 18.931h0L1.963 9.477s0 0 0 0a2.323 2.323 0 0 1 .036-3.285L2 6.19a2.321 2.321 0 0 1 3.284.038h0l7.429 7.588.323.33.355-.296L28.485 1.24a2.324 2.324 0 0 1 2.98 3.567c.001 0 0 0 0 0L14.369 19.09s0 0 0 0a2.32 2.32 0 0 1-1.491.54 2.312 2.312 0 0 1-1.66-.698z'
      fill={props.fill || variables.blackColor}
      stroke={props.stroke || variables.whiteColor}
    />
  </svg>
)

export default Check
