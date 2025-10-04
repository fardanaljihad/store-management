import Table from "../Table.jsx";

export default function CategoryTable({ categoryList, onCategoryEdited, onCategoryDeleted }) {

    const columns = [
        { key: "name", label: "Category" }
    ];

    return <>
        <Table 
            columns={columns} 
            data={categoryList} 
            onRowEdit={onCategoryEdited} 
            onRowDelete={(category) => onCategoryDeleted(category.id)}
        />
    </>
}