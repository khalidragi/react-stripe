import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckOutForm.css';
import axios from 'axios';

const CheckOutForm = ({ products }) => {
  const stripe = useStripe();
  const element = useElements();
  const [isProcessing, setProcessing] = useState(false);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('Pay');

  const handleChange = (e) => {
    const { value, name } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleCardChange = (e) => {
    if (e.error) return setError(e.error.message);
    setError('');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setSuccess('Processing...');

    const cardElement = element.getElement('card');
    const { name, phone, email, address } = credentials;
    const billingInfo = {
      name,
      phone,
      email,
      address: {
        line1: address,
      },
    };

    try {
      const paymentIntent = await axios.post('http://localhost:5000/payments', {
        amount: products.price * 100,
      });

      const paymentMethodObj = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingInfo,
      });

      if (paymentMethodObj.error) {
        setError(paymentMethodObj.error.message);
        setProcessing(false);
        setSuccess('Pay');
        return;
      }

      const confirmedPayment = await stripe.confirmCardPayment(
        paymentIntent.data,
        {
          payment_method: paymentMethodObj.paymentMethod.id,
        }
      );
      if (confirmedPayment.error) {
        setError(confirmedPayment.error.message);
        setProcessing(false);
        setSuccess('Pay');
        return;
      }

      setSuccess('Success! Payment is Complete');

      setTimeout(() => {
        setSuccess('Pay');
        setProcessing(false);
        setCredentials({
          name: '',
          email: '',
          phone: '',
          address: '',
        });
        cardElement.clear();
      }, 2000);
    } catch (error) {
      setError(error.message);
      setProcessing(false);
      setSuccess('Pay');
    }
  };

  return (
    <div className="CheckOutForm">
      <h3 className="purchase-msg">
        You are purchasing an <span>{products.name}</span> for ${products.price}
      </h3>
      <form className="form" onSubmit={handlePayment}>
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          required
          value={credentials.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Phone Number"
          name="phone"
          required
          value={credentials.phone}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          value={credentials.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Address"
          name="address"
          required
          value={credentials.address}
          onChange={handleChange}
        />
        <p>{error}</p>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '20px',
              },
              invalid: {
                color: 'red',
              },
            },
          }}
          onChange={handleCardChange}
        />
        <button type="submit" disabled={isProcessing}>
          {success}
        </button>
      </form>
    </div>
  );
};

export default CheckOutForm;
