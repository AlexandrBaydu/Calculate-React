import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5203/api/Calculator/calculate', {
        productName: product,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        email: email || null
      });
      
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Калькулятор стоимости</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Название товара"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        
        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0.01"
          step="0.01"
          style={{ padding: '10px' }}
        />
        
        <input
          type="number"
          placeholder="Количество"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="1"
          style={{ padding: '10px' }}
        />
        
        <input
          type="email"
          placeholder="Email (необязательно)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px' }}
        />
        
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
          {loading ? 'Расчет...' : 'Рассчитать'}
        </button>
      </form>
      
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
          <h3>Результат:</h3>
          <p><strong>Товар:</strong> {result.productName}</p>
          <p><strong>Итоговая стоимость:</strong> {result.totalPrice} ₽</p>
          {result.emailSent && <p>✓ Email отправлен</p>}
        </div>
      )}
    </div>
  );
}

export default App;