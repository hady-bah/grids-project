import React, { useState, useEffect } from "react";
import { supabase } from "../../createClient";
import CountUp from "react-countup";
import { Col, Row, Statistic, Typography } from "antd";

function AllTimeTotals() {
  const { Title } = Typography;

  const formatter = (value) => (
    <span>
      <CountUp end={value} separator="," decimals={2} prefix="$ " />
    </span>
  );

  const formatterCash = (value) => (
    <span style={{ color: "green" }}>
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
      if (transfer.status !== "Not Paid") {
        totalAmount += transfer.amount;
        totalFee += transfer.fee;
        transactions++;
      }
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
            formatter={formatter}
          />
        </Col>
        <Col>
          <Statistic
            title="Total Profit"
            value={totals.totalFee}
            precision={2}
            formatter={formatterCash}
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
            value={totals.transactions}
          />
        </Col>
      </Row>
    </>
  );
}

export default AllTimeTotals;

