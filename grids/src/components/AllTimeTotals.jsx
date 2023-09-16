import React, { useState, useEffect } from "react";
import { supabase } from "../../createClient";
import CountUp from "react-countup";
import { Col, Row, Statistic } from "antd";

function AllTimeTotals() {
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

    data.forEach((transfer) => {
    if(transfer.status !== "Not Paid"){
      totalAmount += transfer.amount;
      totalFee += transfer.fee;
    }

      // Check if the label is "Deposit" and include it in totalDeposits
      if (transfer.status === "Deposit") {
        totalDeposits += transfer.amount + transfer.fee;
      }
    });

    // Calculate the grand total
    const grandTotal = totalAmount + totalFee;

    // Calculate the cash total by subtracting total deposits from grand total
    const cashTotal = grandTotal - totalDeposits;

    // Update the state with the calculated totals
    setTransfers(data);
    setTotals({
      totalAmount,
      totalFee,
      grandTotal,
      totalDeposits,
      cashTotal,
    });
  }

  return (
    <>
    <Row gutter={80}>
      <Col >
        <Statistic
          title="Total Sent"
          value={totals.totalAmount}
          formatter={formatter}
        />
      </Col>
      <Col >
        <Statistic
          title="Total Fees"
          value={totals.totalFee}
          precision={2}
          formatter={formatter}
        />
      </Col>
      <Col >
        <Statistic
          title="Grand Total"
          value={totals.grandTotal}
          precision={2}
          formatter={formatter}
        />
      </Col>
      <Col >
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
    </>
  );
}

export default AllTimeTotals;
