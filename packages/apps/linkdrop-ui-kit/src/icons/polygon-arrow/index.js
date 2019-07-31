import React from 'react'
import variables from 'variables'

const PolygonArrow = props => (
  <svg width={13} height={11} fill='none' {...props}>
    <path d='M6.146 11L.124.5h12.044L6.146 11z' fill={props.fill || variables.blackColor} />
  </svg>
)

export default PolygonArrow
