import React from 'react';
import { useAuthStore } from './store/authStore';
import SimpleLoginForm from './components/SimpleLoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Dashboard />;
  }

  return <SimpleLoginForm />;
}

export default App;