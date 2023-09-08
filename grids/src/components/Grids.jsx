import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import AsGrid from './AsGrid';



function Grids() {
  return (
    <div>

      <div>
        <AsGrid/>
      </div>

    </div>
  )
}

export default Grids