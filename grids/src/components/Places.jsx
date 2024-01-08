import React, { useRef, useState, useEffect, useContext } from "react";
import Highlighter from "react-highlight-words";import { supabase } from "../../createClient";
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
    Divider
  } from "antd";

import "../styles/styles.css";
import AddPlace from "./AddPlace";

import {
    SearchOutlined,
    DeleteOutlined,
    PrinterOutlined,
    ConsoleSqlOutlined,
    QuestionCircleOutlined,
    FilterOutlined,
    EyeOutlined,
    EditOutlined
  } from "@ant-design/icons";


//editing cells
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

function Places() {
  const [places, setPlaces] = useState([]);
  const { Title, Text } = Typography;


  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    const { data } = await supabase
      .from("places")
      .select("*")
      .order("name", { ascending: false });
    setPlaces(data);
  }

  //notifications
  const openSuccesNotification = () => {
    notification.success({
      message: "Updated successfully",
      description: "The place was successfully updated to the database.",
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

  //search filter
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  
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
      title: "Place",
      dataIndex: "name",
      key: "name",
      width: "10%",
      editable: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "10%",
      editable: true,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      width: "10%",
      editable: true,
      ...getColumnSearchProps("number"),
    },
    {
      title: "Oprator",
      dataIndex: "operator",
      key: "operator",
      width: "10%",
      editable: true,
      ...getColumnSearchProps("operator"),
    },
    // Operation column renders delete button
    {
        title: "Action",
        width: "2%",
        render: (_, record) => (
          <div>
            <Tooltip title="Delete" placement="right">
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
    await supabase.from("places").delete().eq("id", id);

    // Filter deleted record from UI
    setPlaces(places.filter((t) => t.id !== id));

    openDeleteNotification();
  };

  //handle edit columns
  const [loading, setLoading] = useState(false);

  const handleSave = async (row) => {
    setLoading(true); // disable save

    // Optimistic update
    setPlaces((prevPlaces) => {
      // Find index of updated row
      const index = prevPlaces.findIndex((t) => t.id === row.id);

      // Create new array with updated row
      const updated = [...prevPlaces];
      updated[index] = row;

      return updated;
    });

    try {
      const { data, error } = await supabase
        .from("places")
        .update({ ...row })
        .eq("id", row.id);

      if (error) {
        // Revert optimistic update
        throw error;
      }

      // Refresh data after update
      fetchPlaces();
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


  return (
    <>
      <span class="gradient-text">Places</span>
      <Divider style={{ borderTopWidth: 2 }} />

      <div style={{display:"flex", justifyContent:"center" }}> 
      <AddPlace/>
      </div> 

      <Title style={{ paddingTop: "20px", paddingBottom: "10px" }} level={5}>
        <EyeOutlined /> View
        <span style={{ marginLeft: "10px" }}>
          <Tooltip
            placement="right"
            title="View, search, edit and delete"
          >
            <QuestionCircleOutlined
              style={{ color: "gray", fontSize: "15px", cursor: "help" }}
            />
          </Tooltip>
        </span>
      </Title>  
      <div>
        <Table
          dataSource={places}
          components={components}
          rowClassName={() => "editable-row"}
          columns={editColumns}
          pagination={{
            position: ["bottomCenter"], // Centered at the bottom
            pageSize: 10, // transactions per page size
          }}
        //   scroll={{
        //     x: "calc(700px + 50%)",
        //   }}
        />
      </div>
    </>
  );
}

export default Places;
