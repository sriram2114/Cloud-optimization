import React from 'react';
import Modal from './Modal';
import { AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'danger', 'warning', 'info'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-8 h-8 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      case 'info':
      default:
        return <HelpCircle className="w-8 h-8 text-indigo-400" />;
    }
  };

  const getConfirmBtnColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold';
      case 'info':
      default:
        return 'bg-indigo-600 hover:bg-indigo-500 text-white';
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 border border-slate-800 rounded-lg text-sm font-semibold bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${getConfirmBtnColor()}`}
      >
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small" footer={footer}>
      <div className="flex gap-4 items-start py-1">
        <div className="shrink-0 p-2.5 bg-slate-800/80 rounded-full border border-slate-700/50">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
