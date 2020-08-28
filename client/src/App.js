import React, { useState } from 'react';
import './App.css';
import ProductCard from './components/ProductCard/ProductCard';
import CheckOutForm from './components/CheckOutForm/CheckOutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App() {
  const [products] = useState([
    {
      img:
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpeters-orchards.com%2Fsites%2Fdefault%2Ffiles%2Fimageblock%2FApple_Red_D_-Silho.png&f=1&nofb=1',
      name: 'Organic Apple',
      price: 70,
    },
    {
      img:
        'https://pngriver.com/wp-content/uploads/2018/04/Download-Orange-Transparent.png',
      name: 'Organic Orange',
      price: 90,
    },
    {
      img:
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pngpix.com%2Fwp-content%2Fuploads%2F2016%2F08%2FPNGPIX-COM-Yellow-Banana-PNG-Transparent-Image.png&f=1&nofb=1',
      name: 'Organic Banana',
      price: 17,
    },
  ]);

  const [product, setProduct] = useState({
    name: 'Organic Apple',
    price: 70,
  });

  const displayCards = () => {
    return products.map((product) => (
      <ProductCard
        product={product}
        setProduct={setProduct}
        key={product.price}
      />
    ));
  };
  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <div className="product-cards">{displayCards()}</div>
        <CheckOutForm products={product} />
      </div>
    </Elements>
  );
}

export default App;
