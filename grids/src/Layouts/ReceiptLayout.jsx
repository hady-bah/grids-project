import React, {useState, } from 'react'
import Receipt from '../components/Receipt'
import { Divider, Drawer, Button, Tooltip} from 'antd'
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
    <div style={{textAlign: 'right', paddingRight: '16px'}}>
    <Tooltip title="Fee Calculator" placement="left">  
    <Button icon={<CalculatorOutlined/>} type="primary" onClick={showDrawer}/>

    </Tooltip>
        <Drawer title="Fee Calculator" onClose={onClose} open={open}>
        <FeeGuide/>
      </Drawer>
    </div>
    <div>
        <div>
        <Receipt/>
        </div>
    </div>
    </>
  )
}

export default ReceiptLayout