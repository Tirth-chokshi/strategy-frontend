"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function StrategyDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { strategy_id } = useParams();
  

  const [isLoading, setIsLoading] = useState(true);
  const [strategyDetails, setStrategyDetails] = useState(null);

  useEffect(() => {
    if (!strategy_id) return;

    const fetchStrategyDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please login to view strategy details",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch(`http://localhost:8000/strategies/get/${strategy_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStrategyDetails(data);
      } catch (error) {
        console.error("Error fetching strategy details:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch strategy details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategyDetails();
  }, [strategy_id, toast]);

//   if (isLoading) {
//     return <div className="min-h-screen p-4 bg-gray-50 flex justify-center items-center">Loading...</div>;
//   }

//   if (!strategyDetails) {
//     return <div className="min-h-screen p-4 bg-gray-50 text-center">No strategy details available.</div>;
//   }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Strategy Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                <strong>Strategy Name:</strong> {strategyDetails.strategyName}
              </p>
              <p>
                <strong>Status:</strong> {strategyDetails.status ? "Active" : "Inactive"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategy Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strike Price</TableHead>
                    <TableHead>Trading Symbol</TableHead>
                    <TableHead>Instrument Token</TableHead>
                    <TableHead>Option</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {strategyDetails.strategyDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No details available
                      </TableCell>
                    </TableRow>
                  ) : (
                    strategyDetails.strategyDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.strikePrice}</TableCell>
                        <TableCell>{detail.tradingSymbol}</TableCell>
                        <TableCell>{detail.instrumentToken}</TableCell>
                        <TableCell>{sttype}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => router.push("/strategies")}>Back to Strategies</Button>
        </div>
      </div>
    </div>
  );
}
