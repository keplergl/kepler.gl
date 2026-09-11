// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@sqlrooms/ui';
import {Check, ChevronsUpDown} from 'lucide-react';
import React, {useMemo, useState} from 'react';
import type {KeplerTableSourceOption} from '../keplerTableSelection';

export type KeplerTableSourceSelectorProps = {
  disabled?: boolean;
  emptyMessage?: string;
  options: KeplerTableSourceOption[];
  popoverAlign?: 'start' | 'center' | 'end';
  popoverClassName?: string;
  searchPlaceholder?: string;
  selectedValue?: string;
  triggerClassName?: string;
  onSelect: (option: KeplerTableSourceOption) => void;
  renderTrigger?: (props: {
    disabled: boolean;
    open: boolean;
    selectedOption?: KeplerTableSourceOption;
  }) => React.ReactNode;
};

const DefaultTrigger: React.FC<{
  disabled: boolean;
  selectedOption?: KeplerTableSourceOption;
}> = ({disabled, selectedOption}) => (
  <Button
    type="button"
    variant="outline"
    className="h-8 w-full justify-between px-2 text-xs"
    disabled={disabled}
  >
    <span className="min-w-0 truncate">{selectedOption?.label ?? 'Select data source'}</span>
    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-60" />
  </Button>
);

export const KeplerTableSourceSelector: React.FC<KeplerTableSourceSelectorProps> = ({
  disabled = false,
  emptyMessage = 'No tables found.',
  options,
  popoverAlign = 'start',
  popoverClassName,
  searchPlaceholder = 'Search tables...',
  selectedValue,
  triggerClassName,
  onSelect,
  renderTrigger
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = useMemo(
    () => options.find(option => option.value === selectedValue),
    [options, selectedValue]
  );

  const handleSelect = (option: KeplerTableSourceOption) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={nextOpen => {
        if (!disabled) {
          setOpen(nextOpen);
        }
      }}
      modal={false}
    >
      <PopoverTrigger asChild>
        <div className={triggerClassName}>
          {renderTrigger ? (
            renderTrigger({disabled, open, selectedOption})
          ) : (
            <DefaultTrigger disabled={disabled} selectedOption={selectedOption} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        align={popoverAlign}
        className={cn('w-[320px] p-0 text-xs', popoverClassName)}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="text-xs" />
          <CommandList>
            <CommandEmpty className="text-xs">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  className="text-xs"
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      'mr-1 h-3.5 w-3.5 shrink-0',
                      option.value === selectedValue ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span
                    className="h-3 w-3 shrink-0"
                    style={{backgroundColor: `rgb(${option.color.join(',')})`}}
                  />
                  <span className="min-w-0 flex-1 truncate font-semibold">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
