import { useEffect, useState } from "react"
import { useLocalStorage } from "react-use";
import { productDelete, productList } from "../../lib/api/ProductApi.js";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert.js";
import Modal from "../Modal.jsx";
import ProductCreateForm from "./ProductCreateForm.jsx";
import ProductTable from "./ProductTable.jsx";
import ProductUpdateForm from "./ProductUpdateForm.jsx";

export default function Product() {

    const [products, setProducts] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [reload, setReload] = useState(true);
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

    async function handleEdit(product) {
        setEditProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            categoryId: product.category.id
        });

        setOpenEditModal(true);
    }

    async function handleDelete(productId) {
        if (!await alertConfirm("Are you sure you want to delete this product?")) {
            return;
        }

        const response = await productDelete(token, productId);

        const responseBody = await response.json();

        if (response.status === 200) {
            await alertSuccess(responseBody.message);
            setReload(!reload);
        } else {
            await alertError(responseBody.errors);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [reload]);

    return <>
        <div className="bg-white bg-opacity-80 rounded-md shadow-custom overflow-hidden mb-6 p-6 animate-fade-in">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                    <i className="fas fa-box text-white"></i>
                </div>
                <h2 className="text-xl font-semibold text-orange-500">Product</h2>
            </div>

            {/* Create Product Modal Button */}
            <div className='flex justify-end'>
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="mb-4 rounded-md bg-green-500 px-4 py-3 text-sm font-medium text-white 
                            hover:bg-green-600 focus:outline-none"
                >
                    Add New Product
                </button>
            </div>

            {/* Create Product Modal */}
            <Modal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                title="Add New Product"
                subtitle="Fill the form to add your product"
            >
                <ProductCreateForm token={token} onSuccess={() => setReload(!reload)} />
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                title="Edit Product"
                subtitle="Update the form to edit your product"
            >
                <ProductUpdateForm token={token} onSuccess={() => setReload(!reload)} initialData={editProduct}/>
            </Modal>

            <ProductTable 
                token={token} 
                productList={products} 
                onProductDeleted={handleDelete} 
                onProductEdited={handleEdit}
            />
        </div>
    </>
}