// AuthLayout.jsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1220] via-[#0f1b2e] to-[#0b1220] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
