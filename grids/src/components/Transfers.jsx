import {
  SearchOutlined,
  DeleteOutlined,
  PrinterOutlined,
  ConsoleSqlOutlined,
  QuestionCircleOutlined,
  FilterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import React, { useRef, useState, useEffect, useContext } from "react";
import Highlighter from "react-highlight-words";
import {
  Button,
  Switch,
  Input,
  Space,
  Table,
  DatePicker,
  Typography,
  Row,
  Statistic,
  Col,
  Badge,
  Tag,
  Popconfirm,
  Form,
  notification,
  message,
  Tooltip,
} from "antd";
import CountUp from "react-countup";
import { FloatButton } from "antd";
import { supabase } from "../../createClient";
import { Divider } from "antd";
import LearnDataGrid from "./LearnDataGrid";
import TotalsFilter from "./TotalsFilter";
import "../styles/styles.css";

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
      console.log("Save failed:", errInfo);
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
  const { Title, Text } = Typography;
  const [messageApi, contextHolder] = message.useMessage();

  // New variables based on select query
  const [filterTotalAmount, setFilterTotalAmount] = useState(0);
  const [filterTotalFee, setFilterTotalFee] = useState(0);
  const [filterGrandTotal, setFilterGrandTotal] = useState(0);
  const [filterTotalDeposit, setFilterTotalDeposit] = useState(0);
  const [filterTotalCash, setFilterTotalCash] = useState(0);
  const [filterTotalTransactions, setFilterTotalTransactions] = useState(0);

  const openSuccesNotification = () => {
    notification.success({
      message: "Updated successfully",
      description: "The receipt was successfully updated to the database.",
      placement: "bottomRight",
    });
  };

  const openDeleteNotification = () => {
    notification.info({
      message: "Receipt deleted",
      description: "The receipt was deleted from the database.",
      placement: "bottomRight",
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Error",
      description: "Unable to perform operation.",
      placement: "bottomRight",
    });
  };

  //time formatter
  function formatDateTime(dateTimeString) {
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(dateTimeString);
    const formattedTime = date.toLocaleString("en-US", options);
    return formattedTime;
  }

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  const formatNumber = (number) => {
    // Ensure the input is a valid number
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
    <span style={{fontSize: "20px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );
  const formatterTrans = (value) => (
    <span style={{fontSize: "20px" }}>
      <CountUp end={value} separator=","/>
    </span>
  );
  const formatterCash = (value) => (
    <span style={{ color: "green", fontSize: "20px"  }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );
  const formatterDeposit = (value) => (
    <span style={{ color: "#1677ff", fontSize: "20px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );
  const formatterSent = (value) => (
    <span style={{ color: "#1677ff", fontSize: "20px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );

  //supabase setup to fetch
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const [searchCode, setSearchCode] = useState("");
  const [searchLabel, setSearchLabel] = useState("");
  const [searchDate, setSearchDate] = useState("");

  async function fetchTransfers() {
    let dataQuery = supabase.from("transfers").select("*");

    if (searchCode !== "") {
      dataQuery = dataQuery.eq("codeNumber", searchCode);
    }

    if (searchLabel !== "") {
      dataQuery = dataQuery.eq("label", searchLabel);
    }

    if (searchDate !== "") {
      dataQuery = dataQuery.eq("date", searchDate);
    }

    dataQuery = dataQuery.order("time", { ascending: false });

    const { data } = await dataQuery;
    setTransfers(data);
  }

  // Function to handle user input change
  const handleCodeInputChange = (e) => {
    setSearchCode(e.target.value);
  };

  const handleLabelInputChange = (e) => {
    setSearchLabel(e.target.value);
  };

  const handleDateInputChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handleUserSearch = async () => {
    await fetchTransfers();
  };

  const calculateSum = (filteredData) => {
    let sumAmount = 0;
    let sumFee = 0;

    filteredData.forEach((record) => {
      const amount = Number(record.amount) || 0;
      const fee = Number(record.fee) || 0;

      sumAmount += amount;
      sumFee += fee;
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
    },
    {
      title: "Code",
      dataIndex: "codeNumber",
      key: "codeNumber",
      width: "20%",
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
      title: "Date",
      dataIndex: "time",
      key: "time",
      width: "20%",
      render: (text, record) => formatDate(record.time),
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
          <Tag color={record.status.toLowerCase() === "deposit" ? "blue" : "green"}>
            {text}
          </Tag>
        </span>
      ),
    },
    {
      title: "Time(+zone)",
      dataIndex: "time",
      key: "time",
      width: "20%",
      render: (text) => <span>{formatDateTime(text)}</span>,
    },
    // Operation column renders delete button
    {
      title: "Operations",
      render: (_, record) => (
        <div>
          <span style={{ marginRight: "25px" }}>
            <Tooltip title="Print" placement="bottom">
              <PrinterOutlined
                style={{ fontSize: "18px" }}
                onClick={() => handlePrint(record.id)}
              />
            </Tooltip>
          </span>

          <Tooltip title="Delete" placement="bottom">
            <Popconfirm
              title="Delete?"
              onConfirm={() => handleDelete(record.id)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Handle delete
  const handleDelete = async (id) => {
    // Delete from Supabase
    await supabase.from("transfers").delete().eq("id", id);

    // Filter deleted record from UI
    setTransfers(transfers.filter((t) => t.id !== id));

    openDeleteNotification();
  };

  const customFooter = (currentPageData) => {
    let filteredData = currentPageData;

    if (searchText) {
      filteredData = currentPageData.filter((record) =>
        Object.keys(record).some((key) =>
          record[key]
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      );
    }

    const summaryData = calculateSum(filteredData);
    const grandTotal = (
      parseFloat(summaryData.amount) + parseFloat(summaryData.fee)
    ).toFixed(2);

    const depositData = filteredData.filter(
      (record) => record.status.toLowerCase() === "deposit"
    );
    const depostData = calculateSum(depositData);

    const totalDeposit = (
      parseFloat(depostData.amount) + parseFloat(depostData.fee)
    ).toFixed(2);

    const totalCash = (grandTotal - totalDeposit).toFixed(2);

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
          Total: ${formatNumber(grandTotal)}
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

  //For select query
  // Calculate the sums based on the filtered data
  const calculateFilterSum = (filteredData) => {
    if (!filteredData || filteredData.length === 0) {
      return {
        label: "Summary",
        amount: "0.00",
        fee: "0.00",
      };
    }
  
    let sumAmount = 0;
    let sumFee = 0;
  
    filteredData.forEach((record) => {
      const amount = Number(record.amount) || 0;
      const fee = Number(record.fee) || 0;
  
      sumAmount += amount;
      sumFee += fee;
    });
  
    return {
      label: "Summary",
      amount: sumAmount.toFixed(2),
      fee: sumFee.toFixed(2),
    };
  };
  

  // Function to update the statistics based on filtered data
  const updateFilterStatistics = (filteredData) => {
    if (!filteredData || filteredData.length === 0) {
      // Set default values or handle the case when there is no data
      setFilterTotalAmount("0.00");
      setFilterTotalFee("0.00");
      setFilterGrandTotal("0.00");
      setFilterTotalDeposit("0.00");
      setFilterTotalCash("0.00");
      setFilterTotalTransactions(0);
      return;
    }
  
    const summaryData = calculateFilterSum(filteredData);
    const filterGrandTotal = (
      parseFloat(summaryData.amount) + parseFloat(summaryData.fee)
    ).toFixed(2);
  
    const depositData = filteredData.filter(
      (record) => record.status.toLowerCase() === "deposit"
    );
    const filterDepostData = calculateFilterSum(depositData);
  
    const filterTotalDeposit = (
      parseFloat(filterDepostData.amount) + parseFloat(filterDepostData.fee)
    ).toFixed(2);
  
    const filterTotalCash = (filterGrandTotal - filterTotalDeposit).toFixed(2);
  
    const filterTotalTransactions = filteredData.length;
  
    // Update the state variables
    setFilterTotalAmount(summaryData.amount);
    setFilterTotalFee(summaryData.fee);
    setFilterGrandTotal(filterGrandTotal);
    setFilterTotalDeposit(filterTotalDeposit);
    setFilterTotalCash(filterTotalCash);
    setFilterTotalTransactions(filterTotalTransactions);
  };
  

  // Use the updateFilterStatistics function in the useEffect
  useEffect(() => {
    updateFilterStatistics(transfers);
  }, [transfers]);

  const [loading, setLoading] = useState(false);

  const handleSave = async (row) => {
    setLoading(true); // disable save

    // Optimistic update
    setTransfers((prevTransfers) => {
      // Find index of updated row
      const index = prevTransfers.findIndex((t) => t.id === row.id);

      // Create new array with updated row
      const updated = [...prevTransfers];
      updated[index] = row;

      return updated;
    });

    try {
      const { data, error } = await supabase
        .from("transfers")
        .update({ ...row })
        .eq("id", row.id);

      if (error) {
        // Revert optimistic update
        throw error;
      }

      // Refresh data after update
      fetchTransfers();
      openSuccesNotification();
    } catch (error) {
      // Undo optimistic update
      // Show error message
      openErrorNotification();
    } finally {
      setLoading(false); // re-enable save
    }
  };

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

  const onClear = (e) => {
    console.log(e);
  };

  return (
    <>
      <span class="gradient-text">Transfer 2.0</span>
      <Divider style={{ borderTopWidth: 2 }} />

      <Title style={{ paddingTop: "20px", paddingBottom: "10px" }} level={5}>
        <FilterOutlined /> Filter
        <span style={{ marginLeft: "10px" }}>
          <Tooltip
            placement="right"
            title="Returns table based on your select query"
          >
            <QuestionCircleOutlined
              style={{ color: "gray", fontSize: "15px", cursor: "help" }}
            />
          </Tooltip>
        </span>
      </Title>

      <div className="filter-container">
        <div className="filter-inputs">
          <span>
            <Text strong>Code: </Text>
          </span>
          <Input
            placeholder="All Codes"
            value={searchCode}
            onChange={handleCodeInputChange}
            style={{ width: "150px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div className="filter-inputs">
          <span>
            <Text strong>Label: </Text>
          </span>
          <Input
            placeholder="All Labels"
            value={searchLabel}
            onChange={handleLabelInputChange}
            style={{ width: "100px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div className="filter-inputs">
          <span>
            <Text strong>Date: </Text>
          </span>
          <Input
            placeholder="All Time"
            value={searchDate}
            onChange={handleDateInputChange}
            style={{ width: "150px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div>
          <Tooltip title="Filter & calculate">
            <Button
              shape="circle"
              icon={<FilterOutlined />}
              onClick={handleUserSearch}
            />
          </Tooltip>
        </div>
      </div>

      {/* totals summary stats */}
      <div style={{ paddingBottom: "20px", paddingTop: "25px" }}>
        <Row gutter={80}>
          <Col>
            <Statistic
              title="Sent"
              value={filterTotalAmount}
              formatter={formatter}
            />
          </Col>
          <Col>
            <Statistic
              title="Fees"
              value={filterTotalFee}
              precision={2}
              formatter={formatter}
            />
          </Col>
          <Col>
            <Statistic
              title="Total"
              value={filterGrandTotal}
              precision={2}
              formatter={formatter}
            />
          </Col>
          <Col>
            <Statistic
              title="Deposits"
              value={filterTotalDeposit}
              precision={2}
              formatter={formatterDeposit}
            />
          </Col>
          <Col>
            <Statistic
              title="Cash"
              value={filterTotalCash}
              precision={2}
              formatter={formatterCash}
            />
          </Col>
          <Col>
            <Statistic title="Transactions" value={filterTotalTransactions} formatter={formatterTrans}/>
          </Col>
        </Row>
      </div>

      <Divider style={{ borderTopWidth: 2 }} />

      <Title style={{ paddingTop: "20px", paddingBottom: "10px" }} level={5}>
        <EyeOutlined /> View
        <span style={{ marginLeft: "10px" }}>
          <Tooltip
            placement="right"
            title="View, search, print, edit and delete"
          >
            <QuestionCircleOutlined
              style={{ color: "gray", fontSize: "15px", cursor: "help" }}
            />
          </Tooltip>
        </span>
      </Title>

      <Table
        components={components}
        rowClassName={() => "editable-row"}
        columns={editColumns}
        dataSource={transfers}
        pagination={{
          position: ["bottomCenter"], // Centered at the bottom
          pageSize: 10, // transactions per page size
        }}
        scroll={{
          x: "calc(700px + 50%)",
        }}
        footer={customFooter} // Assign the custom footer
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      />
    </>
  );
}

export default Transfers;
