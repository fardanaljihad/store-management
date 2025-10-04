export default function Table({ columns, data, onRowEdit, onRowDelete }) {
    return <>
        <div className="rounded-md overflow-hidden">
            <table className="w-full text-sm text-left rtl:text-right dark:text-orange-300">
                <thead className="text-xs text-white uppercase bg-orange-500 dark:bg-orange-900 dark:text-orange-300">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} scope="col" 
                                className={`px-6 py-3 
                                    ${
                                        col.align === "center" ? "text-center" 
                                            : col.align === "right" ? "text-right" 
                                            : "text-left"
                                    }
                                `}
                            >
                                {col.label}
                            </th>
                        ))}
                        {(onRowEdit || onRowDelete) && (
                            <th scope="col" className="px-6 py-3 text-center">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="text-orange-600">
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className="bg-white border-b dark:bg-orange-950 dark:border-orange-800 border-orange-200"
                        >
                            {columns.map((col, idx) => (
                                <td
                                    key={col.key}
                                    className={`px-6 py-4 
                                        ${idx === 0 ? "font-medium whitespace-nowrap dark:text-orange-100" : ""}
                                        ${
                                            col.align === "center" ? "text-center" 
                                                : col.align === "right" ? "text-right" 
                                                : "text-left"
                                        }
                                    `}
                                >
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {(onRowEdit || onRowDelete) && (
                                <td className="px-6 py-4 text-center w-1/6">
                                    <div className="flex justify-center gap-2">
                                        {onRowEdit && (
                                        <button
                                            onClick={() => onRowEdit(row)}
                                            className="w-[80px] px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        )}
                                        {onRowDelete && (
                                        <button
                                            onClick={() => onRowDelete(row)}
                                            className="w-[80px] px-3 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}