import React, { useState } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';

function App() {
  const [mode, setMode] = useState('calculate'); // 'calculate' или 'email'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Данные для калькулятора
  const [calcData, setCalcData] = useState({
    productName: '',
    price: '',
    quantity: '',
    email: ''
  });

  // Данные для email
  const [emailData, setEmailData] = useState({
    toEmail: '',
    subject: '',
    body: ''
  });

  const API_URL = 'https://localhost:5001/api/calculator';

  const handleCalcChange = (e) => {
    setCalcData({ ...calcData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/calculate`, {
        productName: calcData.productName,
        price: parseFloat(calcData.price),
        quantity: parseInt(calcData.quantity),
        email: calcData.email || null
      });
      
      setResult(response.data);
      setCalcData({ productName: '', price: '', quantity: '', email: '' });
    } catch (err) {
      setError(err.response?.data || 'Ошибка расчета');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/send-email`, emailData);
      
      setResult(response.data);
      setEmailData({ toEmail: '', subject: '', body: '' });
    } catch (err) {
      setError(err.response?.data || 'Ошибка отправки email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-app">
      <h1>Калькулятор API</h1>
      
      <div className="mode-buttons">
        <button 
          className={mode === 'calculate' ? 'active' : ''}
          onClick={() => setMode('calculate')}
        >
          Калькулятор
        </button>
        <button 
          className={mode === 'email' ? 'active' : ''}
          onClick={() => setMode('email')}
        >
          Отправить Email
        </button>
      </div>

      {mode === 'calculate' ? (
        <form onSubmit={handleCalculate} className="simple-form">
          <h2>Расчет стоимости</h2>
          
          <div className="input-group">
            <label>Название товара *</label>
            <input
              type="text"
              name="productName"
              value={calcData.productName}
              onChange={handleCalcChange}
              required
              placeholder="Введите название"
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Цена *</label>
              <input
                type="number"
                name="price"
                value={calcData.price}
                onChange={handleCalcChange}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="input-group">
              <label>Количество *</label>
              <input
                type="number"
                name="quantity"
                value={calcData.quantity}
                onChange={handleCalcChange}
                required
                min="1"
                placeholder="1"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email (необязательно)</label>
            <input
              type="email"
              name="email"
              value={calcData.email}
              onChange={handleCalcChange}
              placeholder="email@example.com"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Расчет...' : 'Рассчитать'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendEmail} className="simple-form">
          <h2>Отправка Email</h2>
          
          <div className="input-group">
            <label>Кому *</label>
            <input
              type="email"
              name="toEmail"
              value={emailData.toEmail}
              onChange={handleEmailChange}
              required
              placeholder="recipient@example.com"
            />
          </div>

          <div className="input-group">
            <label>Тема *</label>
            <input
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleEmailChange}
              required
              placeholder="Тема письма"
            />
          </div>

          <div className="input-group">
            <label>Текст *</label>
            <textarea
              name="body"
              value={emailData.body}
              onChange={handleEmailChange}
              required
              rows="4"
              placeholder="Введите текст письма..."
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      )}

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h3>Результат:</h3>
          
          {result.productName ? (
            // Результат расчета
            <div>
              <p><strong>Товар:</strong> {result.productName}</p>
              <p><strong>Цена:</strong> {result.price} ₽</p>
              <p><strong>Количество:</strong> {result.quantity}</p>
              <p><strong>Итого:</strong> {result.totalPrice} ₽</p>
              {result.emailSent !== undefined && (
                <p>
                  <strong>Email:</strong> {result.emailSent ? '✓ Отправлен' : '✗ Не отправлен'}
                </p>
              )}
            </div>
          ) : (
            // Результат отправки email
            <div>
              <p><strong>Статус:</strong> {result.success ? 'Успешно' : 'Ошибка'}</p>
              <p>{result.message}</p>
            </div>
          )}
        </div>
      )}

      <div className="info">
        <p>Подключено к C# Web API: {API_URL}</p>
      </div>
    </div>
  );
};

export default App;