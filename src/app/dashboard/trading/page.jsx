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
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  
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
      { name: "Profit", value: 60, color: "#22c55e" },
      { name: "Loss", value: 40, color: "#ef4444" },
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
  
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 border rounded shadow">
            <p className="text-base font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
          </div>
        );
      }
      return null;
    };
  
    return (
      <div className="min-h-screen bg-background p-4">
        {/* Upper row - made more compact */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-12 mb-6">
          <Card className="lg:col-span-4">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-lg">NIFTY</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="flex items-center justify-between">
                <div
                  className={`text-xl font-bold ${
                    livePrice === null
                      ? "text-gray-500"
                      : Math.random() > 0.5
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {livePrice ? livePrice.toFixed(2) : "-----"}
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground mr-1">Put:</span>
                    <span className="text-sm font-medium">18,200</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground mr-1">Call:</span>
                    <span className="text-sm font-medium">18,300</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <MetricCard
            title="Total Trades"
            icon={<ChartCandlestick className="text-lg" />}
            metrics={[{ value: 5, label: "Trades" }]}
            className="lg:col-span-4"
          />
          <Card className="lg:col-span-4">
            <CardContent className="py-2 px-4">
              <div className="flex items-center justify-center">
                <PieChart width={200} height={120}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={40}
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
  
        {/* Lower row - made more prominent */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-2xl">Logs</CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-6">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-gray-300">
                <div className="font-sans text-base space-y-3">
                  <div className="text-blue-500">
                    {">"} Trade executed: PUT 18500 @ 150
                  </div>
                  <div className="text-green-500">{">"} Profit realized: +50</div>
                  <div className="text-red-500">{">"} Loss recorded: -40</div>
                  <div className="text-blue-500">
                    {">"} Trade executed: PUT 18500 @ 150
                  </div>
                  <div className="text-green-500">{">"} Profit realized: +50</div>
                  <div className="text-red-500">{">"} Loss recorded: -40</div>
                  <div className="text-blue-500">
                    {">"} Trade executed: PUT 18500 @ 150
                  </div>
                  <div className="text-green-500">{">"} Profit realized: +50</div>
                  <div className="text-red-500">{">"} Loss recorded: -40</div>
                  <div className="text-blue-500">
                    {">"} Trade executed: PUT 18500 @ 150
                  </div>
                  <div className="text-green-500">{">"} Profit realized: +50</div>
                  <div className="text-red-500">{">"} Loss recorded: -40</div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
  
          <Card className="shadow-lg">
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-2xl">Detailed Trade Log</CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-6">
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
                      <TableCell className="text-base">{trade.entryPrice}</TableCell>
                      <TableCell className="text-base">{trade.exitPrice}</TableCell>
                      <TableCell
                        className={`text-base font-medium ${
                          trade.profit > 0 ? "text-green-500" : "text-red-500"
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
  
  function MetricCard({ title, icon, metrics, className }) {
    return (
      <div
        className={`rounded-lg border text-card-foreground shadow-sm hover:shadow-md transition-shadow ${className}`}
      >
        <div className="h-[120px] p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-lg">{icon}</div>
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          </div>
  
          <div className="flex-1 flex flex-col items-center justify-center">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="h-8 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                </div>
                <div className="h-4 flex items-center justify-center">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default TradingDashboard;