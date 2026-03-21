import { BrowserRouter } from 'react-router';
import { AppRoutes } from '../routes/AppRoutes.jsx';

// Root component.
// Handles the primary routing.
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
