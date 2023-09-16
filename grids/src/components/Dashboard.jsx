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

    <Title level={2}>All time summary:</Title>
    <AllTimeTotals/>
    <Divider style={{ borderTopWidth: 2 }}/>
    </>
  )
}

export default Dashboard