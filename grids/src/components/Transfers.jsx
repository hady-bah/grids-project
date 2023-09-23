import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, DatePicker, Typography } from "antd";
import { FloatButton } from "antd";
import { supabase } from "../../createClient";
import { Divider } from "antd";
import LearnDataGrid from "./LearnDataGrid";
import TotalsFilter from "./TotalsFilter";

function Transfers() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { Title } = Typography;

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
      ...getColumnSearchProps("place"),
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      width: "20%",
      ...getColumnSearchProps("sender"),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      width: "20%",
      ...getColumnSearchProps("receiver"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      ...getColumnSearchProps("amount"),
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      width: "20%",
      ...getColumnSearchProps("fee"),
    },
    {
      title: "Mobile",
      dataIndex: "mobileMoney",
      key: "mobileMoney",
      width: "20%",
      ...getColumnSearchProps("mobileMoney"),
    },
    {
      title: "Date (YY/MM/DD)",
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
      ...getColumnSearchProps("status"),
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
    

    return (
      <tr>
        <td style={{ fontWeight: "bold", fontSize: "16px" }}>
          {summaryData.label}
        </td>
        <td
          style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          Total Amount Sent: ${summaryData.amount}
        </td>
        <td
          style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          Total Fees: ${summaryData.fee}
        </td>
        <td
          style={{ fontWeight: "bold", paddingLeft: "60px", fontSize: "16px" }}
        >
          Grand Total: ${grandTotal}
        </td>
        <td colSpan="6"></td>
      </tr>
    );
  };

  return (
    <>
      <Title>Transfer 2.0</Title>
      <Divider style={{ borderTopWidth: 5 }} />

      <Title style={{paddingTop:'20px'}} level={2}>Advanced filter:</Title>

      <div style={{paddingBottom:'50px'}}>
      <TotalsFilter />
      </div>

      <Table
        columns={columns}
        dataSource={transfers}
        pagination={false}
        scroll={{ x: "max-content" }} // Add horizontal scrolling if needed
        footer={customFooter} // Assign the custom footer
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      />
    </>
  );
}

export default Transfers;

