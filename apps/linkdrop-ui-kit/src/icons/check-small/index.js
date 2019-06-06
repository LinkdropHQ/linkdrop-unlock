import React from 'react'
import variables from 'variables'

const CheckSmall = props => (
  <svg width={22} height={14} fill='none' {...props}>
    <path
      d='M7.277 13.058h0L.914 6.417s0 0 0 0A1.513 1.513 0 0 1 .938 4.31h0a1.41 1.41 0 0 1 2.03.023h0l5.107 5.331.326.34.36-.306L19.137.842a1.414 1.414 0 0 1 2.024.187 1.514 1.514 0 0 1-.183 2.097L9.224 13.158s0 0 0 0a1.414 1.414 0 0 1-1.947-.1z'
      fill={props.fill || variables.greenColor}
      stroke={props.stroke || variables.whiteColor}
    />
  </svg>
)

export default CheckSmall
