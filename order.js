document.getElementById('submitOrder').addEventListener('click', async (e) => {
  e.preventDefault();

  // Collect form data
  const orderData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    number: document.getElementById('number').value.trim(),
    quantity: parseInt(document.getElementById('quantity').value.trim()),
    orderItem: document.getElementById('orderItem').value.trim(),
    address: document.getElementById('address').value.trim(),
  };

  // Validate the form inputs
  const errorMessage = validateForm(orderData);
  if (errorMessage) {
    // Show error message if validation fails
    displayMessage('errorMessage', errorMessage, 'red');
    return;
  }

  try {
    // Send POST request to the API
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.status === 201) {
      // Show success message in the UI
      displayMessage('successMessage', 'Order placed successfully!', 'green');
      // Clear form fields
      document.getElementById('orderForm').reset();
    } else {
      const errorData = await response.json();
      displayMessage('errorMessage', `Failed to place order: ${errorData.message}`, 'red');
    }
  } catch (error) {
    console.error('Error:', error);
    displayMessage('errorMessage', 'An error occurred while placing the order.', 'red');
  }
});

// Validate form data
function validateForm(data) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.name) return 'Name is required.';
  if (!data.email) return 'Email is required.';
  if (!emailPattern.test(data.email)) return 'Invalid email format.';
  if (!data.number || isNaN(data.number) || data.number.length < 10) return 'Please enter a valid phone number.';
  if (!data.quantity || data.quantity <= 0) return 'Quantity must be a positive number.';
  if (!data.orderItem) return 'Order item name is required.';
  if (!data.address) return 'Address is required.';
  return '';
}

// Function to show success or error messages
function displayMessage(elementId, message, color) {
  const messageElement = document.getElementById(elementId);
  messageElement.style.display = 'block';
  messageElement.style.color = color;
  messageElement.textContent = message;
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
}
