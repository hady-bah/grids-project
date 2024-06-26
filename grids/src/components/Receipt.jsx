import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../../createClient";
import { AutoComplete } from "antd";
import moment from 'moment-timezone';
import axios from 'axios';
import {
  InfoCircleOutlined,
  FormOutlined,
  ScissorOutlined,
  SyncOutlined,
  CalendarOutlined
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
    const generatedDate = generateDate();

    if (generatedDate) {
      form.setFieldsValue({ date: generatedDate });
      setDate(generatedDate); // Update the state variable
    }
  };

  const onLoadDate = () => {
    const generatedDate = generateDate();

    if (generatedDate) {
      form.setFieldsValue({ date: generatedDate });
      setDate(generatedDate); // Update the state variable
    }
  };

  

  const onFinish = async (values) => {
    // console.log("Form Values:", values);
    const { data, error } = await supabase.from("transfers").insert([values]);
  
    if (error) {
      openErrorNotification();
      message.error("Supabase Error:", error);
    } else {
      openSuccesNotification(); // Display success message
  
      // Fetch place information
      const { data: placeData, error: placeError } = await supabase
        .from("places")
        .select("operator, number, address")
        .eq("name", values.place);
  
      if (placeError) {
        message.error("Supabase Error fetching place information:", placeError);
        return;
      }
  
      const { operator, number: placeNumber, address: placeAddress } =
        placeData && placeData.length > 0 ? placeData[0] : {};
  
      // sms message content
      const text = `
      Code: ${values.codeNumber}\n
      Date: ${values.date}\n
      From: ${values.place_from}\n
      To: ${values.place}\n
      Sender: ${values.sender}\n
      Number: ${values.sender_number}\n
      Receiver: ${values.receiver}\n
      Amount: $${values.amount}\n
      Fee: $${values.fee}\n
      Mobile Transfer: ${values.mobileMoney || "N/A"}\n
      Payment: ${values.status}\n\n
      Pick up info:\n
      Operator: ${operator || "N/A"}\n
      Phone #: ${placeNumber || "N/A"}\n
      Address: ${placeAddress || "N/A"}\n
    `;
  
      
      //printReceipt(text);

      //send text message request
      try {
        const API_URL = 'https://gridssoftware.netlify.app/.netlify/functions/';
        const response = await fetch(`${API_URL}send-receipt?phoneNumber=${values.sender_number}&messageContent=${encodeURIComponent(text)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          message.success('SMS sent successfully');
        } else {
          const errorText = await response.text();
          message.error(`Error sending SMS: ${errorText}`);
        }
      } catch (error) {
        message.error(`Error sending SMS: ${error.message}`);
      }
      
      form.resetFields();
    }
  };
  

  // const printReceipt = (text) => {
  //   const printWindow = window.open();
  //   printWindow.document.write(text);
  //   printWindow.print();
  //   printWindow.close();
  // };

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
      message.error("Error fetching codes:", error);
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


  const [date, setDate] = useState("");

  function generateDate() {
    // Get the current date and time in Eastern Time Zone (ET)
    const easternDate = moment().tz('America/New_York');
  
    // Format the date as a string in MM/DD/YYYY format
    const formattedDate = easternDate.format('DD/MM/YYYY');
  
    return formattedDate;
  }

  // Use useEffect to update the form field after date is generated
  useEffect(() => {
    const generatedDate = generateDate();

    if (generatedDate) {
      form.setFieldsValue({ date: generatedDate });
      setDate(generatedDate); // Update the state variable
    }
  }, []);

  const onPanelChange = (value, mode) => {
    message.log(value.format("YYYY-MM-DD"), mode);
  };

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <>
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
                  label="From"
                  required
                  tooltip="This is a required field"
                >
                  <Space.Compact>
                    <Form.Item
                      name="place_from"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Place from is required",
                        },
                      ]}
                    >
                      <Select placeholder="Select" style={{ width: "225px" }}>
                        {places.map((place) => (
                          <Option key={place.name} value={place.name}>
                            {place.name}
                          </Option>
                        ))}
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
                          width: "50px",
                        }}
                        placeholder="->"
                        disabled
                      />
                    </Form.Item>

                    <span>
                      <Tooltip title="New Code" placement="right">
                        <Button
                          type="primary"
                          icon={<SyncOutlined/>}
                          loading={loadings[2]}
                          onClick={() => enterLoading(2)}
                        />
                      </Tooltip>
                    </span>
                  </Space.Compact>
                </Form.Item>
                <Form.Item
                  label="To"
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
                      <Select placeholder="Select" style={{ width: "225px" }}>
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
                  label="Number"
                  required
                  tooltip="This is a required field"
                >
                  <Space>
                    <Form.Item
                      name="sender_number"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Sender is required",
                        },
                      ]}
                    >
                      <InputNumber
                          style={{
                            width: 185,
                          }}
                          placeholder="Sender's Phone #"
                          formatter={(value) => {
                            // Format input as a phone number
                            if (value) {
                              const formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
                              if (formattedValue.length > 10) {
                                return `+${formattedValue.slice(0, -10)} (${formattedValue.slice(-10, -7)}) ${formattedValue.slice(-7, -4)}-${formattedValue.slice(-4)}`;
                              }
                              return `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(3, 6)}-${formattedValue.slice(6, 10)}`;
                            }
                          }}
                          parser={(value) => {
                            // Remove non-numeric characters
                            return value ? value.replace(/\D/g, '') : '';
                          }}
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

                <Form.Item label="Mobile Transfer" tooltip="Optional field">
                  <Space>
                    <Form.Item name="mobileMoney" noStyle>
                    <InputNumber
                          style={{
                            width: 185,
                          }}
                          placeholder="Recipient's #"
                          formatter={(value) => {
                            // Format input as a phone number
                            if (value) {
                              const formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
                              if (formattedValue.length > 10) {
                                return `+${formattedValue.slice(0, -10)} (${formattedValue.slice(-10, -7)}) ${formattedValue.slice(-7, -4)}-${formattedValue.slice(-4)}`;
                              }
                              return `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(3, 6)}-${formattedValue.slice(6, 10)}`;
                            }
                          }}
                          parser={(value) => {
                            // Remove non-numeric characters
                            return value ? value.replace(/\D/g, '') : '';
                          }}
                        />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item
                  label="Payment Method"
                  required
                  tooltip="This is a required field"
                >
                  <Form.Item
                    name="status"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Payment is required",
                      },
                    ]}
                  >
                    <Select placeholder="Paid In" style={{ width: "155px" }}>
                      <Option value="Cash">Cash</Option>
                      <Option value="Deposit">Deposit</Option>
                      {/* <Option value="Not Paid">Not Paid</Option> */}
                    </Select>
                  </Form.Item>
                </Form.Item>
                <Form.Item
                  label="Date"
                  required
                  tooltip="This is a required field"
                >
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
                      <Input
                        style={{
                          width: 160,
                        }}
                        placeholder="Set Date"
                        disabled
                      />
                    </Form.Item>
                    <span>
                      <Tooltip title="Set Date" placement="right">
                        <Button
                          type="primary"
                          icon={<CalendarOutlined />}
                          loading={loadings[2]}
                          onClick={onLoadDate}
                        />
                      </Tooltip>
                    </span>
                  </Space>
                </Form.Item>

                <Form.Item label=" " colon={false}>
                  <div style={{ display: "flex", marginTop: "20px" }}>
                    <Button type="primary" htmlType="submit" size="default">
                      Send
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