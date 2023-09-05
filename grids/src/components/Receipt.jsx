import React from "react";
import { Button, Form, Input, Space } from "antd";
import {
  Cascader,
  DatePicker,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
} from "antd";
const SubmitButton = ({ form }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      Submit
    </Button>
  );
};
function Receipt() {
  const [form] = Form.useForm();
  return (
    <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
      <Form.Item label="Place">
        <Select>
          <Select.Option value="AS">AS</Select.Option>
          <Select.Option value="BL">BL</Select.Option>
          <Select.Option value="AC">AC</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="Sender"
        label="Sender"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Receiver"
        label="Receiver"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Space>
          <SubmitButton form={form} />
          <Button>Print</Button>
          <Button htmlType="reset" style={{color:'#a61d24'}}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
export default Receipt;
