import { useState } from "react";
import { alertError, alertSuccess } from "../../lib/alert.js";
import { categoryUpdate } from "../../lib/api/CategoryApi.js";

export default function CategoryUpdateForm({ token, onSuccess, category, initialFocusRef, onClose }) {

    const [id, setId] = useState(category.id || "");
    const [name, setName] = useState(category.name || "");

    async function handleSubmit(e) {
        e.preventDefault();
        
        const response = await categoryUpdate(token, id, {
            name
        });

        const responseBody = await response.json();
        
        if (response.status === 200) {
            setId("");
            setName("");

            onClose();
            
            onSuccess();
            
            setTimeout(() => {
                alertSuccess(responseBody.message);
            }, 1);
        } else {
            await alertError(responseBody.errors);
        }
    }

    return <form onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
                <label htmlFor="name" className="block text-orange-600 text-sm font-medium mb-2">
                    Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-box text-orange-400"></i>
                    </div>
                    <input
                        ref={initialFocusRef}
                        type="text"
                        id="name"
                        name="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                                    "
                        placeholder="Type category name"
                        required
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-end items-center gap-3">
            <button
                type="submit"
                className="w-1/3 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                             font-medium shadow-md flex justify-center items-center"
                >
                <i className="fas fa-pencil-alt mr-2"></i> Update
            </button>
        </div>
    </form>
}