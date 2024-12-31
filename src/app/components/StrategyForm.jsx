// app/components/StrategyForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StrategyFormData {
  strategyName: string;
  status: boolean;
}

interface DetailedStrategyFormData {
  strikePrice: string;
  tradingSymbol: string;
  instrumentToken: string;
  type: string;
}

export default function StrategyForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StrategyFormData>({
    strategyName: '',
    status: false,
  });
  const [detailedFormData, setDetailedFormData] = useState<DetailedStrategyFormData>({
    strikePrice: '',
    tradingSymbol: '',
    instrumentToken: '',
    type: '',
  });

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleDetailedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the detailed form submission here
    console.log('Initial Form Data:', formData);
    console.log('Detailed Form Data:', detailedFormData);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>New Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="strategyName">Strategy Name</Label>
              <Input
                id="strategyName"
                value={formData.strategyName}
                onChange={(e) => setFormData({ ...formData, strategyName: e.target.value })}
                className="w-full"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="status">Strategy Status</Label>
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Strategy Details: {formData.strategyName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDetailedSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strikePrice">Strike Price</Label>
              <Input
                id="strikePrice"
                value={detailedFormData.strikePrice}
                onChange={(e) => setDetailedFormData({ ...detailedFormData, strikePrice: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tradingSymbol">Trading Symbol</Label>
              <Input
                id="tradingSymbol"
                value={detailedFormData.tradingSymbol}
                onChange={(e) => setDetailedFormData({ ...detailedFormData, tradingSymbol: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrumentToken">Instrument Token</Label>
              <Input
                id="instrumentToken"
                value={detailedFormData.instrumentToken}
                onChange={(e) => setDetailedFormData({ ...detailedFormData, instrumentToken: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={detailedFormData.type}
                onChange={(e) => setDetailedFormData({ ...detailedFormData, type: e.target.value })}
                required
              />
            </div>

            <div className="flex space-x-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}