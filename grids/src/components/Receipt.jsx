import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../createClient';
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
} from "antd";
const { Option } = Select;



function Receipt() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Receipt sent successfully',
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
        console.error(error);
      } else {
        success(); // Display success message
        form.resetFields();
      }
  
  };

  return (
    <Card
    title="New Receipt"
    hoverable
    style={{ width: 350, cursor:'default' }}
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
    >
      <Form.Item label="Place">
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
      <Form.Item label="Code">
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
            <Select placeholder="Label">
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
                width: "70%",
              }}
              placeholder="Number"
            />
          </Form.Item>
        </Space.Compact>
      </Form.Item>
      <Form.Item label="Sender">
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
      <Form.Item label="Receiver">
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

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          {
            required: true,
            message: "Amount is required",
          },
        ]}
      >
        <InputNumber placeholder="$" />
      </Form.Item>

      <Form.Item
        label="Fee"
        name="fee"
        rules={[
          {
            required: true,
            message: "Fee is required",
          },
        ]}
      >
        <InputNumber placeholder="$"/>
      </Form.Item>

      <Form.Item label="Mobile money">
        <Space>
          <Form.Item name="mobileMoney" noStyle>
            <Input
              style={{
                width: 160,
              }}
              placeholder="Number/Blank"
            />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item name="date" label="Date" rules={[
          {
            required: true,
            message: "Date is required",
          },
        ]}>
        <DatePicker />
      </Form.Item>

      <Form.Item label="Status">
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
            <Select placeholder="Status">
              <Option value="Cash">Cash</Option>
              <Option value="Deposit">Deposit</Option>
              <Option value="Not Paid">Not Paid</Option>
            </Select>
          </Form.Item>
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <div style={{display:'flex', marginTop:'20px'}}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset} style={{marginLeft:'10px'}}>
            Reset
          </Button>
        </div>
      </Form.Item>
    </Form>
  </Card>
  );
}
export default Receipt;
