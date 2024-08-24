import React, { useState, useEffect } from 'react';

const ButtonGrid = ({ isOpen, onClose, bankIndex, bankStatus, updateBankStatus }) => {
  const [topButtonStates, setTopButtonStates] = useState(Array(16).fill(false));
  const [bottomButtonStates, setBottomButtonStates] = useState(Array(16).fill(false));

  useEffect(() => {
    setTopButtonStates(bankStatus[bankIndex].top);
    setBottomButtonStates(bankStatus[bankIndex].bottom);
  }, [bankIndex, bankStatus]);

  const handleButtonClick = (index, isTop) => {
    if (isTop) {
      const newButtonStates = [...topButtonStates];
      newButtonStates[index] = !newButtonStates[index];
      setTopButtonStates(newButtonStates);
      updateBankStatus(bankIndex, true, newButtonStates);
    } else {
      const newButtonStates = [...bottomButtonStates];
      newButtonStates[index] = !newButtonStates[index];
      setBottomButtonStates(newButtonStates);
      updateBankStatus(bankIndex, false, newButtonStates);
    }
  };

  const renderButtons = (buttonStates, isTop) => {
    const buttons = [];
    for (let i = 0; i < 16; i++) {
      buttons.push(
        <button
          key={i}
          className={`w-7 h-8 m-1 border border-black flex items-center justify-center text-lg font-medium ${buttonStates[i] ? 'bg-green-500' : 'bg-gray-300'}`}
          onClick={() => handleButtonClick(i, isTop)}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-4 bg-white border border-black rounded-lg">
        <span className="absolute top-2 right-2 text-xl cursor-pointer" onClick={onClose}>&times;</span>
        <div className="text-center mb-2 font-bold">Top</div>
        <div className="flex flex-wrap justify-center">
          {renderButtons(topButtonStates, true)}
        </div>
        <div className="flex flex-wrap justify-center mt-4">
          {renderButtons(bottomButtonStates, false)}
        </div>
        <div className="text-center mb-2 font-bold mt-4">Bottom</div>
      </div>
    </div>
  );
};

export default ButtonGrid;
