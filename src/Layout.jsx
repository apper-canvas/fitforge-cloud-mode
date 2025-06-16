import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import ThemeToggle from '@/components/atoms/ThemeToggle';
import { routes } from '@/config/routes';
const Layout = () => {
  const location = useLocation();
  const navRoutes = Object.values(routes).filter(route => !route.hideFromNav);

return (
    <div className="h-screen flex flex-col overflow-hidden bg-background dark:bg-background bg-light-background transition-colors duration-200">
      {/* Header with theme toggle */}
      <header className="flex-shrink-0 bg-surface dark:bg-surface bg-light-surface border-b border-gray-700 dark:border-gray-700 border-gray-200 px-4 py-2">
        <div className="flex justify-end items-center">
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
{/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-surface dark:bg-surface bg-light-surface border-t border-gray-700 dark:border-gray-700 border-gray-200 z-40 transition-colors duration-200">
        <div className="flex justify-around items-center py-2 px-4">
          {navRoutes.map((route) => {
            const isActive = location.pathname === route.path || 
              (route.path === '/today' && location.pathname === '/');
            return (
              <NavLink
                key={route.id}
                to={route.path}
className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-400 dark:text-gray-400 text-light-text-secondary hover:text-white dark:hover:text-white hover:text-light-text-primary hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                <ApperIcon 
                  name={route.icon} 
                  size={24}
                  className={`mb-1 ${isActive ? 'text-primary' : ''}`}
                />
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                  {route.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;