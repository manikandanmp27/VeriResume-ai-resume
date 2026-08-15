import React, { useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const params = useParams();

  // Determine active resume ID from URL if inside a resume sub-route
  const match = location.pathname.match(/\/resumes\/([^/]+)/);
  const activeResumeId = match ? match[1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeResumeId={activeResumeId !== 'new' ? activeResumeId : null}
        />
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
