import React from 'react';

interface ModalProps {
  confirmSlotSelect: () => void;
  cancelSlotSelect: () => void;
}

const Modal: React.FC<ModalProps> = ({ confirmSlotSelect, cancelSlotSelect }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Confirm delivery slot?</p>
        <button className="m-3 bg-green p-3 border" onClick={confirmSlotSelect}>
          Confirm
        </button>
        <button className="m-3 p-3 border" onClick={cancelSlotSelect}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;