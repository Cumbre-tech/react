import React from 'react';
import IconButton from '../../buttons/IconButton/IconButton';


interface ProductCardProps {
    image: string;
    description: string;
    price: number;
    isOnSale: boolean;
    discountPercentage?: number;
    finalPrice: number;
    storeName?: string;
    storeLogo?: string;
    containerStyle?: React.CSSProperties;
    onAddToCart: () => void;
    onClick: () => void;
    onStoreClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    image,
    description,
    price,
    isOnSale,
    discountPercentage,
    finalPrice,
    storeName,
    storeLogo,
    containerStyle,
    onAddToCart,
    onClick,
    onStoreClick,
}) => {
    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                cursor: 'pointer',
                position: 'relative',
                ...containerStyle
            }}
            onClick={onClick}
        >
            {/* Product Image */}
            <div style={{ position: 'relative', height: '200px' }}>
                <img
                    src={image}
                    alt={description}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {isOnSale && discountPercentage && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            backgroundColor: 'red',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        -{discountPercentage}%
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div style={{ padding: '16px' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>{description}</p>
                {isOnSale ? (
                    <div>
                        <span
                            style={{
                                textDecoration: 'line-through',
                                color: '#999',
                                marginRight: '8px',
                            }}
                        >
                            ${price}
                        </span>
                        <span style={{ color: 'red', fontWeight: 'bold' }}>${finalPrice}</span>
                    </div>
                ) : (
                    <p style={{ margin: '0', fontWeight: 'bold' }}>${price}</p>
                )}
            </div>

            {/* Store Info */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    borderTop: '1px solid #ddd',
                }}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card's onClick
                    onStoreClick();
                }}
            >
                <img
                    src={storeLogo}
                    alt={storeName}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
                />
                <span style={{ fontWeight: 'bold' }}>{storeName}</span>
            </div>

            {/* Add to Cart Button */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                }}
                onClick={(e) => e.stopPropagation()} // Prevent triggering the card's onClick
            >
                <IconButton icon="cart" onClick={onAddToCart} />
            </div>
        </div>
    );
};

export default ProductCard;
