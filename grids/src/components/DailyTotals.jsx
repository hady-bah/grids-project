import React, { useState, useEffect } from "react";
import { supabase } from "../../createClient";
import CountUp from "react-countup";
import { Col, Row, Statistic, Typography, Divider, DatePicker } from "antd";

function DailyTotals() {
  const { Title } = Typography;
  const { RangePicker } = DatePicker;
  const formatter = (value) => (
    <span>
      <CountUp end={value} separator="," decimals={2} prefix="$ "/>
    </span>
  );
  const formatterCash = (value) => (
    <span style={{color:'green'}}>
      <CountUp end={value} separator="," decimals={2} prefix="$ "/>
    </span>
  );
  const formatterDeposit = (value) => (
    <span style={{color:'#23a6e8'}}>
      <CountUp end={value} separator="," decimals={2} prefix="$ "/>
    </span>
  );
  const [transfers, setTransfers] = useState([]);
  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalFee: 0,
    grandTotal: 0,
    totalDeposits: 0,
    cashTotal: 0,
    totalAmountAS: 0,
    totalFeeAS: 0,
    grandTotalAS: 0,
    totalDepositsAS: 0,
    cashTotalAS: 0,
    totalAmountBL: 0,
    totalFeeBL: 0,
    grandTotalBL: 0,
    totalDepositsBL: 0,
    cashTotalBL: 0,
    totalAmountAC: 0,
    totalFeeAC: 0,
    grandTotalAC: 0,
    totalDepositsAC: 0,
    cashTotalAC: 0,
    transactions: 0,
    transactionsAS: 0,
    transactionsBL: 0,
    transactionsAC: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTransfers(selectedDate);
  }, [selectedDate]);

  async function fetchTransfers(selectedDate) {
    // Format selected date to "yyyy-MM-dd"
    const formattedDate = selectedDate.toISOString().split("T")[0];

    // Fetch transfer records for the selected date from Supabase
    const { data, error } = await supabase
      .from("transfers")
      .select("*")
      .eq("date", formattedDate);

    if (error) {
      console.error("Error fetching data from Supabase:", error.message);
      return;
    }

    // Calculate the totals
    let totalAmount = 0;
    let totalFee = 0;
    let totalDeposits = 0;
    let totalAmountAS = 0;
    let totalFeeAS = 0;
    let totalDepositsAS = 0;
    let totalAmountBL = 0;
    let totalFeeBL = 0;
    let totalDepositsBL = 0;
    let totalAmountAC = 0;
    let totalFeeAC = 0;
    let totalDepositsAC = 0;
    let transactions = 0;
    let transactionsAS = 0;
    let transactionsBL = 0;
    let transactionsAC = 0;

    data.forEach((transfer) => {
      if (transfer.status !== "Not Paid") {
        totalAmount += transfer.amount;
        totalFee += transfer.fee;
        transactions ++;
      }

      if (transfer.status !== "Not Paid" && transfer.label === "AS") {
        totalAmountAS += transfer.amount;
        totalFeeAS += transfer.fee;
        transactionsAS ++;
      }

      if (transfer.status !== "Not Paid" && transfer.label === "BL") {
        totalAmountBL += transfer.amount;
        totalFeeBL += transfer.fee;
        transactionsBL ++;
      }

      if (transfer.status !== "Not Paid" && transfer.label === "AC") {
        totalAmountAC += transfer.amount;
        totalFeeAC += transfer.fee;
        transactionsAC ++;
      }

      if (transfer.status.toLowerCase() === "deposit") {
        totalDeposits += transfer.amount + transfer.fee;
      }

      if (transfer.status === "Deposit" && transfer.label === "AS") {
        totalDepositsAS += transfer.amount + transfer.fee;
      }

      if (transfer.status === "Deposit" && transfer.label === "BL") {
        totalDepositsBL += transfer.amount + transfer.fee;
      }

      if (transfer.status === "Deposit" && transfer.label === "AC") {
        totalDepositsAC += transfer.amount + transfer.fee;
      }
    });

    const grandTotal = totalAmount + totalFee;
    const grandTotalAS = totalAmountAS + totalFeeAS;
    const grandTotalBL = totalAmountBL + totalFeeBL;
    const grandTotalAC = totalAmountAC + totalFeeAC;

    const cashTotal = grandTotal - totalDeposits;
    const cashTotalAS = grandTotalAS - totalDepositsAS;
    const cashTotalBL = grandTotalBL - totalDepositsBL;
    const cashTotalAC = grandTotalAC - totalDepositsAC;

    setTransfers(data);
    setTotals({
      totalAmount,
      totalFee,
      grandTotal,
      totalDeposits,
      cashTotal,
      totalAmountAS,
      totalFeeAS,
      grandTotalAS,
      totalDepositsAS,
      cashTotalAS,
      totalAmountBL,
      totalFeeBL,
      grandTotalBL,
      totalDepositsBL,
      cashTotalBL,
      totalAmountAC,
      totalFeeAC,
      grandTotalAC,
      totalDepositsAC,
      cashTotalAC,
      transactions,
      transactionsAS,
      transactionsBL,
      transactionsAC,
    });
  }

  //to pick date range
  // const handleDateChange = (date, dateString) => {
  //   setSelectedDate(date);
  // };

  return (
    <>
      <Title level={2}>Daily summary for: {selectedDate.toDateString()}</Title>
      <Divider style={{ borderTopWidth: 2 }} />
      <Title level={4}>AS - BL - AC</Title>
      {/* <RangePicker onChange={handleDateChange} /> */}
      <Row gutter={80}>
        <Col>
          <Statistic
            title="Total Sent"
            value={totals.totalAmount}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Fees"
            value={totals.totalFee}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Grand Total"
            value={totals.grandTotal}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Deposits"
            value={totals.totalDeposits}
            precision={2}
            formatter={formatterDeposit}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotal}
            precision={2}
            formatter={formatterCash}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Transactions"
            value={totals.transactions}
          />
        </Col>
      </Row>

      <Divider style={{ borderTopWidth: 2 }} />
      <Title level={4}>AS</Title>
      <Row gutter={80}>
        <Col>
          <Statistic
            title="Total Sent"
            value={totals.totalAmountAS}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Fees"
            value={totals.totalFeeAS}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Grand Total"
            value={totals.grandTotalAS}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Deposits"
            value={totals.totalDepositsAS}
            precision={2}
            formatter={formatterDeposit}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotalAS}
            precision={2}
            formatter={formatterCash}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Transactions"
            value={totals.transactionsAS}
          />
        </Col>
      </Row>

      <Divider style={{ borderTopWidth: 2 }} />
      <Title level={4}>BL</Title>
      <Row gutter={80}>
        <Col>
          <Statistic
            title="Total Sent"
            value={totals.totalAmountBL}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Fees"
            value={totals.totalFeeBL}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Grand Total"
            value={totals.grandTotalBL}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Deposits"
            value={totals.totalDepositsBL}
            precision={2}
            formatter={formatterDeposit}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotalBL}
            precision={2}
            formatter={formatterCash}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Transactions"
            value={totals.transactionsBL}
          />
        </Col>
      </Row>

      <Divider style={{ borderTopWidth: 2 }} />
      <Title level={4}>AC</Title>
      <Row gutter={80}>
        <Col>
          <Statistic
            title="Total Sent"
            value={totals.totalAmountAC}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Fees"
            value={totals.totalFeeAC}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Grand Total"
            value={totals.grandTotalAC}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Deposits"
            value={totals.totalDepositsAC}
            precision={2}
            formatter={formatterDeposit}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotalAC}
            precision={2}
            formatter={formatterCash}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Transactions"
            value={totals.transactionsAC}
          />
        </Col>
      </Row>
    </>
  );
}

export default DailyTotals;
