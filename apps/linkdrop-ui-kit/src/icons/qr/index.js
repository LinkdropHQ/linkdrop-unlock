import React from 'react'
import variables from 'variables'

const Qr = props => (
  <svg width={30} height={30} fill='none' {...props}>
    <path
      d='M2.727 2.727v8.182h8.182V2.727H2.727zM0 0h13.636v13.636H0V0z'
      fill={variables.blackColor}
    />
    <path
      d='M8.182 5.455H5.455v2.727h2.727V5.455zM8.182 21.818H5.455v2.727h2.727v-2.727zM21.818 16.364h-5.454v2.727h5.454v-2.727zM19.09 21.818h-2.726V30h2.727v-8.182zM24.545 27.273h-2.727V30h2.727v-2.727zM27.273 16.364h-2.727v2.727h2.727v-2.727zM24.545 5.455h-2.727v2.727h2.727V5.455z'
      fill={variables.blackColor}
    />
    <path
      d='M19.09 2.727v8.182h8.183V2.727H19.09zM16.365 0H30v13.636H16.364V0zM2.727 19.09v8.183h8.182V19.09H2.727zM0 16.365h13.636V30H0V16.364zM21.818 24.546v-2.728h5.455v2.727h-5.455z'
      fill={variables.blackColor}
    />
    <path d='M30 30h-2.727V16.364H30V30z' fill={variables.blackColor} />
  </svg>
)

export default Qr
