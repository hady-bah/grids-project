import React from 'react'
import AllTimeTotals from './AllTimeTotals'
import { Divider, Typography } from 'antd';
import LearnDataGrid from './LearnDataGrid';

function Dashboard() {
  const { Title } = Typography;
  return (
    <>
    <Title>Dashboard</Title>
    <Divider style={{ borderTopWidth: 5 }}/>
    <LearnDataGrid/>
    <Divider style={{ borderTopWidth: 2 }}/>

    <Divider style={{ borderTopWidth: 5, borderTop: '2px solid #000' }}/>
    <AllTimeTotals/>
    <Divider style={{ borderTopWidth: 5, borderTop: '2px solid #000' }}/>
    
    </>
  )
}

export default Dashboard