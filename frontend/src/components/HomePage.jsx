import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const goToPayment = () => {
    navigate('/booking/create');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏠 Welcome to the CBT Platform</h1>
      <button
        onClick={goToPayment}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        💳 Make a Payment
      </button>
    </div>
  );
}

export default HomePage;
