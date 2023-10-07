import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../createClient';
import { InfoCircleOutlined, FormOutlined, ScissorOutlined   } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Select,
  message,
  Space,
  InputNumber,
  DatePicker,
  Card,
  Tooltip,
  Typography,
  Divider,
  Radio, 
  Tag,
  notification,
} from "antd";
const { Option } = Select;



function Receipt() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { Title } = Typography;

  const openSuccesNotification = () => {
    notification.success({
      message: 'Receipt Sent',
      description: 
        'The receipt was successfully saved to the database.',
      placement: 'bottomRight'
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: 'Error',
      description: 
        'Unable to send reciept.',
      placement: 'bottomRight'
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {

    const { data, error } = await supabase
      .from('transfers')
      .insert([
        values
      ])
  
      if (error) {
        openErrorNotification();
      } else {
        openSuccesNotification(); // Display success message
        // Print receipt
    const text = 
    `Place: ${values.place}\n` +
    `Code: ${values.label} ${values.codeNumber}\n` +  
    `Sender: ${values.sender}\n` +
    `Receiver: ${values.receiver}\n` +
    `Amount: $${values.amount}\n` +
    `Fee: $${values.fee}\n` +
    `Mobile: ${values.mobileMoney || 'N/A'}\n` +
    `Date: ${values.date.format('YYYY-MM-DD')}\n` +
    `Status: ${values.status}\n`;
  
        printReceipt(text);
        form.resetFields();
      }

  };

  const printReceipt = (text) => {
    const printWindow = window.open();
    printWindow.document.write(text);
    printWindow.print();
    printWindow.close();
  }

  return (
  <>
    
    <Card
    title={
      <span>
        <FormOutlined  style={{ marginRight: '8px' }} />
        New Receipt
      </span>
    }
    hoverable
    style={{ width: 500, cursor:'default' }}
    >
    <Form
      name="Receipt"
      onFinish={onFinish}
      form={form}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      size="large"
    >
      <Form.Item label="Place" required tooltip="This is a required field">
        <Space>
          <Form.Item
            name="place"
            noStyle
            rules={[
              {
                required: true,
                message: "Place is required",
              },
            ]}
          >
            <Input
              style={{
                width: 160,
              }}
              placeholder="City/Country"
            />
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item label="Code" required tooltip="This is a required field">
        <Space.Compact>
          <Form.Item
            name="label"
            noStyle
            rules={[
              {
                required: true,
                message: "Label is required",
              },
            ]}
          >
            <Select placeholder="Label" style={{ width: '100px' }}>
              <Option value="AS">AS</Option>
              <Option value="BL">BL</Option>
              <Option value="AC">AC</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="codeNumber"
            noStyle
            rules={[
              {
                required: true,
                message: "Code number is required",
              },
            ]}
          >
            <Input
              style={{
                width: "150px",
              }}
              placeholder="Number"
            />
          </Form.Item>
        </Space.Compact>
      </Form.Item>
      <Form.Item label="Sender" required tooltip="This is a required field">
        <Space>
          <Form.Item
            name="sender"
            noStyle
            rules={[
              {
                required: true,
                message: "Sender is required",
              },
            ]}
          >
            <Input
              style={{
                width: 160,
              }}
              placeholder="Full name"
            />
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item label="Receiver" required tooltip="This is a required field">
        <Space>
          <Form.Item
            name="receiver"
            noStyle
            rules={[
              {
                required: true,
                message: "Receiver is required",
              },
            ]}
          >
            <Input
              style={{
                width: 160,
              }}
              placeholder="Full name"
            />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item label="Amount" required tooltip="This is a required field">
        <Space>
          <Form.Item
            name="amount"
            noStyle
            rules={[
              {
                required: true,
                message: "Amount is required",
              },
            ]}
          >
            <InputNumber
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              style={{
                width: 160,
              }}
              placeholder="$"
              step={0.01} 
              precision={2}
            />
          </Form.Item>
        </Space>
        </Form.Item>

        <Form.Item label="Fee" required tooltip="This is a required field">
        <Space>
          <Form.Item
            name="fee"
            noStyle
            rules={[
              {
                required: true,
                message: "Fee is required",
              },
            ]}
          >
            <InputNumber
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                style={{
                  width: 160,
                }}
                placeholder="$"
                step={0.01} 
                precision={2}
            />
          </Form.Item>
        </Space>
        </Form.Item>

      <Form.Item label="Mobile" tooltip="Optional field">
        <Space>
          <Form.Item name="mobileMoney" noStyle>
            <Input
              style={{
                width: 160,
              }}
              placeholder="Number"
            />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item label="Date" required tooltip="This is a required field">
        <Space>
          <Form.Item
            name="date"
            noStyle
            rules={[
              {
                required: true,
                message: "Date is required",
              },
            ]}
          >
            <DatePicker/>
          </Form.Item>
        </Space>
        </Form.Item>

      <Form.Item label="Status" required tooltip="This is a required field">
          <Form.Item
            name="status"
            noStyle
            rules={[
              {
                required: true,
                message: "Status is required",
              },
            ]}
          >
            <Select placeholder="Status" style={{ width: '155px' }}>
              <Option value="Cash">Cash</Option>
              <Option value="Deposit">Deposit</Option>
              {/* <Option value="Not Paid">Not Paid</Option> */}
            </Select>
          </Form.Item>
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <div style={{display:'flex', marginTop:'20px'}}>
          <Button type="primary" htmlType="submit" size="default">
            Submit & Print
          </Button>
          <Button htmlType="button" onClick={onReset} style={{marginLeft:'10px'}} size="default">
            Reset
          </Button>
        </div>
      </Form.Item>
    </Form>
  </Card>
  </>
  );
}
export default Receipt;
