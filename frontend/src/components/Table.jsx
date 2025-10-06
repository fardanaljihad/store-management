export default function Table({ columns, data, onRowEdit, onRowDelete }) {
    return <>
        <div className="rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left rtl:text-right dark:text-orange-300">
                <thead className="text-sm text-white uppercase bg-gradient-to-br from-orange-400/40 via-amber-400/30 to-orange-300/20 
                    backdrop-blur-xl border border-white/20 rounded-t-lg">
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
                <tbody className="text-orange-100">
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className="bg-orange-400/40 border-b text-white dark:bg-orange-950 dark:border-orange-800 border-orange-200"
                        >
                            {columns.map((col, idx) => (
                                <td
                                    key={col.key}
                                    className={`px-6 py-2 
                                        ${idx === 0 ? "font-medium whitespace-nowrap dark:text-white" : ""}
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
                                <td className="px-6 py-2 text-center w-1/6">
                                    <div className="flex justify-center gap-2">
                                        {onRowEdit && (
                                        <button
                                            onClick={() => onRowEdit(row)}
                                            className="w-[80px] px-3 py-2 text-sm text-white 
                                                bg-blue-600 backdrop-blur-lg 
                                                border border-white/30 rounded 
                                                hover:bg-blue-800 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        )}
                                        {onRowDelete && (
                                        <button
                                            onClick={() => onRowDelete(row)}
                                            className="w-[80px] px-3 py-2 text-sm text-white 
                                                bg-red-500 backdrop-blur-lg 
                                                border border-white/30 rounded 
                                                hover:bg-red-800 transition-all duration-200"
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