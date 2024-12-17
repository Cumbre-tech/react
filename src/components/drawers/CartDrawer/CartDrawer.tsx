import React from 'react';
import Drawer, { DrawerProps } from '../Drawer/Drawer';
import useCartStore from '../../../stores/cartStore';
import Icon from '../../Icon/Icon';
import { colors } from '../../../config';
import ExpandablePanel from '../../ExpandablePanel/ExpandablePanel';
import Counter from '../../Counter/Counter';
import IconButton from '../../buttons/IconButton/IconButton';

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

interface CartData {
    items: Record<string, CartItem[]>;
    stores: Store[];
    totalItems: number;
    totalPrice: number;
}

interface CartDrawerProps extends Omit<DrawerProps, 'children'> {
    cartData: CartData;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    anchor,
    duration,
    onClose,
    overlay,
    drawerStyle,
    overlayStyle,
    height,
    width,
    cartData,
}) => {
    const cart = useCartStore();
    return (
        <Drawer
            isOpen={isOpen}
            anchor={anchor}
            duration={duration}
            onClose={onClose}
            overlay={overlay}
            drawerStyle={drawerStyle}
            overlayStyle={overlayStyle}
            height={height}
            width={width}
        >
            <div style={{ padding: '16px', overflowY: 'auto', height: '100%' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginBottom: 5,

                }}>
                    <Icon name={'cart'} size={30} color={colors.textShade} />
                    <h2 style={{
                        color: colors.textShade,
                        marginLeft: 5,
                        fontSize: 22,
                        fontWeight: '700'
                    }}>Mi carrito</h2>
                </div>
                <div style={{
                    marginBottom: 15,
                    fontSize: 17,
                    paddingLeft: 3

                }}>
                    <p>Total de items: <strong>{cartData.totalItems}</strong></p>
                    <p>Precio total: <strong>${cartData.totalPrice.toFixed(2)}</strong></p>
                </div>


                {cartData.stores.map((store) => (
                    <ExpandablePanel
                        containerStyle={{
                            borderBottom: `1px solid #ccc`,
                            paddingBottom: 10,
                        }}
                        key={store.id}
                        renderHeader={() => (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',

                            }}>
                                <img
                                    src={store.logo}
                                    alt={store.name}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
                                />
                                <div>
                                    <h3 style={{
                                        margin: 0,
                                        padding: 0,
                                        fontWeight: 700,
                                        fontSize: 17
                                    }}>{store.name}</h3>
                                    <div style={{
                                        fontSize: 16,
                                    }}>
                                        <span>Subtotal:</span>
                                        <strong> ${store.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>

                            </div>
                        )}
                        renderBody={() => (
                            <ul
                                style={{
                                    listStyle: 'none',
                                    margin: 0,
                                    padding: 0,
                                    paddingLeft: 10,
                                    display: 'block',
                                }}
                            >
                                {store.items.map((item) => (
                                    <li key={item.id} style={{
                                        paddingBottom: '7px',
                                        paddingTop: '7px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{
                                        }}>
                                            <div>
                                                <strong>{item.name}</strong>
                                            </div>
                                            {item.isOnSale ? (
                                                <div>
                                                    <div>
                                                        Precio:
                                                        <span
                                                            style={{
                                                                textDecoration: 'line-through',
                                                                color: colors.textTint,
                                                                marginRight: 8,
                                                                marginLeft: 8,
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            ${item.price.toFixed(2)}
                                                        </span>
                                                        <span>${item.finalPrice.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ margin: '0' }}>Precio: ${item.price.toFixed(2)}</p>
                                            )}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    marginTop: 5,
                                                }}
                                            >Cant.:
                                                <Counter
                                                    containerStyle={{ paddingLeft: '8px', }}
                                                    buttonStyle={{ backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px' }}
                                                    inputStyle={{ fontSize: '16px' }}
                                                    defaultValue={item.quantity}
                                                    minValue={1}
                                                    //maxValue={10}
                                                    step={1}
                                                    onValueChange={(value) => {
                                                        console.log(value)
                                                        cart.changeQuantity(item.id, value, store.id);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <IconButton
                                            icon='delete'
                                            type='clear'
                                            size='md'
                                            hasShadow={false}
                                            color={colors.danger}
                                            onClick={() => {
                                                cart.removeItem(item.id, store.id);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    />
                ))}
            </div>
        </Drawer>
    );
};

export default CartDrawer;
