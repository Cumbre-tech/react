import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the structure for a cart item
interface CartItem {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    finalPrice: number; // Price after discount
    quantity: number;
    isOnSale: boolean;
    discountPercentage: number;
    storeId?: string;
    storeName?: string;
    storeLogo?: string;
}

// Define the structure of a store in the cart
interface Store {
    id: string;
    name?: string;
    logo?: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

// Define the structure of the global cart state
interface CartState {
    items: Record<string, CartItem[]>; // Group items by storeId
    totalItems: number; // Total general by quantity
    totalPrice: number; // Total general by finalPrice
    stores: Store[]; // Array of stores
    addItem: (item: CartItem) => void;
    removeItem: (id: string, storeId?: string) => void;
    clearCart: () => void;
    changeQuantity: (id: string, newQuantity: number, storeId?: string) => void;
}

// Zustand store with persistence
const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: {},
            totalItems: 0,
            totalPrice: 0,
            stores: [],


            // Add an item to the cart or increment its quantity
            addItem: (item) => {
                const { storeId, storeName, storeLogo, finalPrice } = item;
                const items = get().items;

                // Group by storeId
                const storeItems = storeId ? items[storeId] || [] : items['default'] || [];
                const existingItem = storeItems.find((i) => i.id === item.id);

                const updatedStoreItems = existingItem
                    ? storeItems.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                    )
                    : [...storeItems, { ...item, quantity: 1 }];

                const updatedItems = {
                    ...items,
                    [storeId || 'default']: updatedStoreItems,
                };

                // Update total values
                const updatedTotalItems = get().totalItems + 1;
                const updatedTotalPrice = get().totalPrice + finalPrice;

                // Update stores array
                const updatedStores = [...get().stores];
                const storeIndex = updatedStores.findIndex((s) => s.id === storeId);
                if (storeIndex >= 0) {
                    updatedStores[storeIndex].items = updatedStoreItems;
                    updatedStores[storeIndex].totalItems += 1;
                    updatedStores[storeIndex].totalPrice += finalPrice;
                } else if (storeId) {
                    updatedStores.push({
                        id: storeId,
                        name: storeName,
                        logo: storeLogo,
                        items: updatedStoreItems,
                        totalItems: 1,
                        totalPrice: finalPrice,
                    });
                }

                set({
                    items: updatedItems,
                    totalItems: updatedTotalItems,
                    totalPrice: updatedTotalPrice,
                    stores: updatedStores,
                });
            },

            // Remove an item
            removeItem: (id, storeId) => {
                const items = get().items;
                const storeKey = storeId || 'default';
                const storeItems = items[storeKey] || [];

                // Find the item to remove
                const existingItem = storeItems.find((i) => i.id === id);
                if (!existingItem) return;

                // Remove the item completely from the store
                const updatedStoreItems = storeItems.filter((i) => i.id !== id);

                const updatedItems = {
                    ...items,
                    [storeKey]: updatedStoreItems,
                };

                // Update total items and total price
                const updatedTotalItems = get().totalItems - existingItem.quantity;
                const updatedTotalPrice = get().totalPrice - existingItem.finalPrice * existingItem.quantity;

                // Update stores array
                const updatedStores = get().stores
                    .map((s) =>
                        s.id === storeId
                            ? {
                                ...s,
                                items: updatedStoreItems,
                                totalItems: s.totalItems - existingItem.quantity,
                                totalPrice: s.totalPrice - existingItem.finalPrice * existingItem.quantity,
                            }
                            : s
                    )
                    .filter((s) => s.items.length > 0); // Remove the store if no items remain

                // Update the global state
                set({
                    items: updatedItems,
                    totalItems: updatedTotalItems,
                    totalPrice: updatedTotalPrice,
                    stores: updatedStores,
                });
            },

            changeQuantity: (id, newQuantity, storeId) => {
                const items = get().items;
                const storeKey = storeId || 'default';
                const storeItems = items[storeKey] || [];

                // Find the item to update
                const existingItem = storeItems.find((i) => i.id === id);
                if (!existingItem) return;

                // Prevent the quantity from being less than 0
                if (newQuantity < 0) return;

                // Update store items: apply the new quantity or remove if it is 0
                const updatedStoreItems = storeItems
                    .map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
                    .filter((i) => i.quantity > 0); // Remove items with 0 quantity

                const updatedItems = {
                    ...items,
                    [storeKey]: updatedStoreItems,
                };

                // Calculate the difference in total items and total price
                const quantityDifference = newQuantity - existingItem.quantity;
                const priceDifference = quantityDifference * existingItem.finalPrice;

                const updatedTotalItems = get().totalItems + quantityDifference;
                const updatedTotalPrice = get().totalPrice + priceDifference;

                // Update the stores array with the new item quantities and prices
                const updatedStores = get().stores
                    .map((s) =>
                        s.id === storeId
                            ? {
                                ...s,
                                items: updatedStoreItems,
                                totalItems: s.totalItems + quantityDifference,
                                totalPrice: s.totalPrice + priceDifference,
                            }
                            : s
                    )
                    .filter((s) => s.items.length > 0); // Remove stores with no items

                // Update the global state
                set({
                    items: updatedItems,
                    totalItems: updatedTotalItems,
                    totalPrice: updatedTotalPrice,
                    stores: updatedStores,
                });
            },


            // Clear all items in the cart
            clearCart: () => {
                set({
                    items: {},
                    totalItems: 0,
                    totalPrice: 0,
                    stores: [],
                });
            },


        }),
        {
            name: 'cart-storage', // Key for localStorage
            partialize: (state) => ({
                items: state.items,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice,
                stores: state.stores,
            }), // Persist necessary parts of the state
        }
    )
);

export default useCartStore;
