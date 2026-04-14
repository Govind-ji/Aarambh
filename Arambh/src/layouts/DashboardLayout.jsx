// DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1b2e] to-[#0b1220] text-white">
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
