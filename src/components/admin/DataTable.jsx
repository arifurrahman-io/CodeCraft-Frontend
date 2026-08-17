import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";

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
  emptyDescription = "There is nothing to display here yet.",
  emptyAction,
  deleteTitle = "Delete item",
  deleteMessage = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const rows = Array.isArray(data) ? data : [];

  const handleDelete = async () => {
    if (!onDelete || !deleteId) return;

    try {
      setIsDeleting(true);
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-canvas/60">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-ink-muted"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-right text-sm font-medium text-ink-muted">
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
                  className="px-6"
                >
                  <EmptyState
                    title={emptyMessage}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={row._id || rowIndex}
                  className="border-b border-border last:border-0 hover:bg-canvas/80 transition-colors"
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
                            to={
                              viewPath
                                ? viewPath(row)
                                : `${basePath}/${row._id}`
                            }
                            className="p-2 rounded-lg text-ink-muted hover:text-accent hover:bg-accent-soft transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        {showEdit && (
                          <Link
                            to={
                              editPath
                                ? editPath(row)
                                : `${basePath}/edit/${row._id}`
                            }
                            className="p-2 rounded-lg text-ink-muted hover:text-sky-600 hover:bg-sky-50 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                        {showDelete && (
                          <button
                            type="button"
                            onClick={() => setDeleteId(row._id)}
                            className="p-2 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors"
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

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => {
          if (!isDeleting) setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title={deleteTitle}
        message={deleteMessage}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DataTable;
