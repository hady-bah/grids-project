import React from 'react'
import Receipt from '../components/Receipt'
import { Divider } from 'antd'
import FeeGuide from '../components/FeeGuide'

function ReceiptLayout() {
  return (
    <>
    <span class="gradient-text">New Transfer</span>
    <Divider style={{ borderTopWidth: 2 }} />
    <div>
        <div>
        <Receipt/>
        </div>
    </div>
    </>
  )
}

export default ReceiptLayout