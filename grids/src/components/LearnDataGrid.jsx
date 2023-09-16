import React from 'react';
import { Collapse, Divider, Typography } from 'antd';
import Dashboard from './Dashboard';


function LearnDataGrid() {
  return (
    <div>
    <Collapse
      items={[
        {
          key: '1',
          label: 'Summary in depth',
          children: <p>explain totals</p>,
        },
      ]}
    />
    </div>
  )
}

export default LearnDataGrid