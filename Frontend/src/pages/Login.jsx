import { useState } from 'react';
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Login com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // 2. Obter o ID token
      const idToken = await userCredential.user.getIdToken();

      // 3. Enviar para o backend e receber o JWT
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Salvar JWT no localStorage
        localStorage.setItem('jwt', data.token);
        alert('Login realizado com sucesso!');
        // Redirecionar ou atualizar estado aqui, se necessário
      } else {
        throw new Error(data.error || 'Erro ao autenticar com o servidor');
      }
    } catch (err) {
      setError('Erro ao fazer login: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
          disabled={loading}
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
