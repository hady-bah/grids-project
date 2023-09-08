import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import Transfers from './Transfers';



function Grids() {
  return (
    <div>

      <div>
        <Transfers/>
      </div>

    </div>
  )
}

export default Grids