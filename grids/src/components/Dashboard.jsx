import React from 'react'
import AllTimeTotals from './AllTimeTotals'
import { Divider, Typography } from 'antd';
import LearnDataGrid from './LearnDataGrid';
import DailyTotals from './DailyTotals';

function Dashboard() {
  const { Title } = Typography;
  return (
    <>
    <Title>Dashboard</Title>
    <Divider style={{ borderTopWidth: 5 }}/>
    <LearnDataGrid/>
  

    <Divider style={{ borderTopWidth: 5}}/>
    <DailyTotals/>
    <Divider style={{ borderTopWidth: 5}}/>

    
    <AllTimeTotals/>
    <Divider style={{ borderTopWidth: 5}}/>
    
    
    </>
  )
}

export default Dashboard