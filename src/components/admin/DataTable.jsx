import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const DataTable = ({
  columns = [],
  data = [],
  actions = true,
  showView = true,
  showEdit = true,
  showDelete = true,
  onDelete,
  basePath = "",
  viewPath,
  editPath,
  emptyMessage = "No data found",
}) => {
  const [deleteId, setDeleteId] = useState(null);
  const rows = Array.isArray(data) ? data : [];

  const handleDelete = () => {
    if (onDelete && deleteId) {
      onDelete(deleteId);
    }
    setDeleteId(null);
  };

  return (
    <div className="glass rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-slate-400"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={row._id || rowIndex}
                  className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {showView && (
                          <Link
                            to={viewPath ? viewPath(row) : `${basePath}/${row._id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-800 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        {showEdit && (
                          <Link
                            to={editPath ? editPath(row) : `${basePath}/edit/${row._id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                        {showDelete && (
                          <button
                            onClick={() => setDeleteId(row._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default DataTable;
