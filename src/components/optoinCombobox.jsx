// components/optionCombobox.js
"use client";

import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const OptionCombobox = ({ 
  value,
  onChange,
  options = [],
  isLoading,
  onSearch,
  placeholder = "Select an option...",
  searchPlaceholder = "Type to search..."
}) => {
  const [open, setOpen] = React.useState(false);

  // Ensure options is always an array and value is a string
  const safeOptions = Array.isArray(options) ? options : [];
  const stringValue = value?.toString() || "";

  // Find the selected option for display
  const selectedOption = safeOptions.find(opt => opt.strikePrice?.toString() === stringValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedOption 
            ? `${selectedOption.strikePrice} - ${selectedOption.option}`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            onValueChange={onSearch}
            className="h-9"
          />
          <CommandEmpty>
            {isLoading ? 'Loading...' : 'No strike prices found'}
          </CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {safeOptions.map((option) => (
              <CommandItem
                key={`${option.strikePrice}-${option.option}`}
                value={option.strikePrice?.toString()}
                onSelect={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    stringValue === option.strikePrice?.toString() 
                      ? "opacity-100" 
                      : "opacity-0"
                  )}
                />
                {`${option.strikePrice} - ${option.option}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OptionCombobox;