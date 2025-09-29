import { Link, Outlet } from "react-router";

export default function DashboardLayout() {
    return <>
        <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-orange-100 min-h-screen flex flex-col">
            <header className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/dashboard/cashier" className="flex items-center hover:opacity-90 transition-opacity duration-200">
                    <i className="fas fa-store text-white text-2xl mr-3"></i>
                    <div className="text-white font-bold text-xl">Store Management</div>
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                    <li>
                        <Link to="/dashboard/users/profile"
                        className="text-gray-100 hover:text-white flex items-center transition-colors duration-200">
                        <i className="fas fa-user-circle mr-2"></i>
                        <span>Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/users/logout"
                            className="text-gray-100 hover:text-white flex items-center transition-colors duration-200">
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            <span>Logout</span>
                        </Link>
                    </li>
                    </ul>
                </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-grow">

                <Outlet />

                <div className="mt-10 mb-6 text-center text-orange-400 text-sm animate-fade-in">
                <p>© 2025 Store Management. All rights reserved.</p>
                </div>
            </main>
        </div>
    </>
}