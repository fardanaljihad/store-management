import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { createContact, getContact, updateContact } from "../../lib/api/ContactApi.js";
import { alertError, alertSuccess, alertWarning } from "../../lib/alert";
import { userUpdate } from "../../lib/api/UserApi.js";

export default function UserProfile() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isHasContact, setIsHasContact] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, _] = useLocalStorage("token", "");
    const username = token ? (JSON.parse(atob(token.split('.')[1]))).username : null;

    async function fetchUserContact() {
        const response = await getContact(token, username);
        const responseBody = await response.json();
        
        if (response.status === 200) {
            setFirstName(responseBody.data.first_name);
            setLastName(responseBody.data.last_name);
            setEmail(responseBody.data.email);
            setPhone(responseBody.data.phone);
            setIsHasContact(true);
        } else {
            await alertWarning(`${responseBody.errors}. Please complete your contact information.`);
        }
    }

    async function handleCreateContact(e) {
        e.preventDefault();

        const response = await createContact(token, username, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone
        });

        const responseBody = await response.json();

        if (response.status === 200) {
            await fetchUserContact();
            await alertSuccess(responseBody.message);
        } else {
            await alertError(responseBody.errors);
        }
    }

    async function handleUpdateContact(e) {
        e.preventDefault();

        const response = await updateContact(token, username, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone
        });

        const responseBody = await response.json();

        if (response.status === 200) {
            await fetchUserContact();
            await alertSuccess(responseBody.message);
        } else {
            await alertError(responseBody.errors);
        }
    }

    async function handleSubmitPassword(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            await alertWarning("Password do not match!");
            return;
        }

        const response = await userUpdate(token, username, {
            password: password
        });

        const responseBody = await response.json();

        if (response.status === 200) {
            setPassword("");
            setConfirmPassword("");
            await alertSuccess(responseBody.message);
        } else {
            await alertError(responseBody.errors);
        }
    }

    useEffect(() => {
        fetchUserContact();
    }, []);
    
    return <>
        <div className="flex items-center mb-6">
            <i className="fas fa-user-cog text-white text-2xl mr-3"></i>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
                className="bg-orange-400/30 backdrop-blur-xl border border-white/30 shadow-inner rounded-md shadow-custom overflow-hidden card-hover animate-fade-in">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                            <i className="fas fa-user-edit text-white"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-white">Edit Contact</h2>
                    </div>
                    <form onSubmit={isHasContact ? handleUpdateContact : handleCreateContact}>
                        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-white text-sm font-medium mb-2">First Name</label>
                                <input type="text" id="first_name" name="first_name"
                                    className="w-full pl-3 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="First name" required
                                    value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-white text-sm font-medium mb-2">Last Name</label>
                                <input type="text" id="last_name" name="last_name"
                                    className="w-full pl-3 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Last name" required
                                    value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-envelope text-white"></i>
                                </div>
                                <input type="email" id="email" name="email"
                                    className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter your email" required
                                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-phone text-white"></i>
                                </div>
                                <input type="tel" id="phone" name="phone"
                                    className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter your phone number" required
                                    value={phone} onChange={(e) => setPhone(e.target.value)}/>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button type="submit"
                                    className="w-full bg-orange-500 backdrop-blur-lg border border-white/30
                                        hover:bg-orange-600 py-3 px-4 rounded-lg hover:opacity-90 text-white
                                        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                                        focus:ring-offset-orange-800 transition-all duration-200 font-medium 
                                        shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                                <i className="fas fa-save mr-2"></i> Update Contact
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div
                className="bg-orange-400/30 backdrop-blur-xl border border-white/30 shadow-inner rounded-md shadow-custom overflow-hidden card-hover animate-fade-in">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                            <i className="fas fa-key text-white"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-white">Change Password</h2>
                    </div>
                    <form onSubmit={handleSubmitPassword}>
                        <div className="mb-5">
                            <label htmlFor="new_password" className="block text-white text-sm font-medium mb-2">New
                                Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-lock text-white"></i>
                                </div>
                                <input type="password" id="new_password" name="new_password"
                                    className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter your new password" required
                                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="confirm_password" className="block text-white text-sm font-medium mb-2">Confirm New
                                Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-check-double text-white"></i>
                                </div>
                                <input type="password" id="confirm_password" name="confirm_password"
                                    className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Confirm your new password" required
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button type="submit"
                                    className="w-full bg-orange-500 backdrop-blur-lg border border-white/30
                                        hover:bg-orange-600 py-3 px-4 rounded-lg hover:opacity-90 text-white
                                        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                                        focus:ring-offset-orange-800 transition-all duration-200 font-medium 
                                        shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                                <i className="fas fa-key mr-2"></i> Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}