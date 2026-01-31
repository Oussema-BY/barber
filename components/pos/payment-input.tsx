import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QUICK_CASH_AMOUNTS, CURRENCY } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface PaymentInputProps {
  totalAmount: number;
  clientName: string;
  onClientNameChange: (name: string) => void;
  onPaymentComplete: (amountPaid: number) => void;
  disabled?: boolean;
}

export function PaymentInput({
  totalAmount,
  clientName,
  onClientNameChange,
  onPaymentComplete,
  disabled = false,
}: PaymentInputProps) {
  const [amountPaid, setAmountPaid] = useState('');
  const change = Math.max(0, parseFloat(amountPaid || '0') - totalAmount);
  const isCompletePayment = parseFloat(amountPaid || '0') >= totalAmount;

  const handleQuickAmount = (amount: number) => {
    setAmountPaid((amount + totalAmount).toString());
  };

  const handleSubmit = () => {
    if (!clientName.trim()) {
      alert('Please enter client name');
      return;
    }

    if (!isCompletePayment) {
      alert('Insufficient payment');
      return;
    }

    onPaymentComplete(parseFloat(amountPaid));
    setAmountPaid('');
  };

  return (
    <div className="space-y-4">
      {/* Client Name */}
      <Input
        label="Client Name"
        placeholder="Enter client name (optional)"
        value={clientName}
        onChange={(e) => onClientNameChange(e.target.value)}
        disabled={disabled}
      />

      {/* Amount Paid */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Amount Paid
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 text-xl font-bold rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50"
        />
      </div>

      {/* Quick Cash Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {QUICK_CASH_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAmount(amount)}
            disabled={disabled}
            className="text-lg font-bold"
          >
            +{CURRENCY.symbol}{amount}
          </Button>
        ))}
      </div>

      {/* Change Display */}
      <div className={`p-4 rounded-lg text-center ${
        change === 0
          ? 'bg-slate-100'
          : change > 0
          ? 'bg-emerald-100'
          : 'bg-red-100'
      }`}>
        <p className="text-sm text-slate-600 mb-1">Change</p>
        <p className={`text-3xl font-bold ${
          change === 0
            ? 'text-slate-900'
            : change > 0
            ? 'text-emerald-700'
            : 'text-red-700'
        }`}>
          {formatCurrency(Math.abs(change))}
        </p>
      </div>

      {/* Validate & Print Button */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || !isCompletePayment}
        className="w-full text-lg font-bold py-3"
      >
        Complete Payment
      </Button>
    </div>
  );
}
