export interface CartItem {
    price: number;
    quantity: number;
    isTaxExempt?: boolean;
}

export interface CartTotals {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
}

export function applyDiscount(price: number, discountPercent: number):number {
    if ( price < 0 ) {
        throw new Error("Price cannot be negative");
    }
    if ( discountPercent < 0 ) {
        throw new Error("Discount cannot be negative");
    }
    if ( discountPercent > 100 ) {
        throw new Error("Discount cannot exceed 100%")
    }

    const discountMultipiler = 1 - discountPercent / 100;
    return price * discountMultipiler;
}

export function calculateTax(
    price: number, 
    taxRate: number, 
    isTaxExempt = false
): number {
    if ( price < 0 ) {
        throw new Error("Price cannot be negative");
    }

    if ( taxRate < 0 ) {
        throw new Error("Tax rate cannot be negative");
    }
    
    if ( isTaxExempt ) {
        return 0;
    }

    const tax = price * (taxRate / 100)
    return Math.round(tax * 100) / 100;
}