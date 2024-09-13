import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { addItemToCart, removeItemFromCart } from '../../store/cartSlice';
import { addItem, removeItem } from '../../store/wishlistSlice';
import { addRemoveCart, addRemoveWishlist } from '../../util/http';

function BookCard({ imgSrc, title, discountPrice, originalPrice, rating, shopId, shopDes }) {
    const [wishlistId, setWishlistId] = useState(null);
    const [cartItemId, setCartItemId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // console.log('shopId:', shopId);

    // State to manage whether the item is in the cart or wishlist
    const [inCart, setInCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

      // Select items from Redux store
      const cartItems = useSelector((state) => state.cart.items);
      const wishlistItems = useSelector((state) => state.wishlist.items);
        

  

    const product = {
        shopId,
        title,
        imgSrc,
        discountPrice: parseFloat(discountPrice),
        originalPrice: parseFloat(originalPrice),
        rating,
        description: shopDes,
        
    };

    // Mutation for adding/removing from the cart
    const cartMutation = useMutation({
        mutationFn: ({ action, productId, quantity, cartItemId }) =>
            
        addRemoveCart({ action, productId, quantity, cartItemId }),
        onSuccess: (response) => {
            console.log('Success response:', response); // Add this line
            setCartItemId(response.new_cart_item_id);

            if (response && response.new_cart_item_id ) {
                console.log('allllll', response);
                setInCart(true);    
                dispatch(addItemToCart({ ...product, id: shopId}));
                alert('Item added to cart');
                
            } else {
                setInCart(false);
                console.log('shopId:', shopId);
                dispatch(removeItemFromCart(shopId));
                alert('Item removed from cart');
               
            }
        },
        onError: (error) => {
            console.error(`Failed to ${inCart ? 'remove' : 'add'} item to cart:`, error);
            alert(`Failed to ${inCart ? 'remove' : 'add'} item to cart. Please try again.`);
        }
    });

    // Mutation for adding/removing from the wishlist
    const wishlistMutation = useMutation({
        mutationFn: ({ action, productId, wishlistId }) =>
            addRemoveWishlist({ action, productId, wishlistId }),
        onSuccess: (data) => {
            console.log('Success response:', data); // Add this line
            if (data && data.new_wishlist_item_id) {
                setWishlistId(data.new_wishlist_item_id);
                console.log(data.new_wishlist_item_id)
                dispatch(addItem({ ...product, id: shopId }));
                alert('Item added to wishlist');
                setInWishlist(true);
            } else {
                dispatch(removeItem(shopId));
                alert('Item removed from wishlist');
                setInWishlist(false);
            }
        },
        onError: (error) => {
            console.error(`Failed to ${inWishlist ? 'remove' : 'add'} item to wishlist:`, error);
            alert(`Failed to ${inWishlist ? 'remove' : 'add'} item to wishlist. Please try again.`);
        }
    });

    function handleAddToCart() {
        if (inCart) {
            console.log('cartItemId:re;ovvvvvvvvvv', cartItemId);
            cartMutation.mutate({ action: 'remove', cartItemId: cartItemId });
        } else {
            
            cartMutation.mutate({ action: 'add', productId: product.shopId, quantity: 1 });
            
        }
    }

    function handleAddToWishList() {
        if (inWishlist) {
            console.log(wishlistId)
            wishlistMutation.mutate({ action: 'remove', wishlistId});
        } else {
             
            wishlistMutation.mutate({ action: 'add', productId: product.shopId });
        }
    }

    function handleClick(e) {
        e.preventDefault();
        navigate(`${shopId}`);
    }

    return (
        <a className="new__card swiper-slide">
            <img src={`/${imgSrc}`} alt={title} className="new__img" />
            <div className="add-card">
                <h3 className="new__title">{title}</h3>
                <div className="new__prices">
                    <span className="new__discount">{discountPrice}</span>
                    <span className="new__price">{originalPrice}</span>
                </div>
                <div className="new__starts">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <i
                            key={index}
                            className={
                                index < rating
                                    ? 'ri-star-fill'
                                    : index < rating + 0.5
                                        ? 'ri-star-half-fill'
                                        : 'ri-star-line'
                            }
                        />
                    ))}
                </div>
                <button className="button" onClick={handleAddToCart}>
                    {inCart ? 'Remove from Cart' : 'Add To Cart'}
                </button>
                <div className="featured__actions">
                    <button>
                        <i className="ri-search-line" />
                    </button>
                    <button onClick={handleAddToWishList}>
                        <i className={inWishlist ? "ri-heart-3-fill dark" : "ri-heart-3-line"} />
                    </button>
                    <button onClick={handleClick}>
                        <i className="ri-eye-line" />
                    </button>
                </div>
            </div>
        </a>
    );
}

export default BookCard;

 