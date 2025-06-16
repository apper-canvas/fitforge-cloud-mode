import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { routes, routeArray } from './config/routes';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isSetupComplete, setIsSetupComplete] = React.useState(null);
  const [isHealthSurveyComplete, setIsHealthSurveyComplete] = React.useState(null);

  React.useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const { userProfileService } = await import('./services');
        const setupComplete = await userProfileService.isSetupComplete();
        const healthSurveyComplete = await userProfileService.isHealthSurveyComplete();
        setIsSetupComplete(setupComplete);
        setIsHealthSurveyComplete(healthSurveyComplete);
      } catch (error) {
        console.error('Error checking setup status:', error);
        setIsSetupComplete(false);
        setIsHealthSurveyComplete(false);
      }
    };

    checkSetupStatus();
  }, []);

  // Show loading while checking setup status
  if (isSetupComplete === null || isHealthSurveyComplete === null) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to setup if not complete
  if (!isSetupComplete) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-background text-white">
          <Routes>
            <Route path="/setup" element={<routes.setup.component />} />
            <Route path="*" element={<Navigate to="/setup" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background-light dark:bg-background text-text-primary-light dark:text-text-primary transition-colors duration-200">
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/today" replace />} />
            {routeArray.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
          toastClassName="bg-surface border border-gray-700"
          progressClassName="bg-primary"
/>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;