// src/main.jsx
// Ponto de entrada da aplicação TADS Store
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Importa estilos globais na ordem correta:
// 1. Variáveis CSS (design tokens)
// 2. Reset e base global
import '@/styles/variables.css'
import '@/styles/global.css'

import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
