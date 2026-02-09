import React from "react";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BasketItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface BasketProps {
  items: BasketItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  subtotal: number;
  tax: number;
  total: number;
}

export function Basket({
  items,
  onRemoveItem,
  onUpdateQuantity,
  subtotal,
  tax,
  total,
}: BasketProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          Basket ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-foreground-secondary py-8">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-foreground-muted mb-3" />
            <p className="text-sm sm:text-base">Basket is empty</p>
            <p className="text-xs text-foreground-muted mt-1">
              Add items to get started
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 -mx-1 px-1 scrollbar-none">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-2.5 sm:p-3 bg-secondary rounded-xl border border-border flex items-start gap-2 sm:gap-3 animate-fade-in"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                      {item.name}
                    </p>
                    <Badge size="sm" variant="info" className="shrink-0">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-foreground-secondary">
                      {formatCurrency(item.price)} × {item.quantity}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  {/* Quantity Controls - Always show for touch-friendly interaction */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-secondary-hover hover:bg-border rounded-lg transition-colors active:scale-95"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5 text-foreground-secondary" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-secondary-hover hover:bg-border rounded-lg transition-colors active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-foreground-secondary" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 hover:bg-destructive-light rounded-lg transition-colors shrink-0 active:scale-95"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        <div className="border-t border-border pt-3 sm:pt-4 space-y-1.5 sm:space-y-2 mt-auto">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-foreground-secondary">Subtotal</span>
            <span className="text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-foreground-secondary">Tax (19%)</span>
            <span className="text-foreground">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-base sm:text-lg font-bold bg-primary/10 text-primary p-2.5 sm:p-3 rounded-xl mt-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
