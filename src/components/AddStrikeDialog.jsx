"use client";
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AddStrikeDialog = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [strikeInputValue, setStrikeInputValue] = useState('');
  const [strikePriceSuggestions, setStrikePriceSuggestions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);
  
  const [detailedFormData, setDetailedFormData] = useState({
    strikePrice: '',
    tradingSymbol: '',
    instrumentToken: '',
    type: ''
  });

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Fetch strike price suggestions
  const fetchStrikePriceSuggestions = async (query) => {
    if (!query || query.length === 0) {
      setStrikePriceSuggestions([]);
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/options/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setStrikePriceSuggestions(data.suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch strike price suggestions",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchStrikePriceSuggestions, 300),
    []
  );

  // Fetch option details
  const fetchOptionDetails = async (strikePrice) => {
    if (!strikePrice) return;
    
    try {
      setIsFetching(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/options/details', {
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
      setAvailableOptions(data.options);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch option details",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleTradingSymbolChange = (value) => {
    const selectedOption = availableOptions.find(opt => opt.tradingSymbol === value);
    if (selectedOption) {
      setDetailedFormData(prev => ({
        ...prev,
        tradingSymbol: selectedOption.tradingSymbol,
        instrumentToken: selectedOption.instrumentToken.toString(),
        type: selectedOption.option
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(detailedFormData);
  };

  const handleClose = () => {
    setDetailedFormData({
      strikePrice: '',
      tradingSymbol: '',
      instrumentToken: '',
      type: ''
    });
    setStrikeInputValue('');
    setStrikePriceSuggestions([]);
    setAvailableOptions([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Strike</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strikePrice">Strike Price</Label>
            <div className="relative">
              <Input
                id="strikePrice"
                type="text"
                value={strikeInputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setStrikeInputValue(value);
                  debouncedFetchSuggestions(value);
                }}
                className="w-full"
                placeholder="Type to search strike prices..."
              />
              {isLoadingSuggestions && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
              {strikePriceSuggestions.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-48 overflow-auto">
                  {strikePriceSuggestions.map((price) => (
                    <div
                      key={price}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStrikeInputValue(price.toString());
                        setDetailedFormData(prev => ({
                          ...prev,
                          strikePrice: price.toString()
                        }));
                        fetchOptionDetails(price.toString());
                        setStrikePriceSuggestions([]);
                      }}
                    >
                      {price}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            <Label htmlFor="type">Option Type</Label>
            <Input
              id="type"
              value={detailedFormData.type}
              disabled
              className="bg-gray-100"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isFetching || !detailedFormData.instrumentToken || !detailedFormData.type}
            >
              {isLoading ? "Adding..." : "Add Strike"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStrikeDialog;