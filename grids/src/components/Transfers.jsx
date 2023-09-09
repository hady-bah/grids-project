import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, DatePicker } from 'antd';
import { FloatButton } from 'antd';


const data = [
  {
    key: '1',
    label: 'AS',
    codeNumber: 501,
    place: 'Bo',
    sender: 'Alfred Fatormah',
    receiver: 'Phyllis Tejan',
    amount: 100,
    fee: 10,
    mobileMoney:null, 
    date: '2023-01-01',
    status: 'Cash',
  },
  {
    key: '2',
    label: 'AC',
    codeNumber: 502,
    place: 'CKY',
    sender: 'Ahmed Conteh',
    receiver: 'John Kargbo',
    amount: 200,
    fee: 20,
    mobileMoney:null, 
    date: '2023-06-03',
    status: 'Deposit',
  },
  {
    key: '3',
    label: 'BL',
    codeNumber: 503,
    place: 'LIB',
    sender: 'Chama Sesay',
    receiver: 'Alfred Conteh',
    amount: 50,
    fee: 5,
    mobileMoney:null, 
    date: '2023-07-03',
    status: 'Not Paid',
  },
  {
    key: '4',
    label: 'AS',
    codeNumber: 504,
    place: 'FT',
    sender: 'Alfred Coker',
    receiver: 'John Coker',
    amount: 500,
    fee: 35,
    mobileMoney:'2325668765', 
    date: '2023-05-08',
    status: 'Cash',
  },
  {
    key: '5',
    label: 'AS',
    codeNumber: 505,
    place: 'FT',
    sender: 'Sarah Johnson',
    receiver: 'David Smith',
    amount: 150,
    fee: 15,
    mobileMoney: '2325554321',
    date: '2023-06-03',
    status: 'Cash',
  },
  {
    key: '6',
    label: 'AS',
    codeNumber: 506,
    place: 'Bo',
    sender: 'Emily Brown',
    receiver: 'Michael Wilson',
    amount: 75,
    fee: 7.5,
    mobileMoney: null,
    date: '2023-01-01',
    status: 'Deposit',
  },
  {
    key: '7',
    label: 'AS',
    codeNumber: 507,
    place: 'Kenema',
    sender: 'John Davis',
    receiver: 'Emma Lee',
    amount: 250,
    fee: 25,
    mobileMoney: '2325647890',
    date: '2023-05-08',
    status: 'Not Paid',
  },
  {
    key: '8',
    label: 'BL',
    codeNumber: 508,
    place: 'LIB',
    sender: 'Alice Williams',
    receiver: 'Robert Harris',
    amount: 30,
    fee: 3,
    mobileMoney: null,
    date: '2023-06-03',
    status: 'Cash',
  },
  {
    key: '9',
    label: 'AC',
    codeNumber: 509,
    place: 'CKY',
    sender: 'Laura Davis',
    receiver: 'William Jones',
    amount: 180,
    fee: 18,
    mobileMoney: '2325771234',
    date: '2023-01-01',
    status: 'Deposit',
  },
  {
    key: '10',
    label: 'AS',
    codeNumber: 510,
    place: 'FT',
    sender: 'Oliver Taylor',
    receiver: 'Sophia Hall',
    amount: 300,
    fee: 30,
    mobileMoney: '2325609876',
    date: '2023-04-15',
    status: 'Cash',
  },
  {
    key: '11',
    label: 'AS',
    codeNumber: 511,
    place: 'Bo',
    sender: 'Ella Turner',
    receiver: 'Daniel White',
    amount: 50,
    fee: 5,
    mobileMoney: null,
    date: '2023-07-03',
    status: 'Deposit',
  },
  {
    key: '12',
    label: 'AS',
    codeNumber: 512,
    place: 'Kenema',
    sender: 'Mia Adams',
    receiver: 'James Martin',
    amount: 120,
    fee: 12,
    mobileMoney: '2325674321',
    date: '2023-05-08',
    status: 'Not Paid',
  },
  {
    key: '13',
    label: 'BL',
    codeNumber: 513,
    place: 'LIB',
    sender: 'William Clark',
    receiver: 'Emma Roberts',
    amount: 25,
    fee: 2.5,
    mobileMoney: null,
    date: '2023-06-03',
    status: 'Cash',
  },
  {
    key: '14',
    label: 'BL',
    codeNumber: 514,
    place: 'LIB',
    sender: 'Sophia Wilson',
    receiver: 'Jacob Lewis',
    amount: 80,
    fee: 8,
    mobileMoney: '2325698765',
    date: '2023-01-01',
    status: 'Deposit',
  },
  {
    key: '15',
    label: 'BL',
    codeNumber: 515,
    place: 'LIB',
    sender: 'Ethan Scott',
    receiver: 'Ava Turner',
    amount: 10,
    fee: 1,
    mobileMoney: null,
    date: '2023-07-15',
    status: 'Not Paid',
  },
  {
    key: '16',
    label: 'AC',
    codeNumber: 516,
    place: 'CKY',
    sender: 'Charlotte Baker',
    receiver: 'Henry Ward',
    amount: 70,
    fee: 7,
    mobileMoney: '2325632109',
    date: '2023-04-22',
    status: 'Cash',
  },
  {
    key: '17',
    label: 'AC',
    codeNumber: 517,
    place: 'CKY',
    sender: 'Liam Fisher',
    receiver: 'Grace Mitchell',
    amount: 160,
    fee: 16,
    mobileMoney: null,
    date: '2023-01-01',
    status: 'Deposit',
  },
  {
    key: '18',
    label: 'AC',
    codeNumber: 518,
    place: 'CKY',
    sender: 'Zoe Turner',
    receiver: 'Jackson Lewis',
    amount: 90,
    fee: 9,
    mobileMoney: '2325612345',
    date: '2023-06-28',
    status: 'Not Paid',
  },
];

function Transfers() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
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
            color: filtered ? '#1677ff' : undefined,
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
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
    const columns = [
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'label',
        width: '20%',
        ...getColumnSearchProps('label'),
      },
      {
        title: 'Code #',
        dataIndex: 'codeNumber',
        key: 'codeNumber',
        width: '20%',
        ...getColumnSearchProps('codeNumber'),
      },
      {
        title: 'Place',
        dataIndex: 'place',
        key: 'place',
        width: '20%',
        ...getColumnSearchProps('place'),
      },
      {
        title: 'Sender',
        dataIndex: 'sender',
        key: 'sender',
        width: '20%',
        ...getColumnSearchProps('sender'),
      },
      {
        title: 'Receiver',
        dataIndex: 'receiver',
        key: 'receiver',
        width: '20%',
        ...getColumnSearchProps('receiver'),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: '20%',
        ...getColumnSearchProps('amount'),
      },
      {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
        width: '20%',
        ...getColumnSearchProps('fee'),
      },
      {
        title: 'Mobile',
        dataIndex: 'mobileMoney',
        key: 'mobileMoney',
        width: '20%',
        ...getColumnSearchProps('mobileMoney'),
      },
      {
        title: 'Date (YY/MM/DD)',
        dataIndex: 'date',
        key: 'date',
        width: '20%',
        ...getColumnSearchProps('date'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '20%',
        ...getColumnSearchProps('status'),
      },
    ];
    return <Table columns={columns} dataSource={data} pagination={false}/>;
};

export default Transfers

//footer for totals
// import { SearchOutlined } from "@ant-design/icons";
// import React, { useRef, useState } from "react";
// import Highlighter from "react-highlight-words";
// import { Button, Input, Space, Table} from "antd";

// const data = [
//   {
//     key: "1",
//     label: "AS",
//     codeNumber: 501,
//     place: "Bo",
//     sender: "Alfred Fatormah",
//     receiver: "Phyllis Tejan",
//     amount: 100,
//     fee: 10,
//     mobileMoney: null,
//     date: "2023-01-01",
//     status: "Cash",
//   },
//   {
//     key: "2",
//     label: "AC",
//     codeNumber: 502,
//     place: "CKY",
//     sender: "Ahmed Conteh",
//     receiver: "John Kargbo",
//     amount: 200,
//     fee: 20,
//     mobileMoney: null,
//     date: "2023-06-03",
//     status: "Deposit",
//   },
//   {
//     key: "3",
//     label: "BL",
//     codeNumber: 503,
//     place: "LIB",
//     sender: "Chama Sesay",
//     receiver: "Alfred Conteh",
//     amount: 50,
//     fee: 5,
//     mobileMoney: null,
//     date: "2023-07-03",
//     status: "Not Paid",
//   },
//   {
//     key: "4",
//     label: "AS",
//     codeNumber: 504,
//     place: "FT",
//     sender: "Alfred Coker",
//     receiver: "John Coker",
//     amount: 500,
//     fee: 35,
//     mobileMoney: "2325668765",
//     date: "2023-05-08",
//     status: "Cash",
//   },
//   {
//     key: "5",
//     label: "AS",
//     codeNumber: 505,
//     place: "FT",
//     sender: "Sarah Johnson",
//     receiver: "David Smith",
//     amount: 150,
//     fee: 15,
//     mobileMoney: "2325554321",
//     date: "2023-06-03",
//     status: "Cash",
//   },
//   {
//     key: "6",
//     label: "AS",
//     codeNumber: 506,
//     place: "Bo",
//     sender: "Emily Brown",
//     receiver: "Michael Wilson",
//     amount: 75,
//     fee: 7.5,
//     mobileMoney: null,
//     date: "2023-01-01",
//     status: "Deposit",
//   },
//   {
//     key: "7",
//     label: "AS",
//     codeNumber: 507,
//     place: "Kenema",
//     sender: "John Davis",
//     receiver: "Emma Lee",
//     amount: 250,
//     fee: 25,
//     mobileMoney: "2325647890",
//     date: "2023-05-08",
//     status: "Not Paid",
//   },
//   {
//     key: "8",
//     label: "BL",
//     codeNumber: 508,
//     place: "LIB",
//     sender: "Alice Williams",
//     receiver: "Robert Harris",
//     amount: 30,
//     fee: 3,
//     mobileMoney: null,
//     date: "2023-06-03",
//     status: "Cash",
//   },
//   {
//     key: "9",
//     label: "AC",
//     codeNumber: 509,
//     place: "CKY",
//     sender: "Laura Davis",
//     receiver: "William Jones",
//     amount: 180,
//     fee: 18,
//     mobileMoney: "2325771234",
//     date: "2023-01-01",
//     status: "Deposit",
//   },
//   {
//     key: "10",
//     label: "AS",
//     codeNumber: 510,
//     place: "FT",
//     sender: "Oliver Taylor",
//     receiver: "Sophia Hall",
//     amount: 300,
//     fee: 30,
//     mobileMoney: "2325609876",
//     date: "2023-04-15",
//     status: "Cash",
//   },
//   {
//     key: "11",
//     label: "AS",
//     codeNumber: 511,
//     place: "Bo",
//     sender: "Ella Turner",
//     receiver: "Daniel White",
//     amount: 50,
//     fee: 5,
//     mobileMoney: null,
//     date: "2023-07-03",
//     status: "Deposit",
//   },
//   {
//     key: "12",
//     label: "AS",
//     codeNumber: 512,
//     place: "Kenema",
//     sender: "Mia Adams",
//     receiver: "James Martin",
//     amount: 120,
//     fee: 12,
//     mobileMoney: "2325674321",
//     date: "2023-05-08",
//     status: "Not Paid",
//   },
//   {
//     key: "13",
//     label: "BL",
//     codeNumber: 513,
//     place: "LIB",
//     sender: "William Clark",
//     receiver: "Emma Roberts",
//     amount: 25,
//     fee: 2.5,
//     mobileMoney: null,
//     date: "2023-06-03",
//     status: "Cash",
//   },
//   {
//     key: "14",
//     label: "BL",
//     codeNumber: 514,
//     place: "LIB",
//     sender: "Sophia Wilson",
//     receiver: "Jacob Lewis",
//     amount: 80,
//     fee: 8,
//     mobileMoney: "2325698765",
//     date: "2023-01-01",
//     status: "Deposit",
//   },
//   {
//     key: "15",
//     label: "BL",
//     codeNumber: 515,
//     place: "LIB",
//     sender: "Ethan Scott",
//     receiver: "Ava Turner",
//     amount: 10,
//     fee: 1,
//     mobileMoney: null,
//     date: "2023-07-15",
//     status: "Not Paid",
//   },
//   {
//     key: "16",
//     label: "AC",
//     codeNumber: 516,
//     place: "CKY",
//     sender: "Charlotte Baker",
//     receiver: "Henry Ward",
//     amount: 70,
//     fee: 7,
//     mobileMoney: "2325632109",
//     date: "2023-04-22",
//     status: "Cash",
//   },
//   {
//     key: "17",
//     label: "AC",
//     codeNumber: 517,
//     place: "CKY",
//     sender: "Liam Fisher",
//     receiver: "Grace Mitchell",
//     amount: 160,
//     fee: 16,
//     mobileMoney: null,
//     date: "2023-01-01",
//     status: "Deposit",
//   },
//   {
//     key: "18",
//     label: "AC",
//     codeNumber: 518,
//     place: "CKY",
//     sender: "Zoe Turner",
//     receiver: "Jackson Lewis",
//     amount: 90,
//     fee: 9,
//     mobileMoney: "2325612345",
//     date: "2023-06-28",
//     status: "Not Paid",
//   },
// ];

// function Transfers() {
//   const [searchText, setSearchText] = useState("");
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const searchInput = useRef(null);

//   // Function to calculate the sum of amounts and fees based on filtered rows
//   const calculateSum = (filteredData) => {
//     let sumAmount = 0;
//     let sumFee = 0;

//     filteredData.forEach((record) => {
//       sumAmount += record.amount || 0;
//       sumFee += record.fee || 0;
//     });

//     return {
//       label: "Summary",
//       amount: sumAmount.toFixed(2),
//       fee: sumFee.toFixed(2),
//     };
//   };

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };
//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText("");
//   };
//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//       close,
//     }) => (
//       <div
//         style={{
//           padding: 8,
//         }}
//         onKeyDown={(e) => e.stopPropagation()}
//       >
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{
//             marginBottom: 8,
//             display: "block",
//           }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters)}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Reset
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               confirm({
//                 closeDropdown: false,
//               });
//               setSearchText(selectedKeys[0]);
//               setSearchedColumn(dataIndex);
//             }}
//           >
//             Filter
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               close();
//             }}
//           >
//             close
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined
//         style={{
//           color: filtered ? "#1677ff" : undefined,
//         }}
//       />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{
//             backgroundColor: "#ffc069",
//             padding: 0,
//           }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ""}
//         />
//       ) : (
//         text
//       ),
//   });
//   const columns = [
//     {
//       title: "Label",
//       dataIndex: "label",
//       key: "label",
//       width: "20%",
//       ...getColumnSearchProps("label"),
//     },
//     {
//       title: "Code #",
//       dataIndex: "codeNumber",
//       key: "codeNumber",
//       width: "20%",
//       ...getColumnSearchProps("codeNumber"),
//     },
//     {
//       title: "Place",
//       dataIndex: "place",
//       key: "place",
//       width: "20%",
//       ...getColumnSearchProps("place"),
//     },
//     {
//       title: "Sender",
//       dataIndex: "sender",
//       key: "sender",
//       width: "20%",
//       ...getColumnSearchProps("sender"),
//     },
//     {
//       title: "Receiver",
//       dataIndex: "receiver",
//       key: "receiver",
//       width: "20%",
//       ...getColumnSearchProps("receiver"),
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       key: "amount",
//       width: "20%",
//       ...getColumnSearchProps("amount"),
//     },
//     {
//       title: "Fee",
//       dataIndex: "fee",
//       key: "fee",
//       width: "20%",
//       ...getColumnSearchProps("fee"),
//     },
//     {
//       title: "Mobile",
//       dataIndex: "mobileMoney",
//       key: "mobileMoney",
//       width: "20%",
//       ...getColumnSearchProps("mobileMoney"),
//     },
//     {
//       title: "Date (YY/MM/DD)",
//       dataIndex: "date",
//       key: "date",
//       width: "20%",
//       ...getColumnSearchProps("date"),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: "20%",
//       ...getColumnSearchProps("status"),
//     },
//   ];

//   // Define the custom footer
//   const customFooter = (currentPageData) => {
//     const filteredData = currentPageData.filter((record) =>
//       Object.keys(record).some((key) =>
//         record[key].toString().toLowerCase().includes(searchText.toLowerCase())
//       )
//     );

//     const summaryData = calculateSum(filteredData);
//     const grandTotal = (parseFloat(summaryData.amount) + parseFloat(summaryData.fee)).toFixed(2);
    

//     return (
//       <tr>
//         <td style={{ fontWeight: 'bold', fontSize: '16px'}}>{summaryData.label}</td>
//         <td style={{ fontWeight: 'bold',paddingLeft: '60px', fontSize: '16px'  }}>Total Amount Sent: ${summaryData.amount}</td>
//         <td style={{ fontWeight: 'bold',paddingLeft: '60px', fontSize: '16px' }}>Total Fees: ${summaryData.fee}</td>
//         <td style={{ fontWeight: 'bold',paddingLeft: '60px',fontSize: '16px' }}>Grand Total: ${grandTotal}</td>
//         <td colSpan="6"></td>
//       </tr>
//     );
//   };

//   return (
//     <Table
//       columns={columns}
//       dataSource={data}
//       pagination={false}
//       scroll={{ x: "max-content" }} // Add horizontal scrolling if needed
//       footer={customFooter} // Assign the custom footer
//       getPopupContainer={(triggerNode) => triggerNode.parentNode} // Ensure the footer is correctly positioned
//     />
//   );
// }

// export default Transfers;

