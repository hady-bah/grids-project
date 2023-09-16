import React, { useState, useEffect } from "react";
import { supabase } from "../../createClient";
import CountUp from "react-countup";
import { Col, Row, Statistic, Typography, Divider } from "antd";

function AllTimeTotals() {
  const { Title } = Typography;
  const formatter = (value) => (
    <span>
      $ <CountUp end={value} separator="," />
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
    totalAmountBL: 0, // Add BL totals
    totalFeeBL: 0,
    grandTotalBL: 0,
    totalDepositsBL: 0,
    cashTotalBL: 0,
    totalAmountAC: 0, // Add AC totals
    totalFeeAC: 0,
    grandTotalAC: 0,
    totalDepositsAC: 0,
    cashTotalAC: 0,
  });

  useEffect(() => {
    fetchTransfers();
  }, []);

  async function fetchTransfers() {
    // Fetch all transfer records from Supabase
    const { data, error } = await supabase.from("transfers").select("*");

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
    let totalAmountBL = 0; // Initialize BL totals
    let totalFeeBL = 0;
    let totalDepositsBL = 0;
    let totalAmountAC = 0; // Initialize AC totals
    let totalFeeAC = 0;
    let totalDepositsAC = 0;

    data.forEach((transfer) => {
      if (transfer.status !== "Not Paid") {
        totalAmount += transfer.amount;
        totalFee += transfer.fee;
      }

      if (transfer.status !== "Not Paid" && transfer.label === "AS") {
        totalAmountAS += transfer.amount;
        totalFeeAS += transfer.fee;
      }

      if (transfer.status !== "Not Paid" && transfer.label === "BL") {
        totalAmountBL += transfer.amount; // Add to BL totals
        totalFeeBL += transfer.fee;
      }

      if (transfer.status !== "Not Paid" && transfer.label === "AC") {
        totalAmountAC += transfer.amount; // Add to AC totals
        totalFeeAC += transfer.fee;
      }

      // Check if the label is "Deposit" and include it in totalDeposits
      if (transfer.status === "Deposit") {
        totalDeposits += transfer.amount + transfer.fee;
      }

      if (transfer.status === "Deposit" && transfer.label === "AS") {
        totalDepositsAS += transfer.amount + transfer.fee;
      }

      if (transfer.status === "Deposit" && transfer.label === "BL") {
        totalDepositsBL += transfer.amount + transfer.fee; // Add to BL totalDeposits
      }

      if (transfer.status === "Deposit" && transfer.label === "AC") {
        totalDepositsAC += transfer.amount + transfer.fee; // Add to AC totalDeposits
      }
    });

    // Calculate the grand total
    const grandTotal = totalAmount + totalFee;
    const grandTotalAS = totalAmountAS + totalFeeAS;
    const grandTotalBL = totalAmountBL + totalFeeBL; // Calculate BL grand total
    const grandTotalAC = totalAmountAC + totalFeeAC; // Calculate AC grand total

    // Calculate the cash total by subtracting total deposits from grand total
    const cashTotal = grandTotal - totalDeposits;
    const cashTotalAS = grandTotalAS - totalDepositsAS;
    const cashTotalBL = grandTotalBL - totalDepositsBL; // Calculate BL cash total
    const cashTotalAC = grandTotalAC - totalDepositsAC; // Calculate AC cash total

    // Update the state with the calculated totals
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
      totalAmountBL, // Add BL totals
      totalFeeBL,
      grandTotalBL,
      totalDepositsBL,
      cashTotalBL,
      totalAmountAC, // Add AC totals
      totalFeeAC,
      grandTotalAC,
      totalDepositsAC,
      cashTotalAC,
    });
  }

  return (
    <>
      <Title level={2}>All time summary:</Title>
      <Divider style={{ borderTopWidth: 2 }} />
      <Title level={4}>AS - BL - AC</Title>
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
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotal}
            precision={2}
            formatter={formatter}
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
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotalAS}
            precision={2}
            formatter={formatter}
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
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotalBL}
            precision={2}
            formatter={formatter}
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
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Cash"
            value={totals.cashTotalAC}
            precision={2}
            formatter={formatter}
          />
        </Col>
      </Row>
    </>
  );
}

export default AllTimeTotals;
