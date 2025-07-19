import { useEffect,useState } from 'react';

export default function BudgetInput({ initialValue = 0, onBudgetChange }) {
  const [formattedBudget, setFormattedBudget] = useState('');
  const [rawBudget, setRawBudget] = useState(initialValue);

  // Add this effect to handle initial value
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== null) {
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(initialValue);

      setFormattedBudget(formatted);
      setRawBudget(initialValue);
    }
  }, [initialValue]);

  const handleBudgetChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = Math.max(0, parseInt(rawValue || '0', 10));

    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericValue);

    setFormattedBudget(formatted);
    setRawBudget(numericValue);
    if (onBudgetChange) onBudgetChange(numericValue);
  };

  return (
    <div>
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
      {rawBudget > 0 && rawBudget < 1000 && (
        <p className="mt-2 text-sm font-medium text-[#A94442]">⚠️ Minimum budget is Rp 1.000</p>
      )}
    </div>
  );
}
