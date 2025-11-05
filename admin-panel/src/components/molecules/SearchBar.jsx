import { useState } from 'react';
import { Input } from '../ui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * SearchBar - Search input with icon and clear button
 * 
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional classes
 */
export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm...', 
  className 
}) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

