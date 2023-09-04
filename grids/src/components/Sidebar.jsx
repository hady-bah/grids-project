import React, { useState } from 'react';
import {
  DesktopOutlined,
  DatabaseOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Home', '1', <HomeOutlined />),
  getItem('Dashboard', '2', <DesktopOutlined />),
  getItem('Grids', '9', <DatabaseOutlined />),
  getItem('Admins', 'sub1', <UserOutlined />, [
    getItem('Hady Bah', '3'),
    getItem('Abdourahamane Ly', '4'),
    getItem('Amadou Diallo', '5'),
    getItem('Abdoulaye Diallo', '10'),
  ]),
  getItem('Customers', 'sub2', <TeamOutlined />, [getItem('Person 1', '6'), getItem('Person 2', '8')]),
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div style={{display:'flex'}}>
        <Layout
        style={{
            minHeight: '100vh',
            
        }}
        >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        </Layout>
    </div>
  )
}

export default Sidebar


// import React from 'react'
// import { useState } from 'react'
// import {Menu} from 'antd'

// function Sidebar() {
//   return (
//     <div style={{display: 'flex', flexDirection:'row'}}>
//         <Menu items={[
//             {label:'Home'},
//             {label:'Profile'},
//             {label:'Dashboard'},
//             {label:'User List'},
//             {label:'Settings'},
//             {label:'Sign Out'},]}
//             ></Menu>
//     </div>
//   )
// }

// export default Sidebar