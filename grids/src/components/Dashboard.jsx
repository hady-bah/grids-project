import React from 'react'
import AllTimeTotals from './AllTimeTotals'
import { Divider, Typography } from 'antd';
import LearnDataGrid from './LearnDataGrid';
import TotalCharts from './TotalCharts';

function Dashboard() {
  const { Title } = Typography;
  return (
    <>
    <span class="gradient-text">Dashboard</span>
    <Divider style={{ borderTopWidth: 2 }} />
  
    <div style={{display:'flex', justifyContent:'center', paddingBottom:'15px'}}>
    <Title level={3}>All Time Summary</Title>
    </div>
    <div style={{paddingTop: '10px', display:'flex', justifyContent:'center'}}>
    <AllTimeTotals/>
    </div>
    <Divider style={{ borderTopWidth: 2 }} />

    <div style={{display:'flex', justifyContent:'center', paddingBottom:'15px'}}>
    <Title level={3}>TOTW</Title>
    </div>
    <div style={{ width: '100%', height: '400px' }}>
    <TotalCharts />
    </div>
    
    </>
  )
}

export default Dashboard