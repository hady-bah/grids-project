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
  

    <div style={{paddingTop: '20px'}}>
    <AllTimeTotals/>
    </div>
    
    <div style={{paddingTop: '20px'}}>
    <DailyTotals/>
    </div>
    
    
    
    </>
  )
}

export default Dashboard