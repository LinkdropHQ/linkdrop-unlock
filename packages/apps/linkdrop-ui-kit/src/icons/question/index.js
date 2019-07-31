import React from 'react'
import variables from 'variables'

const Question = props => (
  <svg width={12} height={21} fill='none' {...props}>
    <path
      d='M4.75 14.682h2.215c0-2.364.582-3.398 2.253-4.414 1.625-.987 2.585-2.41 2.585-4.45 0-2.88-2.105-4.986-5.355-4.986C3.457.832 1.084 2.68.945 5.818h2.327C3.41 3.64 4.934 2.753 6.448 2.753c1.736 0 3.14 1.145 3.14 2.954 0 1.468-.84 2.521-1.921 3.177-1.828 1.107-2.918 2.197-2.918 5.798zm1.181 5.614a1.75 1.75 0 0 0 1.773-1.773A1.75 1.75 0 0 0 5.93 16.75a1.75 1.75 0 0 0-1.773 1.773 1.75 1.75 0 0 0 1.773 1.773z'
      fill={props.fill || variables.blackColor}
    />
  </svg>
)

export default Question
