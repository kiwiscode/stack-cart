import { useDialog } from "../../context/DialogContext";

export const Dialog = () => {
  const { isOpen, closeDialog, dialogContent } = useDialog();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        {dialogContent}
        <button
          onClick={closeDialog}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
