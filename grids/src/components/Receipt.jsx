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

const { Option } = Select;

function Receipt() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { Title } = Typography;
  const [loadings, setLoadings] = useState([]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    generateUniqueCode().then(() => {
      // Use .then() to wait for the promise to resolve
      setTimeout(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      }, 500);
    });
  };

  const openSuccesNotification = () => {
    notification.success({
      message: "Receipt Sent",
      description: "The receipt was successfully saved to the database.",
      placement: "bottomRight",
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Error",
      description: "Unable to send reciept.",
      placement: "bottomRight",
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    console.log("Form Values:", values);
    const { data, error } = await supabase.from("transfers").insert([values]);

    if (error) {
      openErrorNotification();
      console.error("Supabase Error:", error);
    } else {
      openSuccesNotification(); // Display success message
      // Print receipt
      const text =
        `Code: <strong>${values.codeNumber}</strong> <br />` +
        `Label: ${values.label}<br />` +
        `Place: ${values.place}<br />` +
        `Sender: ${values.sender}<br />` +
        `Receiver: ${values.receiver}<br />` +
        `Amount: $${values.amount}<br />` +
        `Fee: $${values.fee}<br />` +
        `Mobile: ${values.mobileMoney || "N/A"}<br />` +
        `Status: ${values.status}<br />`;

      printReceipt(text);
      form.resetFields();
    }
  };

  const printReceipt = (text) => {
    const printWindow = window.open();
    printWindow.document.write(text);
    printWindow.print();
    printWindow.close();
  };

  //supabase setup
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
    generateUniqueCode();
  }, []);

  async function fetchPlaces() {
    const { data } = await supabase
      .from("places")
      .select("name")
      .order("name", { ascending: false });
    setPlaces(data);
  }

  //generate code
  const [code, setCode] = useState("");

  async function generateUniqueCode() {
    const existingCodes = await fetchCodesFromDatabase();
    const totalPossibleCodes = 10 ** 8; // Assuming there are 10^8 possible codes
    // console.log(existingCodes);

    if (existingCodes.length >= totalPossibleCodes) {
      // Handle the case when all possible codes are used
      notification.error({
        message: "Error",
        description: "All possible codes are used.",
        placement: "bottomRight",
      });
      return;
    }

    let newCode;
    do {
      newCode = generateCode();
    } while (existingCodes.includes(newCode));

    setCode(newCode);
  }

  async function fetchCodesFromDatabase() {
    // Fetch existing codes from your database (replace 'code' with your actual column name)
    const { data, error } = await supabase
      .from("transfers")
      .select("codeNumber");
    if (error) {
      console.error("Error fetching codes:", error);
      return [];
    }
    return data.map((item) => item.codeNumber);
  }

  function generateCode() {
    let code = [];

    for (let i = 0; i < 8; i++) {
      code.push(Math.floor(Math.random() * 10));
    }

    let finalCode =
      "B" +
      code[0] +
      code[1] +
      code[2] +
      "A" +
      code[3] +
      code[4] +
      "H" +
      code[5] +
      code[6] +
      code[7];

    return finalCode;
  }

  // Use useEffect to update the form field after code is generated
  useEffect(() => {
    if (code) {
      form.setFieldsValue({ codeNumber: code });
    }
  }, [code]);

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <>
      <span class="gradient-text">Receipt</span>
      <Divider style={{ borderTopWidth: 2 }} />
      <div className="receipt-content-layout">
        <div>
          <Badge.Ribbon
            text={
              <span>
                <FormOutlined style={{ marginRight: "8px" }} />
                New Receipt
              </span>
            }
            placement="start"
          >
            <Card
              hoverable
              style={{ width: 500, cursor: "default", paddingTop: "20px"}}
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
                <Form.Item
                  label="Place"
                  required
                  tooltip="This is a required field"
                >
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
                      <Select placeholder="Place" style={{ width: "225px" }}>
                        {places.map((place) => (
                          <Option key={place.name} value={place.name}>
                            {place.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Space>
                </Form.Item>
                <Form.Item
                  label="Code"
                  required
                  tooltip="This is a required field"
                >
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
                      <Select placeholder="Label" style={{ width: "100px" }}>
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
                        placeholder="No code"
                        disabled
                      />
                    </Form.Item>

                    <span>
                      <Tooltip title="Generate New" placement="right">
                        <Button
                          type="primary"
                          icon={<SyncOutlined />}
                          loading={loadings[2]}
                          onClick={() => enterLoading(2)}
                        />
                      </Tooltip>
                    </span>
                  </Space.Compact>
                </Form.Item>
                <Form.Item
                  label="Sender"
                  required
                  tooltip="This is a required field"
                >
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
                        placeholder="Full Name"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>
                <Form.Item
                  label="Receiver"
                  required
                  tooltip="This is a required field"
                >
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
                        placeholder="Full Name"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="Amount"
                  required
                  tooltip="This is a required field"
                >
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
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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

                <Form.Item
                  label="Fee"
                  required
                  tooltip="This is a required field"
                >
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
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
                      <InputNumber
                        style={{
                          width: 160,
                        }}
                        placeholder="Phone #"
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="Status"
                  required
                  tooltip="This is a required field"
                >
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
                    <Select placeholder="Status" style={{ width: "155px" }}>
                      <Option value="Cash">Cash</Option>
                      <Option value="Deposit">Deposit</Option>
                      {/* <Option value="Not Paid">Not Paid</Option> */}
                    </Select>
                  </Form.Item>
                </Form.Item>

                <Form.Item label=" " colon={false}>
                  <div style={{ display: "flex", marginTop: "20px" }}>
                    <Button type="primary" htmlType="submit" size="default">
                      Submit & Print
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

        <div style={{width:"500px"}}>
          {/* <Calendar fullscreen={false} onPanelChange={onPanelChange} /> */}
        </div>
      </div>
    </>
  );
}
export default Receipt;
