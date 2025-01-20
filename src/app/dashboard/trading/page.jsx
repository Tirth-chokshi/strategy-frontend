"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartCandlestick } from "lucide-react";

const TradingDashboard = () => {
  const [livePrice, setLivePrice] = React.useState(null);
  const [trades, setTrades] = React.useState([
    {
      strike: 18500,
      type: "PUT",
      entryPrice: 150,
      exitPrice: 200,
      profit: 50,
      loss: 0,
    },
    {
      strike: 18600,
      type: "CALL",
      entryPrice: 180,
      exitPrice: 140,
      profit: 0,
      loss: 40,
    },
  ]);

  const pieData = [
    { name: "Profit", value: 60, color: "#16a34a" },
    { name: "Loss", value: 40, color: "#dc2626" },
  ];

  React.useEffect(() => {
    const eventSource = new EventSource(`${apiurl}/trade/live`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLivePrice(data.price);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="text-base font-medium">
            {`${payload[0].name}`}
            <span
              className={
                payload[0].name === "Profit" ? "text-green-600" : "text-red-600"
              }
            >
              ({payload[0].name === "Profit" ? "+" : "-"}
              {payload[0].value}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-12 mb-8">
        <Card className="lg:col-span-4">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">NIFTY</h3>
                <div
                  className={`text-xl font-bold ${
                    livePrice === null
                      ? "text-gray-500"
                      : Math.random() > 0.5
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {livePrice ? livePrice.toFixed(2) : "-----"}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-sm text-muted-foreground mr-1">
                    Put:
                  </span>
                  <span className="text-sm font-medium">18,200</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground mr-1">
                    Call:
                  </span>
                  <span className="text-sm font-medium">18,300</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Trades</h3>
                <div className="text-xl font-bold">5</div>
              </div>
              <ChartCandlestick className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex gap-4">
                  <span className="text-green-600">●</span> Profit
                  <span className="text-red-600">●</span> Loss
                </div>
              </div>
              <PieChart width={100} height={80}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={30}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="py-6">
            <CardTitle className="text-2xl font-bold">Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-black">
              <div className="font-mono text-base text-white space-y-3">
                <div>{">"} Trade executed: PUT 18500 @ 150</div>
                <div className="text-green-400">{">"} Profit realized: +50</div>
                <div className="text-red-400">{">"} Loss recorded: -40</div>
                <div>{">"} Trade executed: PUT 18500 @ 150</div>
                <div className="text-green-400">{">"} Profit realized: +50</div>
                <div className="text-red-400">{">"} Loss recorded: -40</div>
                <div>{">"} Trade executed: PUT 18500 @ 150</div>
                <div className="text-green-400">{">"} Profit realized: +50</div>
                <div className="text-red-400">{">"} Loss recorded: -40</div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="py-6">
            <CardTitle className="text-2xl font-bold">
              Detailed Trade Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-lg">Strike</TableHead>
                  <TableHead className="text-lg">Type</TableHead>
                  <TableHead className="text-lg">Entry</TableHead>
                  <TableHead className="text-lg">Exit</TableHead>
                  <TableHead className="text-lg">P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade, index) => (
                  <TableRow key={index} className="h-16">
                    <TableCell className="text-base">{trade.strike}</TableCell>
                    <TableCell className="text-base">{trade.type}</TableCell>
                    <TableCell className="text-base">
                      {trade.entryPrice}
                    </TableCell>
                    <TableCell className="text-base">
                      {trade.exitPrice}
                    </TableCell>
                    <TableCell
                      className={`text-base font-medium ${
                        trade.profit > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trade.profit > 0 ? `+${trade.profit}` : `-${trade.loss}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingDashboard;
