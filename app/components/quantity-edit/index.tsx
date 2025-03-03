'use client';
import React, { useState } from 'react';

interface Props {
  quantity?: number;
  onChange?: (quantity: number) => void;
}

const QuantityEdit: React.FC<Props> = ({ quantity = 1, onChange }) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const handleIncrement = () => {
    setCurrentQuantity(currentQuantity + 1);
    if (!onChange) return;
    onChange(currentQuantity + 1);
  };

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      setCurrentQuantity(currentQuantity - 1);
      if (!onChange) return;
      onChange(currentQuantity - 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="border w-10 bg-gray-200 hover:bg-gray-300 hover:border-r-0 text-gray-800 font-bold py-2 px-4 rounded-l"
        onClick={handleDecrement}
      >
        -
      </button>
      <input
        // type="number"
        disabled={true}
        className="border px-4 py-2 w-16 text-center"
        value={currentQuantity}
        // onChange={(e) => {
        //   const value = parseInt(e.target.value);
        //   setCurrentQuantity(value);
        //   if (!onChange) return;
        //
        //   onChange(value);
        // }}
      />
      <button
        className="border w-10 bg-gray-200 hover:bg-gray-300 hover:border-l-0 text-gray-800 font-bold py-2 px-4 rounded-r"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
};

export default QuantityEdit;
