import React from 'react'
import variables from 'variables'

const Cross = props => (
  <svg width={34} height={34} fill='none' {...props}>
    <path
      d='M1.835 32.165A2.786 2.786 0 0 0 3.852 33c.765 0 1.461-.278 2.018-.835L17 21.035l11.13 11.13a2.786 2.786 0 0 0 2.018.835c.765 0 1.46-.278 2.017-.835a2.855 2.855 0 0 0 0-4.035L21.035 17l11.13-11.13a2.855 2.855 0 0 0 0-4.035 2.855 2.855 0 0 0-4.035 0L17 12.965 5.87 1.835a2.855 2.855 0 0 0-4.035 0 2.855 2.855 0 0 0 0 4.035L12.965 17 1.835 28.13a2.855 2.855 0 0 0 0 4.035z'
      fill={variables.blackColor}
      stroke={variables.whiteColor}
      strokeWidth={1.5}
    />
  </svg>
)

export default Cross
