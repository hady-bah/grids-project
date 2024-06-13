import React, { useState, useEffect, PureComponent } from "react";
import { supabase } from "../../createClient";
import CountUp from "react-countup";
import { Col, Row, Statistic, Typography, Divider, DatePicker, message } from "antd";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function TotalCharts() {

  const [weekTransfers, setWeekTransfers] = useState([]);

  async function fetchWeekTransfers(){
    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('date, amount, fee')
        .order("time", { ascending: false });
  
      if (error) {
        message.error('Error fetching weekly transfers:', error.message);
        return;
      }
  
      // Group and sum transfers by date
      const groupedTransfers = {};
      let daysProcessed = 0;
      data.forEach(transfer => {
        if (daysProcessed >= 7) return; // Exit loop if 7 days have been processed
        const transferDate = transfer.date;
        if (!groupedTransfers[transferDate]) {
          groupedTransfers[transferDate] = {
            date: transferDate,
            totalAmount: transfer.amount,
            totalFee: transfer.fee,
            totalAmountFee: transfer.amount + transfer.fee, // Calculate total amount fee
            transfers: [transfer] // Initialize transfers array with the current transfer
          };
          daysProcessed++;
        } else {
          groupedTransfers[transferDate].totalAmount += transfer.amount;
          groupedTransfers[transferDate].totalFee += transfer.fee;
          groupedTransfers[transferDate].totalAmountFee += transfer.amount + transfer.fee; // Calculate total amount fee
          groupedTransfers[transferDate].transfers.push(transfer);
        }
      });
  
      // Convert grouped transfers to array of objects
      const weekTransfers = Object.values(groupedTransfers);
  
      setWeekTransfers(weekTransfers);
    } catch (error) {
      message.error('Error fetching weekly transfers:', error.message);
    }
  }

  useEffect(()=>{
    fetchWeekTransfers();
  },[]);

  // console.log(weekTransfers);


  return (
    <>
      <ResponsiveContainer>
          <ComposedChart
            width={500}
            height={400}
            data={weekTransfers}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="date" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="totalAmountFee" name = 'Total' fill="#8884d8" stroke="#8884d8" />
            <Bar dataKey="totalAmount" name = 'Sent' stackId="a" barSize={20} fill="#413ea0" />
            <Bar type="monotone" dataKey="totalFee" stackId="a" name = 'Profit' fill="#82ca9d" />
          </ComposedChart>
        </ResponsiveContainer>
    </>
  );
}

export default TotalCharts;

//#8884d8 #413ea0