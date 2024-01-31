import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../../createClient";
import { AutoComplete } from "antd";
import {
  InfoCircleOutlined,
  FormOutlined,
  ScissorOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
  Badge,
  Calendar,
  theme,
} from "antd";

import "../styles/styles.css";

function AddCustomer() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { Title } = Typography;

  const openSuccesNotification = () => {
    notification.success({
      message: "Customer added",
      description: "The customer was successfully saved to the database.",
      placement: "bottomRight",
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Error",
      description: "Unable to add customer.",
      placement: "bottomRight",
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    console.log("Form Values:", values);
    const { data, error } = await supabase.from("customers").insert([values]);

    if (error) {
      openErrorNotification();
      console.error("Supabase Error:", error);
    } else {
      openSuccesNotification(); // Display success message
      form.resetFields();
    }
  };


  return (
    <>
      <div className="receipt-content-layout">
        <div>
          <Badge.Ribbon
            text={
              <span>
                <FormOutlined style={{ marginRight: "8px" }} />
                New Customer
              </span>
            }
            placement="start"
          >
            <Card
              hoverable
              style={{ width: 500, cursor: "default", paddingTop: "20px"}}
            >
              <Form
                name="Customers"
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
                
                <Form.Item
                  label="Name"
                  required
                  tooltip="This is a required field"
                >
                  <Space>
                    <Form.Item
                      name="name"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Name is required",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: 270,
                        }}
                        placeholder="Customer Name"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="Number"
                  required
                  tooltip="This is a required field"
                >
                  <Space>
                    <Form.Item
                      name="number"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Number is required",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{
                          width: 270,
                        }}
                        placeholder="Phone Number"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="Email"
                  required
                  tooltip="Optional"
                >
                  <Space>
                    <Form.Item
                      name="email"
                      noStyle
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: 270,
                        }}
                        placeholder="Email Address"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item label=" " colon={false}>
                  <div style={{ display: "flex", marginTop: "20px" }}>
                    <Button type="primary" htmlType="submit" size="default">
                      Submit
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={onReset}
                      style={{ marginLeft: "10px" }}
                      size="default"
                    >
                      Reset
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          </Badge.Ribbon>
        </div>
      </div>
    </>
  );
}

export default AddCustomer