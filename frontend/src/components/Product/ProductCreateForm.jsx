import { useEffect, useState } from "react";
import { alertError, alertSuccess } from "../../lib/alert.js";
import { categoryList } from "../../lib/api/CategoryApi.js";
import { productCreate } from "../../lib/api/ProductApi";
import { formatNumber, parseNumber } from "../../lib/utils.js";

export default function ProductCreateForm({ token, onSuccess, onClose }) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);

    async function fetchCategories() {
        const response = await categoryList(token);

        const responseBody = await response.json();

        if (response.status === 200) {
            setCategories(responseBody.data);
        } else {
            await alertError(responseBody.errors);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const response = await productCreate(token, {
            name,
            price,
            stock,
            categoryId
        });

        const responseBody = await response.json();
        
        if (response.status === 200) {
            setName("");
            setPrice("");
            setStock("");
            setCategoryId("");

            onClose();

            await onSuccess();

            await alertSuccess(responseBody.message);
        } else {
            await alertError(responseBody.errors);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

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
                        type="text"
                        id="name"
                        name="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                                    "
                        placeholder="Type product name"
                        required
                    />
                </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
                <label htmlFor="price" className="block text-orange-600 text-sm font-medium mb-2">
                    Price
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-rupiah-sign text-orange-400"></i>
                    </div>
                    <input
                        type="text"
                        id="price"
                        name="price"
                        value={formatNumber(price)} 
                        onChange={(e) => setPrice(parseNumber(e.target.value))}
                        className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                                    "
                        placeholder="Rp5.999"
                        required
                    />
                </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
                <label htmlFor="stock" className="block text-orange-600 text-sm font-medium mb-2">
                    Stock
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-boxes text-orange-400"></i>
                    </div>
                    <input
                        type="text"
                        id="stock"
                        name="stock"
                        value={formatNumber(stock)}
                        onChange={(e) => setStock(parseNumber(e.target.value))}
                        className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                                    "
                        placeholder="100"
                        required
                    />
                </div>
            </div>

            <div className="col-span-2">
                <label htmlFor="category_id" className="block text-orange-600 text-sm font-medium mb-2">
                    Category
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-list text-orange-400"></i>
                    </div>
                    <select
                        id="category_id"
                        name="category_id"
                        value={categoryId} 
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                                    cursor-pointer appearance-none"
                    >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i className="fas fa-chevron-down text-orange-500"></i>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end items-center gap-3">
            <button
                type="submit"
                className="w-1/4 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                             font-medium shadow-md flex justify-center items-center"
                >
                <i className="fas fa-plus mr-2"></i> Add
            </button>
        </div>
    </form>
}