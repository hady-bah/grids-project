import {
  SearchOutlined,
  DeleteOutlined,
  PrinterOutlined,
  ConsoleSqlOutlined,
  QuestionCircleOutlined,
  FilterOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
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
  const [filterTotalpaid, setFilterTotalpaid] = useState(0);

  const openSuccesNotification = () => {
    notification.success({
      message: "Successfull",
      description: "Operation was successful",
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
    <span style={{fontSize: "17px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );
  const formatterTrans = (value) => (
    <span style={{fontSize: "17px" }}>
      <CountUp end={value} separator=","/>
    </span>
  );
  const formatterCash = (value) => (
    <span style={{ color: "green", fontSize: "17px"  }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );
  const formatterDeposit = (value) => (
    <span style={{ color: "#1677ff", fontSize: "17px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );
  const formatterpaid = (value) => (
    <span style={{ color: "gray", fontSize: "17px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );
  const formatterProfit = (value) => (
    <span style={{ color: "#82ca9d", fontSize: "17px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );

  const formatterSent = (value) => (
    <span style={{ color: "#8884d8", fontSize: "17px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );

  //supabase setup to fetch
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const [searchCode, setSearchCode] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [searchFrom, setSearchFrom] = useState("");

  async function fetchTransfers() {
    let dataQuery = supabase.from("transfers").select("*");

    if (searchCode !== "") {
      dataQuery = dataQuery.eq("codeNumber", searchCode);
    }

    if (searchPlace !== "") {
      const [city, country] = searchPlace.split(',').map(part => part.trim());
    
      if (city && country) {
        // Search by both city and country
        dataQuery = dataQuery
          .ilike('place', `%${city.trim()}, ${country.trim()}%`);
      } else if (city) {
        // Search only by city
        dataQuery = dataQuery.ilike('place', `%${city.trim()}%`);
      } else if (country) {
        // Search only by country
        dataQuery = dataQuery.ilike('place', `%${country.trim()}%`);
      }
    }

    if (searchDate !== "") {
      // Check if the input is in DD/MM/YYYY format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(searchDate)) {
        // If DD/MM/YYYY, perform a string search for the exact date
        dataQuery = dataQuery.ilike('date', `%${searchDate}%`);
      } else if (/^\d{2}\/\d{4}$/.test(searchDate)) {
        // If DD/YYYY, perform a string search for the month and year
        const [day, monthYear] = searchDate.split('/');
        dataQuery = dataQuery.ilike('date', `%${day}/${monthYear}%`);
      } else if (/^\d{4}$/.test(searchDate)) {
        // If YYYY, perform a string search for the year
        dataQuery = dataQuery.ilike('date', `%${searchDate}%`);
      }
    }
    
    

    if (searchNumber !== "") {
      dataQuery = dataQuery.eq("sender_number", searchNumber);
    }

    if (searchFrom !== "") {
      const [city, country] = searchFrom.split(',').map(part => part.trim());
    
      if (city && country) {
        // Search by both city and country
        dataQuery = dataQuery
          .ilike('place_from', `%${city.trim()}, ${country.trim()}%`);
      } else if (city) {
        // Search only by city
        dataQuery = dataQuery.ilike('place_from', `%${city.trim()}%`);
      } else if (country) {
        // Search only by country
        dataQuery = dataQuery.ilike('place_from', `%${country.trim()}%`);
      }
    }
    

    dataQuery = dataQuery.order("time", { ascending: false });

    const { data } = await dataQuery;
    setTransfers(data);
  }
  

  // Function to handle user input change
  const handleCodeInputChange = (e) => {
    setSearchCode(e.target.value);
  };

  const handlePlaceInputChange = (e) => {
    setSearchPlace(e.target.value);
  };

  const handleDateInputChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handleNumberInputChange = (e) => {
    setSearchNumber(e.target.value);
  };

  const handleFromInputChange = (e) => {
    setSearchFrom(e.target.value);
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
      title: "Code",
      dataIndex: "codeNumber",
      key: "codeNumber",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
      width: "20%",
      render: (text, record) => (
        <span>
          <Tag color={record.payment_status.toLowerCase() === "processing"? "processing" : "success"}
                icon={record.payment_status.toLowerCase() === "processing" ? <SyncOutlined spin /> : <CheckCircleOutlined /> }
          >
            {text}
          </Tag>
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      editable: true,
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      width: "20%",
      editable: true,
    },
    {
      title: "To",
      dataIndex: "place",
      key: "place",
      width: "20%",
      editable: true,
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
      title: "Mobile Transfer",
      dataIndex: "mobileMoney",
      key: "mobileMoney",
      width: "20%",
      editable: true,
      render: (text) => (
        <span>
          {text !== null ? (
            <p>{text}</p>
          ) : (
            <Tag color="default">N/A</Tag>
          )}
        </span>
      ),
    },
    {
      title: "Method",
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
      title: "Sender #",
      dataIndex: "sender_number",
      key: "sender_number",
      width: "20%",
      editable: true,
    },
    {
      title: "From",
      dataIndex: "place_from",
      key: "place_from",
      width: "20%",
      editable: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "time",
      width: "20%",
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
          <span style={{ marginRight: "10px"}}>
          <Tooltip title="Pay" placement="bottom">
            <Popconfirm
              title="Paying transfer"
              onConfirm={() => handlePay(record.id)}
            >
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "16px" }}/>
            </Popconfirm>
          </Tooltip>
          </span>

          <span style={{ marginRight: "10px" }}>
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

    fetchTransfers();

    openDeleteNotification();
  };

  //handle pay
  const handlePay = async (id) =>{
    // Update payment_status to 'Paid'
  const { data, error } = await supabase
  .from("transfers")
  .update({ payment_status: "Paid" })
  .eq("id", id);

  if (error) {
  openErrorNotification();
  // Handle error scenario if needed
  } else {
  // If the update is successful, you can fetch the updated data or perform other actions
  openSuccesNotification();

  // Fetch transfers again or perform any necessary actions
  fetchTransfers();

}
  };

  //handle print
  const handlePrint = async (id) => {
    try {
      // Fetch the specific transfer record based on its id
      const { data: record, error } = await supabase
        .from("transfers")
        .select("*")
        .eq("id", id)
        .single();
  
      if (error) {
        openErrorNotification();
        console.error("Supabase Error:", error);
        return;
      }
  
      if (!record) {
        console.error("Record not found");
        return;
      }
  
      // Fetch place information
      const { data: placeData, error: placeError } = await supabase
        .from("places")
        .select("operator, number, address")
        .eq("name", record.place);
  
      if (placeError) {
        console.error("Supabase Error fetching place information:", placeError);
        return;
      }
  
      const { operator, number: placeNumber, address: placeAddress } =
        placeData && placeData.length > 0 ? placeData[0] : {};
  
      // Print receipt
      const text = 
        `Code: <strong>${record.codeNumber}</strong> <br />` +
        `Date: ${record.date}<br />` +
        `From: ${record.place_from}<br />` +
        `To: ${record.place}<br />` +
        `Sender: ${record.sender}<br />` +
        `Number: ${record.sender_number}<br />` +
        `Receiver: ${record.receiver}<br />` +
        `Amount: $${record.amount}<br />` +
        `Fee: $${record.fee}<br />` +
        `Mobile Transfer: ${record.mobileMoney || "N/A"}<br />` +
        `Payment: ${record.status}<br /><br />`+
        `<strong>Pick up info: </strong><br />` +
        `Operator: ${operator || "N/A"}<br />` +
        `Phone #: ${placeNumber || "N/A"}<br />` +
        `Address: ${placeAddress || "N/A"}<br />`;
  
      printReceipt(text);
    } catch (error) {
      openErrorNotification();
      console.error("Error fetching and printing record:", error);
    }
  };
  

  const printReceipt = (text) => {
    // Example implementation of printReceipt function
    const printWindow = window.open();
    printWindow.document.write(text);
    printWindow.print();
    printWindow.close();
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
          {summaryData.place_from}
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
      setFilterTotalpaid("0.00");
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

    //payment status
    const paidData = filteredData.filter(
      (record) => record.payment_status.toLowerCase() === "paid"
    );
    const filterpaidData = calculateFilterSum(paidData);
  
    const filterTotalpaid = (
      parseFloat(filterpaidData.amount)
    ).toFixed(2);
    //


  
    const filterTotalCash = (filterGrandTotal - filterTotalDeposit).toFixed(2);
  
    const filterTotalTransactions = filteredData.length;
  
    // Update the state variables
    setFilterTotalAmount(summaryData.amount);
    setFilterTotalFee(summaryData.fee);
    setFilterGrandTotal(filterGrandTotal);
    setFilterTotalDeposit(filterTotalDeposit);
    setFilterTotalpaid(filterTotalpaid);
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
            title="Default to all transactions"
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
            <Text strong>Code </Text>
          </span>
          <Input
            placeholder="Input Code"
            value={searchCode}
            onChange={handleCodeInputChange}
            style={{ width: "150px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div className="filter-inputs">
          <span>
            <Text strong>To </Text>
          </span>
          <Input
            placeholder="City, Country"
            value={searchPlace}
            onChange={handlePlaceInputChange}
            style={{ width: "185px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div className="filter-inputs">
          <span>
            <Text strong>Date </Text>
          </span>
          <Input
            placeholder="DD/MM/YYYY"
            value={searchDate}
            onChange={handleDateInputChange}
            style={{ width: "127px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div className="filter-inputs">
          <span>
            <Text strong>Number </Text>
          </span>
          <Input
            placeholder="Sender #"
            value={searchNumber}
            onChange={handleNumberInputChange}
            style={{ width: "130px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div className="filter-inputs">
          <span>
            <Text strong>From: </Text>
          </span>
          <Input
            placeholder="City, Country"
            value={searchFrom}
            onChange={handleFromInputChange}
            style={{ width: "185px" }}
            allowClear
            onClear={onClear}
          />
        </div>

        <div>
          <Tooltip title="Filter">
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
              formatter={formatterSent}
            />
          </Col>
          <Col>
            <Statistic
              title="Fees"
              value={filterTotalFee}
              precision={2}
              formatter={formatterProfit}
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
              title="Paid"
              value={filterTotalpaid}
              precision={2}
              formatter={formatterpaid}
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
              title="Est. Cash"
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
          // pageSize: 10, // transactions per page size
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