import { formatNumber } from "../../lib/utils.js";
import Table from "../Table.jsx";

export default function ProductTable({ productList, onProductEdited, onProductDeleted }) {

    const columns = [
        { key: "name", label: "Product" },
        { key: "price", label: "Price", render: (product) => `Rp${formatNumber(product.price)}` },
        { key: "stock", label: "Stock" , render: (product) => formatNumber(product.stock) },
        { key: "category", label: "Category", render: (product) => product.category ? product.category.name : "-" }
    ];

    return <>
        <Table 
            columns={columns} 
            data={productList} 
            onRowEdit={onProductEdited} 
            onRowDelete={(product) => onProductDeleted(product.id)}
        />
    </>
}