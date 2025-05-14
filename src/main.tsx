
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Verifica se há uma preferência de tema no localStorage
const theme = localStorage.getItem('theme') || 'light';
// Aplica a classe dark ao HTML se o tema salvo for dark
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
