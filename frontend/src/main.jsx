import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loader from './shared/loader/Loader.jsx';
import { Toasters } from './utils/Toaster.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
      <Toasters />
    </QueryClientProvider>
  </StrictMode>,
)
