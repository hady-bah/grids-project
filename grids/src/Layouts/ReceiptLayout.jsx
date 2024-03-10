import React from 'react'
import Receipt from '../components/Receipt'
import { Divider } from 'antd'

function ReceiptLayout() {
  return (
    <>
    <span class="gradient-text">New Transfer</span>
    <Divider style={{ borderTopWidth: 2 }} />
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
        <Receipt/>
        </div>
        <div>
            <p>Guide</p>
        </div>
    </div>
    </>
  )
}

export default ReceiptLayout