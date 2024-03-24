import React, { useState, useEffect } from "react";
import { supabase } from "../../createClient";
import CountUp from "react-countup";
import { Col, Row, Statistic, Typography } from "antd";

function AllTimeTotals() {
  const { Title } = Typography;

  const formatter = (value) => (
    <span style={{fontSize: "17px", color:'#8884d8'}}>
      <CountUp end={value} separator="," decimals={2} prefix="$ "  />
    </span>
  );

  const formatterTrans = (value) => (
    <span style={{fontSize: "17px" }}>
      <CountUp end={value} separator=","/>
    </span>
  );

  const formatterProfit = (value) => (
    <span style={{ color: "#82ca9d", fontSize: "17px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );

  const formatterSent = (value) => (
    <span style={{ color: "#413ea0", fontSize: "17px" }}>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );

  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalFee: 0,
    grandTotal: 0,
    transactions: 0,
  });

  useEffect(() => {
    fetchTransfers();
  }, []);

  async function fetchTransfers() {
    const { data, error } = await supabase.from("transfers").select("*");

    if (error) {
      console.error("Error fetching data from Supabase:", error.message);
      return;
    }

    let totalAmount = 0;
    let totalFee = 0;
    let transactions = 0;

    data.forEach((transfer) => {
        totalAmount += transfer.amount;
        totalFee += transfer.fee;
        transactions++;
    });

    const grandTotal = totalAmount + totalFee;

    setTotals({
      totalAmount,
      totalFee,
      grandTotal,
      transactions,
    });
  }

  return (
    <>
      <Row gutter={80}>
        <Col>
          <Statistic
            title="Total Sent"
            value={totals.totalAmount}
            formatter={formatterSent}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Profit"
            value={totals.totalFee}
            precision={2}
            formatter={formatterProfit}
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
            title="Total Transactions"
            formatter={formatterTrans}
            value={totals.transactions}
          />
        </Col>
      </Row>
    </>
  );
}

export default AllTimeTotals;

