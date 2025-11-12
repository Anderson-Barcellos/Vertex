import { createRoot } from 'react-dom/client'

import App from './App.tsx'

import "./main.css"
import "./styles/theme.css"
import "./styles/layout.css"
import "./styles/modern-design.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <App />
)
