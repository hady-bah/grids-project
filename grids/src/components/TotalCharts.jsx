import React, { useState, useEffect, PureComponent } from "react";
import { supabase } from "../../createClient";
import CountUp from "react-countup";
import { Col, Row, Statistic, Typography, Divider, DatePicker } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function TotalCharts() {

  const [weekTransfers, setWeekTransfers] = useState([]);

  async function fetchWeekTransfers(){
    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('date, amount, fee, total_amount_fee')
        .order("time", { ascending: false });

      if (error) {
        console.error('Error fetching weekly transfers:', error.message);
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
            totalAmountFee: transfer.total_amount_fee,
            transfers: [transfer] // Initialize transfers array with the current transfer
          };
          daysProcessed++;
        } else {
          groupedTransfers[transferDate].totalAmount += transfer.amount;
          groupedTransfers[transferDate].totalFee += transfer.fee;
          groupedTransfers[transferDate].totalAmountFee += transfer.total_amount_fee;
          groupedTransfers[transferDate].transfers.push(transfer);
        }
      });

      // Convert grouped transfers to array of objects
      const weekTransfers = Object.values(groupedTransfers);

      setWeekTransfers(weekTransfers);
    } catch (error) {
      console.error('Error fetching weekly transfers:', error.message);
    }
  }

  useEffect(()=>{
    fetchWeekTransfers();
  },[]);

  console.log(weekTransfers);


  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={weekTransfers}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="totalFee" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default TotalCharts;


    // try {
    //   const { data, error } = await supabase
    //     .from('transfers')
    //     .select('date, amount, fee, total_amount_fee')
    //     .order("time", { ascending: false })
    //     .limit(7);

    //   if (error) {
    //     console.error('Error fetching weekly transfers:', error.message);
    //     return;
    //   }

    //   setWeekTransfers(data);
    // } catch (error) {
    //   console.error('Error fetching weekly transfers:', error.message);
    // }
