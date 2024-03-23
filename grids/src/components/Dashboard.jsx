import React from 'react'
import AllTimeTotals from './AllTimeTotals'
import { Divider, Typography } from 'antd';
import LearnDataGrid from './LearnDataGrid';
import DailyTotals from './DailyTotals';

function Dashboard() {
  const { Title } = Typography;
  return (
    <>
    <span class="gradient-text">Dashboard</span>
    <Divider style={{ borderTopWidth: 2 }} />
  
    <div style={{paddingTop: '10px'}}>
    <Title level={2}>Summary</Title>
    <AllTimeTotals/>
    </div>
    <Divider style={{ borderTopWidth: 2 }} />

    <div>
    <Title level={2}>Chart</Title>
    </div>
    
    </>
  )
}

export default Dashboard