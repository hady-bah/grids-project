import React from 'react'
import {Typography, Divider } from 'antd';
const { Title } = Typography;

function ComingSoon() {
  return (
    <>
    <Title>Coming Soon!</Title>
    <Divider style={{ borderTopWidth: 5 }}/>
    <img alt="Code loading" width ="600" src = "https://cdn.dribbble.com/users/330915/screenshots/3587000/10_coding_dribbble.gif"/>
    </>
  )
}

export default ComingSoon