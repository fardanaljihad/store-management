import { Outlet } from "react-router";

export default function Layout() {
  return <>
    <div className="bg-gradient-to-br from-orange-600 to-amber-500 min-h-screen flex items-center justify-center p-4">
      <Outlet />
    </div>
  </>
}
