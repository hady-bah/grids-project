import React from 'react'
import { Timeline } from 'antd';

function FeeGuide() {
  return (
    <>
    <Timeline
    mode="alternate"
    items={[
      {
        children: 'Create a services site 2015-09-01',
      },
      {
        children: 'Solve initial network problems 2015-09-01',
        color: 'green',
      },

        ]}
      />
    </>
  )
}

export default FeeGuide