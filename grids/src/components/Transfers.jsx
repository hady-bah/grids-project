import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect, useContext,  } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, DatePicker, Typography, Row, 
  Statistic, Col, Badge, Tag, Popconfirm, Form  } from "antd";
import CountUp from "react-countup";
import { FloatButton } from "antd";
import { supabase } from "../../createClient";
import { Divider } from "antd";
import LearnDataGrid from "./LearnDataGrid";
import TotalsFilter from "./TotalsFilter";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

function Transfers() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { Title } = Typography;

  const formatNumber = (number) => {// Ensure the input is a valid number
    const parsedNumber = parseFloat(number);
    if (isNaN(parsedNumber)) {
      return number; // Return the original value if it's not a number
    }
  
    // Format the number with two decimal places and thousands separator
    return parsedNumber.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatter = (value) => (
    <span >
      <CountUp end={value} separator="," decimals={2} prefix="$ "/>
    </span>
  );
  const formatterCash = (value) => (
    <span style={{color:'green'}}>
      <CountUp end={value} separator="," decimals={2} prefix="$ "/>
    </span>
  );
  const formatterDeposit = (value) => (
    <span style={{color:'#1677ff'}}>
      <CountUp end={value} separator="," decimals={2} prefix="$ "/>
    </span>
  );

  //supabase setup
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    fetchTransfers();
  }, []);

  async function fetchTransfers() {
    const { data } = await supabase.from("transfers").select("*");
    setTransfers(data);
  }

  const calculateSum = (filteredData) => {
    let sumAmount = 0;
    let sumFee = 0;

    filteredData.forEach((record) => {
      sumAmount += record.amount || 0;
      sumFee += record.fee || 0;
    });

    return {
      label: "Summary",
      amount: sumAmount.toFixed(2),
      fee: sumFee.toFixed(2),
    };
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("label"),
    },
    {
      title: "Code #",
      dataIndex: "codeNumber",
      key: "codeNumber",
      width: "20%",
      ...getColumnSearchProps("codeNumber"),
    },
    {
      title: "Place",
      dataIndex: "place",
      key: "place",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("place"),
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("sender"),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("receiver"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("amount"),
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("fee"),
    },
    {
      title: "Mobile",
      dataIndex: "mobileMoney",
      key: "mobileMoney",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("mobileMoney"),
    },
    {
      title: "Date(YY/MM/DD)",
      dataIndex: "date",
      key: "date",
      width: "20%",
      ...getColumnSearchProps("date"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("status"),
      render: (text, record) => (
        <span>
        <Tag color={record.status === "Deposit" ? "blue" : "green"}>
          {text}
        </Tag>
      </span>
      ),
    },
  ];

  const customFooter = (currentPageData) => {

    let filteredData = currentPageData;

    if(searchText){
      filteredData = currentPageData.filter((record) =>
        Object.keys(record).some((key) =>
          record[key].toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

      const summaryData = calculateSum(filteredData);
      const grandTotal = (
        parseFloat(summaryData.amount) + parseFloat(summaryData.fee)
      ).toFixed(2);

      const depositData = filteredData.filter((record) => record.status === "Deposit");
      const depostData = calculateSum(depositData);

      const totalDeposit = (
        parseFloat(depostData.amount) + parseFloat(depostData.fee)
      ).toFixed(2);

      const totalCash = (
        grandTotal - totalDeposit
      ).toFixed(2);
  
      const totalTransactions = filteredData.length;

      // Update the state variables
    setTotalAmount(summaryData.amount);
    setTotalFee(summaryData.fee);
    setGrandTotal(grandTotal);
    setTotalDeposit(totalDeposit);
    setTotalCash(totalCash); 
    setTotalTransactions(filteredData.length);
    

    return (
      <tr>
        {/* <td style={{ fontWeight: "bold", fontSize: "16px" }}>
          {summaryData.label}
        </td> */}
        <td
           style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          Sent: ${formatNumber(summaryData.amount)}
        </td>
        <td
          style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          Fees: ${formatNumber(summaryData.fee)}
        </td>
        <td
          style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          Grand Total: ${formatNumber(grandTotal)}
        </td>
        <td colSpan="6"></td>
        <td
          style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          {`Deposits: $${formatNumber(totalDeposit)}`}
        </td>
        <td colSpan="6"></td>
        <td
           style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          {`Cash: $${formatNumber(totalCash)}`}
        </td>
        <td colSpan="6"></td>
        <td
          style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          {`Transactions: ${totalTransactions}`}
        </td>
        <td colSpan="6"></td>
      </tr>
    );
  };

  const handleSave = async (row) => {

    const { data, error } = await supabase
      .from('transfers')
      .update({...row})
      .eq('id', row.id)
  
    if (error) {
      console.log("error saving edit");
    } else {
      console.log("Successfully updated!");
      
    }
  
  }


  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  
  const editColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <>
      <Title>Transfer 2.0</Title>
      <Divider style={{ borderTopWidth: 5 }} />

      <Title style={{paddingTop:'20px'}} level={4}>Advanced filter:</Title>

      <div style={{paddingBottom:'50px'}}>
      <TotalsFilter />
      </div>

      {/* totals summary stats */}
      <div style={{paddingBottom:'20px'}}>
      <Row gutter={80}>
        <Col>
          <Statistic
            title="Sent"
            value={totalAmount}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Fees"
            value={totalFee}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Grand Total"
            value={grandTotal}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Deposits"
            value={totalDeposit}
            precision={2}
            formatter={formatterDeposit}
          />
        </Col>
        <Col>
          <Statistic
            title="Cash"
            value={totalCash}
            precision={2}
            formatter={formatterCash}
          />
        </Col>
        <Col>
          <Statistic
            title="Transactions"
            value={totalTransactions}
          />
        </Col>
      </Row>
      </div>

      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        columns={editColumns}
        dataSource={transfers}
        pagination={false}
        // scroll={{ x: "max-content" }} // Add horizontal scrolling if needed
        footer={customFooter} // Assign the custom footer
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      />
    </>
  );
}

export default Transfers;
