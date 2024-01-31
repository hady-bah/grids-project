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

function AddPlace() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { Title } = Typography;

  const openSuccesNotification = () => {
    notification.success({
      message: "Place added",
      description: "The place was successfully saved to the database.",
      placement: "bottomRight",
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Error",
      description: "Unable to add place.",
      placement: "bottomRight",
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    console.log("Form Values:", values);
    const { data, error } = await supabase.from("places").insert([values]);

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
                New Place
              </span>
            }
            placement="start"
          >
            <Card
              hoverable
              style={{ width: 500, cursor: "default", paddingTop: "20px"}}
            >
              <Form
                name="Place"
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
                        placeholder="City, Country"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="Address"
                  required
                  tooltip="This is a required field"
                >
                  <Space>
                    <Form.Item
                      name="address"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Address is required",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: 270,
                        }}
                        placeholder="Full Address"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="Operator"
                  required
                  tooltip="This is a required field"
                >
                  <Space>
                    <Form.Item
                      name="operator"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Operator is required",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: 270,
                        }}
                        placeholder="Full Name"
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
                        placeholder="Operator Number"
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

export default AddPlace