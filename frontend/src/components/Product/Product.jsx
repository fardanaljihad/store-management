import { useEffect, useState } from "react"
import { useLocalStorage } from "react-use";
import { productList } from "../../lib/api/ProductApi.js";
import { alertError } from "../../lib/alert.js";
import Modal from "../Modal.jsx";
import ProductCreateForm from "./ProductCreateForm.jsx";
import { formatNumber } from "../../lib/utils.js";

export default function Product() {

    const [products, setProducts] = useState([]);
    const [token, _] = useLocalStorage("token", "");

    async function fetchProducts() {
        const response = await productList(token);

        const responseBody = await response.json();

        if (response.status === 200) {
            setProducts(responseBody.data);
        } else {
            await alertError(responseBody.errors);
        }
    }

    useEffect(() => {
        fetchProducts()
            .then(() => console.log("Products fetched"));
    }, []);

    return <>
        <div className="bg-white bg-opacity-80 rounded-md shadow-custom overflow-hidden mb-6 p-6 animate-fade-in">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                    <i className="fas fa-box text-white"></i>
                </div>
                <h2 className="text-xl font-semibold text-orange-500">Product</h2>
            </div>

            <Modal
                openButtonText="Add new product"
                title="Add New Product"
                subtitle="Fill the form to add your product"
            >
                <ProductCreateForm token={token} onSuccess={fetchProducts} />
            </Modal>
            
            <div className="rounded-md overflow-hidden">
                <table className="w-full text-sm text-left rtl:text-right dark:text-orange-300">
                    <thead className="text-xs text-white uppercase bg-orange-500 dark:bg-orange-900 dark:text-orange-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Stock
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-orange-600">
                        {products.map((product) => (
                            <tr key={product.id} className="bg-white border-b dark:bg-orange-950 dark:border-orange-800 border-orange-200">
                                <th key={product.id} scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-orange-100">
                                    {product.name}
                                </th>
                                <td className="px-6 py-4"> 
                                    {`Rp${formatNumber(product.price)}`}
                                </td>
                                <td className="px-6 py-4">
                                    {formatNumber(product.stock)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
}