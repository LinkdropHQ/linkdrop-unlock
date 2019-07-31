import React from 'react'
import variables from 'variables'

const CloseBtn = props => (
  <svg width={21} height={22} fill='none' {...props} onClick={_ => props.onClick && props.onClick()}>
    <path
      d='M14.357 7.143a.26.26 0 0 0-.367 0l-3.49 3.49-3.49-3.49a.26.26 0 0 0-.367.368L10.133 11l-3.49 3.49a.26.26 0 1 0 .367.367l3.49-3.49 3.49 3.49a.26.26 0 1 0 .367-.367L10.867 11l3.49-3.49a.26.26 0 0 0 0-.367z'
      fill={props.fill || variables.blackColor}
      stroke={props.fill || variables.blackColor}
      strokeWidth={0.5}
    />
    <path
      d='M10.5 1a10 10 0 1 0 10 10 10.011 10.011 0 0 0-10-10zm0 19.48A9.48 9.48 0 1 1 19.98 11a9.492 9.492 0 0 1-9.48 9.48z'
      fill={props.fill || variables.blackColor}
      stroke={props.fill || variables.blackColor}
      strokeWidth={0.5}
    />
  </svg>
)

export default CloseBtn
