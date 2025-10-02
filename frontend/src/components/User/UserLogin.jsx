import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { userLogin } from "../../lib/api/UserApi.js";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/alert.js";

export default function UserLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [_, setToken] = useLocalStorage("token", "");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        
        const response = await userLogin({
            username,
            password
        })

        const responseBody = await response.json();

        if (response.status === 200) {
            const token = responseBody.data.token;
            setToken(token);
            await navigate({
                pathname: "/dashboard"
            });
        } else {
            await alertError(responseBody.errors);
        }
    }

    return <>
        <div
            className="animate-fade-in bg-white bg-opacity-80 p-8 rounded-xl shadow-custom border border-orange-200 backdrop-blur-sm w-full max-w-md">
            <div className="text-center mb-8">
                <div className="inline-block p-3 bg-amber-50 rounded-full mb-4">
                    <i className="fas fa-store text-3xl text-orange-600"></i>
                </div>
                <h1 className="text-3xl font-bold text-orange-600">Store Management</h1>
                <p className="text-orange-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="username" className="block text-orange-600 text-sm font-medium mb-2">Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-user text-orange-400"></i>
                        </div>
                        <input type="text" id="username" name="username"
                            className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            placeholder="Enter your username" required
                            value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-orange-600 text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-orange-400"></i>
                        </div>
                        <input type="password" id="password" name="password"
                            className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            placeholder="Enter your password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>

                <div className="mb-6">
                    <button type="submit"
                            className="w-full bg-amber-50 text-orange-600 py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5">
                        <i className="fas fa-sign-in-alt mr-2"></i> Sign In
                    </button>
                </div>

                <div className="text-center text-sm text-orange-500">
                Don't have an account?
                <Link to="/register"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"> Sign up</Link>
                </div>
            </form>
        </div>
    </>
}