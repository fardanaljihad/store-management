import { useEffect, useState } from "react";
import { categoryList, createCategory } from "../../lib/api/CategoryApi.js";
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../lib/alert";

export default function Category() {

    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [token, _] = useLocalStorage("token", "");

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
        
        const response = await createCategory(token, {
            name
        });

        const responseBody = await response.json();
        
        if (response.status === 200) {
            setName("");
            await alertSuccess(responseBody.message);
        } else {
            await alertError(responseBody.errors);
        }
    }

    useEffect(() => {
        fetchCategories()
            .then(() => console.log("Categories fetched"));
    }, []);

    return <>
        <div className="bg-white bg-opacity-80 rounded-md shadow-custom overflow-hidden mb-6 p-6">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                    <i className="fas fa-tags text-white"></i>
                </div>
                <h2 className="text-xl font-semibold text-orange-500">Category</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-5">
                        <div>
                            <input type="text" id="name" name="name"
                                className="w-full pl-3 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter category name" required
                                value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                    </div>

                    <div className="flex justify-start mb-6">
                        <button type="submit"
                                className="w-1/8 bg-orange-500 text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5">
                            <i className="fas fa-plus mr-2"></i> Create
                        </button>
                    </div>
                </form>
                <form>
                    <div className="mb-5 flex justify-end">
                        <input type="text" id="search" name="search"
                            className="w-1/3 pl-3 pr-3 py-3 bg-orange-100 bg-opacity-50 border border-orange-300 text-orange-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            placeholder="Search category...." required
                        />
                    </div>
                </form>
            </div>
            
            <table className="w-full text-sm text-left rtl:text-right dark:text-orange-300">
                <thead className="text-xs text-orange-700 uppercase bg-orange-50 dark:bg-orange-900 dark:text-orange-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total Product
                        </th>
                    </tr>
                </thead>
                <tbody className="text-orange-600">
                    {categories.map((category) => (
                        <tr key={category.id} className="bg-white border-b dark:bg-orange-950 dark:border-orange-800 border-orange-200">
                            <th key={category.id} scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-orange-100">
                                {category.name}
                            </th>
                            <td className="px-6 py-4">
                                Soon
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}
