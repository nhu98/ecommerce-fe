import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';

export interface SearchBoxProps {
  onSearch: (value: string) => void;
  placeholder: string;
}

const SearchBox = ({ onSearch, placeholder }: SearchBoxProps) => {
  const [searchValue, setSearchValue] = useState('');

  // Dùng useMemo để chỉ tạo debounce function một lần
  const debouncedSearch = useMemo(() => debounce(onSearch, 1200), [onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    debouncedSearch(event.target.value);
  };

  return (
    <div className="flex w-full items-center">
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
