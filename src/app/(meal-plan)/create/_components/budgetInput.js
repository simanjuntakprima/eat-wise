import { useState } from 'react';

export default function BudgetInput() {
  const [formattedBudget, setFormattedBudget] = useState('');

  const handleBudgetChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Strip non-digits
    const numericValue = Math.max(0, parseInt(rawValue || '0', 10)); // Prevent below zero

    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericValue);

    setFormattedBudget(formatted);
  };

  return (
    <input
      id="budget"
      type="text"
      name="budget"
      value={formattedBudget}
      onChange={handleBudgetChange}
      inputMode="numeric"
      placeholder="Rp 100000"
      className="w-full rounded-md bg-[#f1f0ed] px-3 py-2 placeholder:text-gray-500"
    />
  );
}
