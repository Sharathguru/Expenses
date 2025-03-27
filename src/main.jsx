import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ExpenseProvider } from './context/ContextAPI';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseProvider>
      <App />
    </ExpenseProvider>
  </StrictMode>,
);
