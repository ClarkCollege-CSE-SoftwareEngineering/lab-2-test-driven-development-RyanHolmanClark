import { describe, it, expect } from "vitest";
import { 
    applyDiscount, 
    calculateTax,
    calculateTotal,
    CartItem, 
} from "../cartUtils.js";

describe("applyDiscount", () => {
    it("applies a percentage discount to a price", () => {
        expect(applyDiscount(100, 10)).toBe(90);
    });
    it("returns the original price when the discount is 0%", () => {
        expect(applyDiscount(50, 0)).toBe(50);
    })
    it("returns 0 when discount is 100%", () => {
        expect(applyDiscount(75,100)).toBe(0);
    });
    it("handles decimal prices correctly", () => {
        expect(applyDiscount(19.99, 10)).toBeCloseTo(17.99,2);
    });
    it("throws an error for negative prices", () => {
        expect(() => applyDiscount(-10,10)).toThrow("Price cannot be negative");
    });
    it("throw an error for negative discount percentages", () => {
        expect(() => applyDiscount(100, -5)).toThrow("Discount cannot be negative");
    });
    it("throws and error for discount greater then 100%", () => {
        expect(() => applyDiscount(100, 150)).toThrow(
            "Discount cannot exceed 100%"
        );
    });
});

describe("calculateTax", () => {
    it("calculates tax on a price", () => {
        expect(calculateTax(100, 8.5)).toBeCloseTo(8.5, 2);
    });
    
    it("returns 0 tax when rate is 0%", () => {
        expect(calculateTax(50, 0)).toBe(0);
    });

    it("handles decimal prices correctly", () => {
        expect(calculateTax(19.99, 10)).toBeCloseTo(2.0, 2);
    });

    it("returns 0 tax when item is tex-exempt", () => {
        expect(calculateTax(100, 8.5, true)).toBe(0);
    });

    it("throws an error for negative prices", () => {
        expect(() => calculateTax(-10, 8.5)).toThrow("Price cannot be negative");
    });

    it("throws and error for negative tax rates", () => {
        expect(() => calculateTax(100, -5)).toThrow("Tax rate cannot be negative");
    });
});

describe("calculateTotal", () => {
    // TODO: Add at least 6 test cases
    // Consider: single item, multiple items, discounts, tax-exempt items,
    // empty cart, mixed tax-exempt and taxable items

    it("calculates totals for a single item", () => {
        const listItems: CartItem[] = [
            {
                price: 4,
                quantity: 1,
            }
        ];
        const result = calculateTotal(listItems, 0, 0);
        expect(result.subtotal).toBe(4);
        expect(result.discount).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.total).toBe(4);
    });

    it("calculates totals for multiple items", () => {
        const listItems: CartItem[] = [
            {
                price: 4,
                quantity: 1,
            },
            {
                price: 3,
                quantity: 1,
            }
        ];
        const result = calculateTotal(listItems);
        expect(result.subtotal).toBe(7);
        expect(result.discount).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.total).toBe(7);

    });

    it("applies discount before calculating tax", () => {
        const listItems: CartItem[] = [
            {
                price: 4,
                quantity: 1,
            }
        ];
        const result = calculateTotal(listItems, 50, 50);
        expect(result.subtotal).toBe(4);
        expect(result.discount).toBe(2);
        expect(result.tax).toBe(1);
        expect(result.total).toBe(3);
    });

    it("excludes tax-exempt items for tax calculation", () => {
        const listItems: CartItem[] = [
            {
                price: 4,
                quantity: 1,
                isTaxExempt: true,
            },
            {
                price: 4,
                quantity: 1,
            }
        ];
        const result = calculateTotal(listItems, 0, 50);
        expect(result.subtotal).toBe(8);
        expect(result.discount).toBe(0);
        expect(result.tax).toBe(2);
        expect(result.total).toBe(10);
    });

    // TODO: Add at leas 2 more test cases
    it("handles items with quantity greater then 1", () => {
        const listItems: CartItem[] = [
            {
                price: 2,
                quantity: 2,
            }
        ];
        const result = calculateTotal(listItems);
        expect(result.subtotal).toBe(4);
        expect(result.discount).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.total).toBe(4);
    });

    it("a ugly list of items with discount, tax and quantities", () => {
        const listItems: CartItem[] = [
            {
                price: 2.99,
                quantity: 1,
            },
            {
                price: 3.89,
                quantity: 3,
            },
            {
                price: 1.50,
                quantity: 3,
                isTaxExempt: true
            },
            {
                price: 5,
                quantity: 1,
            },
            {
                price: 3,
                quantity: 2,
            },
            {
                price: 1,
                quantity: 4,
                isTaxExempt: true
            },
        ];
        const result = calculateTotal(listItems, 11, 8.5);
        expect(result.subtotal).toBeCloseTo(34.16);
        expect(result.discount).toBeCloseTo(3.76);
        expect(result.tax).toBeCloseTo(1.94);
        expect(result.total).toBeCloseTo(32.34);
    });

    it("handles my last walmart receipt", () => {
        const listItems: CartItem[] = [
            {
                price: 5.86,
                quantity: 1,
            },
            {
                price: 9.51,
                quantity: 1,
                isTaxExempt: true
            },
            {
                price: 1.98,
                quantity: 4,
                isTaxExempt: true
            },
            {
                price: 1.32,
                quantity: 1,
            },
            {
                price: 4.97,
                quantity: 1,
            },
            {
                price: 8.12,
                quantity: 1,
            },
            {
                price: 8.27,
                quantity: 2,
            },
        ];
        const result = calculateTotal(listItems, 0, 8.8);
        expect(result.subtotal).toBeCloseTo(54.24,1);
        expect(result.discount).toBe(0);
        expect(result.tax).toBeCloseTo(3.24,1);
        expect(result.total).toBeCloseTo(57.48,1);
    });
});