'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function StrategyPage() {
  console.log('StrategyPage component rendering'); // Debug log

  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [formData, setFormData] = useState({
    strategyName: '',
    status: true,
  });
  const [detailedFormData, setDetailedFormData] = useState({
    strikePrice: '',
    tradingSymbol: '',
    instrumentToken: '',
    option: '',
  });
  const [submittedEntries, setSubmittedEntries] = useState([]);
  const [strikePrices] = useState(['21000', '21500', '22000', '22200', '22500', '23000']);

  // Function to fetch option details
  const fetchOptionDetails = async (strikePrice) => {
    console.log('Fetching options for strike price:', strikePrice); // Debug log
    if (!strikePrice) return;
    
    try {
      setIsFetching(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/options/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ strikePrice })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch option details');
      }

      const data = await response.json();
      console.log('Received options:', data.options); // Debug log
      setAvailableOptions(data.options);
    } catch (error) {
      console.error('Error fetching options:', error); // Debug log
      toast({
        title: "Error",
        description: "Failed to fetch option details",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleStrikePriceChange = (value) => {
    console.log('Strike price changed to:', value); // Debug log
    setDetailedFormData(prev => ({
      ...prev,
      strikePrice: value,
      tradingSymbol: '',
      instrumentToken: '',
      option: ''
    }));
    fetchOptionDetails(value);
  };

  const handleTradingSymbolChange = (value) => {
    console.log('Trading symbol changed to:', value); // Debug log
    const selectedOption = availableOptions.find(opt => opt.tradingSymbol === value);
    if (selectedOption) {
      setDetailedFormData(prev => ({
        ...prev,
        tradingSymbol: selectedOption.tradingSymbol,
        instrumentToken: selectedOption.instrumentToken.toString(),
        option: selectedOption.option
      }));
    }
  };

  const handleDetailedSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', detailedFormData); // Debug log
    
    // Check for duplicates
    const isDuplicate = submittedEntries.some(entry => 
      entry.strikePrice === detailedFormData.strikePrice && 
      entry.tradingSymbol === detailedFormData.tradingSymbol &&
      (isEditMode ? entry.id !== editingId : true)
    );

    if (isDuplicate) {
      toast({
        title: "Validation Error",
        description: "This combination of strike price and trading symbol already exists",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode) {
      setSubmittedEntries(submittedEntries.map(entry => 
        entry.id === editingId ? { ...entry, ...detailedFormData } : entry
      ));
      setIsEditMode(false);
      setEditingId(null);
    } else {
      const newEntry = {
        ...detailedFormData,
        id: Date.now(),
      };
      setSubmittedEntries([...submittedEntries, newEntry]);
    }
    
    setDetailedFormData({
      strikePrice: '',
      tradingSymbol: '',
      instrumentToken: '',
      option: '',
    });
    setIsDialogOpen(false);
  };

  const handleAddMore = () => {
    console.log('Opening dialog for new entry'); // Debug log
    setIsEditMode(false);
    setDetailedFormData({
      strikePrice: '',
      tradingSymbol: '',
      instrumentToken: '',
      option: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (entry) => {
    console.log('Editing entry:', entry); // Debug log
    setDetailedFormData({
      strikePrice: entry.strikePrice,
      tradingSymbol: entry.tradingSymbol,
      instrumentToken: entry.instrumentToken,
      option: entry.option,
    });
    setIsEditMode(true);
    setEditingId(entry.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    console.log('Deleting entry:', id); // Debug log
    setSubmittedEntries(submittedEntries.filter(entry => entry.id !== id));
  };



  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);
      
      if (!formData.strategyName.trim()) {
        toast({
          title: "Validation Error",
          description: "Strategy name is required",
          variant: "destructive",
        });
        return;
      }

      if (submittedEntries.length === 0) {
        toast({
          title: "Validation Error",
          description: "At least one strategy detail is required",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        strategyName: formData.strategyName.trim(),
        status: true, // Always true
        strategyDetails: submittedEntries.map(entry => ({
          strikePrice: Number(entry.strikePrice),
          tradingSymbol: entry.tradingSymbol.trim(),
          instrumentToken: entry.instrumentToken.trim(),
          type: entry.option
        }))
      };

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to create a strategy",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('http://localhost:8000/strategies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      toast({
        title: "Success",
        description: "Strategy created successfully!",
      });

      // Reset form after successful submission
      setSubmittedEntries([]);
      setFormData({
        strategyName: '',
        status: true,
      });

      router.push('/dashboard/strategy-display');
    } catch (error) {
      console.error('Error submitting strategy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create strategy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>New Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
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
                  checked={true}
                  disabled={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Strategy Details</CardTitle>
            <Button onClick={handleAddMore} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Entry
            </Button>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    submittedEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.strikePrice}</TableCell>
                        <TableCell>{entry.tradingSymbol}</TableCell>
                        <TableCell>{entry.instrumentToken}</TableCell>
                        <TableCell>{entry.option}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEdit(entry)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {submittedEntries.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleFinalSubmit} 
                  className="w-32"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit All'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          console.log('Dialog open state changed to:', open); // Debug log
          setIsDialogOpen(open);
          if (!open) {
            setIsEditMode(false);
            setEditingId(null);
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Strategy Details' : `Strategy Details: ${formData.strategyName}`}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleDetailedSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strikePrice">Strike Price</Label>
                <Select
                  value={detailedFormData.strikePrice}
                  onValueChange={handleStrikePriceChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Strike Price" />
                  </SelectTrigger>
                  <SelectContent>
                    {strikePrices.map((price) => (
                      <SelectItem key={price} value={price}>
                        {price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradingSymbol">Trading Symbol</Label>
                <Select
                  value={detailedFormData.tradingSymbol}
                  onValueChange={handleTradingSymbolChange}
                  disabled={!detailedFormData.strikePrice || isFetching}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Trading Symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOptions.map((option) => (
                      <SelectItem key={option.tradingSymbol} value={option.tradingSymbol}>
                        {option.tradingSymbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instrumentToken">Instrument Token</Label>
                <Input
                  id="instrumentToken"
                  value={detailedFormData.instrumentToken}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="option">Option</Label>
                <Input
                  id="option"
                  value={detailedFormData.option}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="flex space-x-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setIsEditMode(false);
                  setEditingId(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isFetching || !detailedFormData.instrumentToken || !detailedFormData.option}
                >
                  {isFetching ? 'Fetching...' : isEditMode ? 'Save Changes' : 'Submit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}