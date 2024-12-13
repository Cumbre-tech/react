import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the structure for a cart item
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    storeId?: string;
    storeName?: string; // Optional key for multi-store carts
}

// Define the structure of a store in the cart
interface Store {
    id: string;
    name?: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

// Define the structure of the global cart state
interface CartState {
    items: Record<string, CartItem[]>; // Group items by storeId
    totalItems: number; // Total general by quantity
    totalPrice: number; // Total general by price
    stores: Store[]; // Array of stores
    addItem: (item: CartItem) => void;
    removeItem: (id: string, storeId?: string) => void;
    clearCart: () => void;
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
                const { storeId, storeName, price } = item;
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
                const updatedTotalPrice = get().totalPrice + price;

                // Update stores array
                const updatedStores = [...get().stores];
                const storeIndex = updatedStores.findIndex((s) => s.id === storeId);
                if (storeIndex >= 0) {
                    updatedStores[storeIndex].items = updatedStoreItems;
                    updatedStores[storeIndex].totalItems += 1;
                    updatedStores[storeIndex].totalPrice += price;
                } else if (storeId) {
                    updatedStores.push({
                        id: storeId,
                        name: storeName,
                        items: updatedStoreItems,
                        totalItems: 1,
                        totalPrice: price,
                    });
                }

                set({
                    items: updatedItems,
                    totalItems: updatedTotalItems,
                    totalPrice: updatedTotalPrice,
                    stores: updatedStores,
                });
            },

            // Remove an item or decrement its quantity
            removeItem: (id, storeId) => {
                const items = get().items;
                const storeKey = storeId || 'default';
                const storeItems = items[storeKey] || [];

                const existingItem = storeItems.find((i) => i.id === id);
                if (!existingItem) return;

                const updatedStoreItems = storeItems
                    .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
                    .filter((i) => i.quantity > 0);

                const updatedItems = {
                    ...items,
                    [storeKey]: updatedStoreItems,
                };

                const updatedTotalItems = get().totalItems - 1;
                const updatedTotalPrice = get().totalPrice - existingItem.price;

                const updatedStores = [...get().stores];
                const storeIndex = updatedStores.findIndex((s) => s.id === storeId);
                if (storeIndex >= 0) {
                    updatedStores[storeIndex].items = updatedStoreItems;
                    updatedStores[storeIndex].totalItems -= 1;
                    updatedStores[storeIndex].totalPrice -= existingItem.price;

                    // Remove the store if it has no items
                    if (updatedStores[storeIndex].totalItems === 0) {
                        updatedStores.splice(storeIndex, 1);
                    }
                }

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