import { useEffect, useState } from "react";
import { categoryDelete, categoryList, createCategory } from "../../lib/api/CategoryApi.js";
import { useLocalStorage } from "react-use";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert.js";
import CategoryTable from "./CategoryTable.jsx";
import CategoryUpdateForm from "./CategoryUpdateForm.jsx";
import Modal from "../Modal.jsx";

export default function Category() {

    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [category, setCategory] = useState({});
    const [reload, setReload] = useState(true);
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
            await fetchCategories();
        } else {
            await alertError(responseBody.errors);
        }
    }

    async function handleDelete(categoryId) {
        if (!await alertConfirm("Are you sure you want to delete this category?")) {
            return;
        }

        const response = await categoryDelete(token, categoryId);

        const responseBody = await response.json();

        if (response.status === 200) {
            await alertSuccess(responseBody.message);
            await fetchCategories();
        } else {
            await alertError(responseBody.errors);
        }
    }

    function handleEdit(category) {
        setCategory({
            id: category.id,
            name: category.name
        });
        
        setOpenEditModal(true);
    }

    useEffect(() => {
        fetchCategories();
    }, [reload]);

    return <>
        <div className="flex items-center mb-6">
            <i className="fas fa-tags text-white text-2xl mr-3"></i>
            <h1 className="text-2xl font-bold text-white">Category</h1>
        </div>
        
        <div className="relative rounded-lg overflow-hidden mb-6 p-6 animate-fade-in
            bg-orange-400/30 backdrop-blur-xl border border-white/30 shadow-inner"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-5">
                        <div>
                            <input type="text" id="name" name="name"
                                className="w-full pl-3 pr-3 py-3 bg-orange-400/30 backdrop-blur-lg border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-white transition-all duration-200"
                                placeholder="Enter category name" required
                                value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                    </div>

                    <div className="flex justify-start mb-6">
                        <button type="submit"
                            className="w-1/8 py-3 px-4 rounded-lg font-medium text-white bg-orange-400/30 backdrop-blur-lg border border-white/30 hover:bg-orange-400/40 hover:text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            <i className="fas fa-plus mr-2"></i> Create
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Edit Category Modal */}
            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                title="Edit category"
                subtitle="Update the form to edit your category"
            >
                <CategoryUpdateForm
                    token={token} 
                    onSuccess={() => setReload(!reload)} 
                    category={category}
                />
            </Modal>

            <CategoryTable
                categoryList={categories} 
                onCategoryDeleted={handleDelete} 
                onCategoryEdited={handleEdit}
            />
        </div>
    </>
}
