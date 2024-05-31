import React, {useState, } from 'react'
import Receipt from '../components/Receipt'
import { Divider, Drawer, Button, Tooltip, FloatButton} from 'antd'
import {
  CalculatorOutlined,
} from "@ant-design/icons";
import FeeGuide from '../components/FeeGuide'

function ReceiptLayout() {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
    <span class="gradient-text">New Transfer</span>
    <Divider style={{ borderTopWidth: 2 }} />
    
    <Tooltip title="Fee Calculator" placement="left">  
    <FloatButton icon={<CalculatorOutlined/>} type="primary" onClick={showDrawer}/>
    </Tooltip>

    <Drawer title="Fee Calculator" onClose={onClose} open={open}>
      <FeeGuide/>
    </Drawer>
    <div>
        <div>
        <Receipt/>
        </div>
    </div>
    </>
  )
}

export default ReceiptLayout