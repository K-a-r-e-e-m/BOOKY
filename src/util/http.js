import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export async function NewUser({ name, email, password }) {
  try {
    const response = await fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'  // Ensure cookies are included in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User created:', data);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function fetchUsers(data) { 
  try {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'  // Ensure cookies are included in requests
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.error || 'Unknown error');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

export async function fetchBooks() {
  try {
    const response = await fetch('http://127.0.0.1:5000/shop', {
      credentials: 'include'  // Ensure cookies are included in requests
    });

    if (!response.ok) {
      const errorInfo = await response.json();
      throw new Error(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        info: errorInfo.message || 'No additional error information provided.'
      }));
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch books. ${error.message}`);
  }
}

export async function addRemoveCart({ action, productId, quantity, cartItemId }) {
  const url = action === 'add'
    ? 'http://127.0.0.1:5000/api/add_cart_item'
    : 'http://127.0.0.1:5000/api/delete_cart_item/';

  const options = {
    method: action === 'add' ? 'POST' : 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',  // Ensure cookies are included in requests
    body: JSON.stringify(action === 'add' ? { productId, quantity } : { cartItemId })
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (action === 'add') {
      console.log('Item added to cart:', data);
      return data.cartItemId;  // Return the cart item ID after adding to the cart
    } else {
      return 'Item removed from cart successfully';  // Return a success message after removing from the cart
    }
  } catch (error) {
    console.error('Error in addRemoveCart:', error);
    throw new Error(error.message || 'Something went wrong');
  }
}

export async function addRemoveWishlist({ action, productId, wishlistId }) {
  const url = action === 'add'
    ? 'http://127.0.0.1:5000/wishlist/add'
    : 'http://127.0.0.1:5000/wishlist/remove';

  const options = {
    method: action === 'add' ? 'POST' : 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',  // Ensure cookies are included in requests
    body: JSON.stringify(action === 'add' ? { productId } : { wishlistId })
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (action === 'add') {
      console.log('Item added to wishlist:', data);
      return data.wishlistId;  // Return the wishlist item ID after adding to the wishlist
    } else {
      return 'Item removed from wishlist successfully';  // Return a success message after removing from the wishlist
    }
  } catch (error) {
    console.error('Error in addRemoveWishlist:', error);
    throw new Error(error.message || 'Something went wrong');
  }
}

export async function submitCheckout(formData, cartItems) {
  try {
    const response = await fetch('http://127.0.0.1:5000/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          cardNumber: formData.cardNumber,
          cardholderName: formData.cardholderName,
          phone: formData.phone,
          cvv: formData.cvv,
          expiryDate: formData.expiryDate,
        },
        cartItems: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
        })),
      }),
      credentials: 'include'  // Ensure cookies are included in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during checkout:', error);
    throw new Error(error.message || 'Something went wrong during checkout');
  }
}
