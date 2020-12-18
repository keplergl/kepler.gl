import {FunctionComponent, ComponentType} from 'react';

export type ItemSelectorProps = {
  selectedItems: ReadonlyArray<string | number | boolean | object>,
  options: ReadonlyArray<string | number | boolean | object>,
  onChange: (items: ReadonlyArray<string | number | boolean | object>) => void,
  fixedOptions?: any[],
  erasable?: boolean,
  showArrow?: boolean,
  searchable?: boolean,
  displayOption?: string | ((opt: any) => any),
  getOptionValue?: string | ((opt: any) => any),
  filterOption?: string | ((opt: any) => any),
  placement?: string,
  disabled?: boolean,
  isError?: boolean,
  multiSelect?: boolean,
  inputTheme?: string,
  size?: string,
  onBlur?: () => void,
  placeholder?: string,
  closeOnSelect?: boolean,
  typeaheadPlaceholder?: string,
  DropdownHeaderComponent?: ComponentType<any> | null,
  DropDownRenderComponent?: ComponentType<any>,
  DropDownLineItemRenderComponent?: ComponentType<any>,
  CustomChickletComponent?: ComponentType<any>
};

const ItemSelector: FunctionComponent<ItemSelectorProps>;
export default ItemSelector;
