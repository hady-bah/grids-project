import React, {useState, } from 'react'
import Receipt from '../components/Receipt'
import { Divider, Drawer, Button } from 'antd'
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
    <div>
    <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
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