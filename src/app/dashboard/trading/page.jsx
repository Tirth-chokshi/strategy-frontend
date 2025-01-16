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
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { PrinterCheckIcon } from "lucide-react";
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
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Market Data Card */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Market Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`text-2xl font-bold ${
                  livePrice === null
                    ? "text-gray-500"
                    : Math.random() > 0.5
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {livePrice ? livePrice.toFixed(2) : "-----"}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Put Strike</p>
                  <p className="text-lg font-medium">18,200</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Call Strike</p>
                  <p className="text-lg font-medium">18,300</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <MetricCard
          title="Total Trades"
          icon={<PrinterCheckIcon className="text-2xl" />}
          metrics={[{ value: 5, label: "Trades" }]}
          className="lg:col-span-3"
        />

        {/* Trade Statistics */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Trade Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[250px] flex items-center justify-center">
              <PieChart width={250} height={250}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
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

        {/* Rest of the component remains the same */}
      </div>

      {/* Logs Section */}
      <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted">
              <div className="font-mono text-sm">
                <div className="text-muted-foreground">
                  {">"} Trade executed: PUT 18500 @ 150
                </div>
                <div className="text-muted-foreground">
                  {">"} Position closed: CALL 18600 @ 140
                </div>
                <div className="text-green-500">{">"} Profit realized: +50</div>
                <div className="text-red-500">{">"} Loss recorded: -40</div>
                <div className="text-muted-foreground">
                  {">"} Trade executed: PUT 18500 @ 150
                </div>
                <div className="text-muted-foreground">
                  {">"} Position closed: CALL 18600 @ 140
                </div>
                <div className="text-green-500">{">"} Profit realized: +50</div>
                <div className="text-red-500">{">"} Loss recorded: -40</div>
                <div className="text-muted-foreground">
                  {">"} Trade executed: PUT 18500 @ 150
                </div>
                <div className="text-muted-foreground">
                  {">"} Position closed: CALL 18600 @ 140
                </div>
                <div className="text-green-500">{">"} Profit realized: +50</div>
                <div className="text-red-500">{">"} Loss recorded: -40</div>
                <div className="text-muted-foreground">
                  {">"} Trade executed: PUT 18500 @ 150
                </div>
                <div className="text-muted-foreground">
                  {">"} Position closed: CALL 18600 @ 140
                </div>
                <div className="text-green-500">{">"} Profit realized: +50</div>
                <div className="text-red-500">{">"} Loss recorded: -40</div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Trade Log</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strike</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade, index) => (
                  <TableRow key={index}>
                    <TableCell>{trade.strike}</TableCell>
                    <TableCell>{trade.type}</TableCell>
                    <TableCell>{trade.entryPrice}</TableCell>
                    <TableCell>{trade.exitPrice}</TableCell>
                    <TableCell
                      className={
                        trade.profit > 0 ? "text-green-500" : "text-red-500"
                      }
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
      <div className="h-[200px] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg">{icon}</div>
          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {metric.value}
                </span>
              </div>
              <div className="h-6 flex items-center justify-center">
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
