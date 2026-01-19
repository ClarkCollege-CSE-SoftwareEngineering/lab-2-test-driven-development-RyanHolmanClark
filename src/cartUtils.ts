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

    const discountMultiplier = 1 - discountPercent / 100;
    return price * discountMultiplier;
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

export function calculateTotal(
    listItems: CartItem[],
    discountPercent:number = 0,
    taxRate:number = 0,
): CartTotals {
    const subtotal = listItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // takes a sum of all items multiplied by their quantities
    const discountPrices = listItems.map((item) => applyDiscount(item.price * item.quantity, discountPercent));
    // creates and array of prices x quantities with the discount applied
    const discount = subtotal - discountPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    // finds the total discount by subtracting the discounted prices from the original subtotal
    const tax = listItems.reduce((sum, item, currentIndex) => sum + calculateTax(discountPrices[currentIndex], taxRate, item.isTaxExempt), 0);
    // finds the total tax by applying the taxRate to all discountedPrices
    const total = subtotal - discount + tax;

    return {
        subtotal: Math.round(subtotal * 100)/100,
        discount: Math.round(discount * 100)/100,
        tax: Math.round(tax * 100)/100,
        total: Math.round(total * 100)/100,
    };
};