import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">{message}</p>
          {itemName && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="font-medium text-red-800">{itemName}</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Cette action est irréversible.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
