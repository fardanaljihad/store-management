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
        <div className="flex items-center mb-6">
            <i className="fas fa-box text-orange-500 text-2xl mr-3"></i>
            <h1 className="text-2xl font-bold text-orange-500">Product</h1>
        </div>
        <div className="rounded-md shadow-custom overflow-hidden mb-6 p-6 animate-fade-in
            bg-gradient-to-br from-orange-500/90 via-amber-500/80 to-orange-400/70 backdrop-blur-xl border border-white/10"
        >
            {/* Create Product Modal Button */}
            <div className='flex justify-end'>
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="mb-4 rounded-md bg-green-600 px-4 py-3 text-md font-medium text-white 
                            hover:bg-green-800 focus:outline-none border border-white/30"
                >
                    Add Product
                </button>
            </div>

            {/* Create Product Modal */}
            <Modal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                title="Add Product"
                subtitle="Fill the form to add your product"
            >
                <ProductCreateForm 
                    token={token} 
                    onSuccess={() => setReload(!reload)} 
                />
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                title="Edit Product"
                subtitle="Update the form to edit your product"
            >
                <ProductUpdateForm 
                    token={token} 
                    onSuccess={() => setReload(!reload)} 
                    initialData={editProduct}
                />
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