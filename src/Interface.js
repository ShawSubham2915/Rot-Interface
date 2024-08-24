import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import ButtonGrid from './ButtonGrid';
import * as XLSX from 'xlsx';

const Interface = () => {
  const [temperature, setTemperature] = useState('');
  const [velocity, setVelocity] = useState('');
  const [thickness, setThickness] = useState('');
  const [width, setWidth] = useState('');
  const [isButtonPopupOpen, setIsButtonPopupOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isTop, setIsTop] = useState(true);
  const [bankStatus, setBankStatus] = useState(
    Array(15).fill({ top: Array(16).fill(false), bottom: Array(16).fill(false) })
  );

  const inputClass = "text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration: 300 ease-in-out transform focus:-translate-y-1 focus:outline-none hover:shadow-lg hover:border-black-400 bg-gray-100";

  const banks = Array.from({ length: 15 }, (_, i) => `Bank #${i + 1}`);

  const handleChildBoxClick = (bankIndex, isTop) => {
    setSelectedBank(bankIndex);
    setIsTop(isTop);
    setIsButtonPopupOpen(true);
  };

  const closePopup = () => {
    setIsButtonPopupOpen(false);
  };

  const updateBankStatus = (bankIndex, isTop, newButtonStates) => {
    setBankStatus(prevStatus => {
      const newStatus = [...prevStatus];
      newStatus[bankIndex] = {
        ...newStatus[bankIndex],
        [isTop ? 'top' : 'bottom']: newButtonStates
      };
      return newStatus;
    });
  };

  const Circle = ({ color, size, zIndex, additionalStyles }) => (
    <div
      style={{ zIndex, ...additionalStyles }}
      className={`border-t-2 border-gray-600 animate-spin rounded-full absolute ${size} ${color}`}
    ></div>
  );

  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const binaryToHex = (binary) => {
    let hex = parseInt(binary, 2).toString(16).toUpperCase();
    return hex.padStart(4, '0'); 
  };

  const handleSave = () => {
    const headers = ['DATE', 'TEMPERATURE', 'SPEED', 'THICKNESS', 'WIDTH', ...Array.from({ length: 15 }, (_, i) => [`BANK_${i + 1}_T`, `BANK_${i + 1}_B`]).flat()];
    const date = new Date().toISOString();
    const data = [
      headers,
      [
        date,
        temperature,
        velocity,
        thickness,
        width,
        ...bankStatus.flatMap(bank => [
          binaryToHex(bank.top.map(status => (status ? 1 : 0)).join('')),
          binaryToHex(bank.bottom.map(status => (status ? 1 : 0)).join(''))
        ])
      ]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, 'Laminar.xlsx');

    // Reset the values after save 
    resetState();
  };

  const resetState = () => {
    setTemperature('');
    setVelocity('');
    setThickness('');
    setWidth('');
    setBankStatus(Array(15).fill({ top: Array(16).fill(false), bottom: Array(16).fill(false) }));
  };

  return (

    <div className="p-4 md:p-8 lg:p-8">



      <h1 className='my-4 font-bold text-xl'>Enter Details</h1>
      <div className="flex flex-col md:flex-row justify-between items-center p-5">

        <div className="flex flex-col mx-2 w-full md:w-1/5">
          <label htmlFor="velocity" className="mb-3">Speed (m/sec)</label>
          <input
            type="text"
            id="velocity"
            value={velocity}
            onChange={handleInputChange(setVelocity)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col mx-2 w-full md:w-1/5">
          <label htmlFor="width" className="mb-3">Width</label>
          <input
            type="text"
            id="width"
            value={width}
            onChange={handleInputChange(setWidth)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col mx-2 w-full md:w-1/5">
          <label htmlFor="thickness" className="mb-3">Thickness (mm)</label>
          <input
            type="text"
            id="thickness"
            value={thickness}
            onChange={handleInputChange(setThickness)}
            className={inputClass}
          />
        </div>
      </div>


      <div className="slant-lines">
        <div className="slant-line absolute right-[0.53em]  top-[29.6em] "></div>
        <div className="slant-line absolute right-[4em]  top-[29.6em] "></div>
        <div className="slant-line absolute right-[7.8em]  top-[29.6em] "></div>
      </div>

      {/* Main div */}
      <div className='mt-20 '>
        {/* 1st cicrcle  up*/}
        <div className=" temp flex flex-col ml-[9em] w-fit">
          <label htmlFor="temperature" className="mb-3">Temperature (°C)</label>
          <input
            type="text"
            id="temperature"
            value={temperature}
            onChange={handleInputChange(setTemperature)}
            className={inputClass}
          />
        </div>
        <div className="upCircle1 flex items-center relative ml-6 py-2">
          <Circle
            color="bg-gradient-to-br from-gray-400 to-gray-500"
            size="w-20 h-20"
            zIndex={2}
          />
          <div className="flex items-center justify-around w-full ml-8">
            
            <div className="text-center relative left-[-60px]">
              
              <span className="block">FDT PYRO</span>
              <FontAwesomeIcon icon={faCaretDown} className="text-gray-500 text-4xl" />
            </div>
            <div className="text-center relative right-[10.5em]">
              <span className="block">IMT PYRO</span>
              <FontAwesomeIcon icon={faCaretDown} className="text-gray-500 text-4xl" />
            </div>
            <div className="text-center relative left-[-180px]">
              <span className="block">CT PYRO</span>
              <FontAwesomeIcon icon={faCaretDown} className="text-gray-500 text-4xl" />
            </div>
          </div>
        </div>

        
        {/* 2nd  cicrcle up */}
        <div className="upCircle2 ml-12">
          <Circle
            color="bg-gradient-to-br from-gray-400 to-gray-500"
            size="w-8 h-8"
            zIndex={2}
          />
        </div>
        {/* line or dives */}

        <div className="mainDiv relative  h-[0.2em] ">
          <div className="line absolute h-full w-[2px] bg-gray-600 left-[-20px]"></div>
          <div className="boxcontainer mt-4 mr-32 flex flex-wrap">
            {banks.map((bank, index) => (
              <div
                key={index}
                className="childBox cursor-pointer"
                onClick={() => handleChildBoxClick(index, true)}>
                {bank}
              </div>
            ))}

          </div>
        </div>

        <div className="inCircle1 absolute  right-[7.2em] top-[28em] ">
          <Circle
            color="bg-gradient-to-br from-gray-400 to-gray-500"
            size="w-5 h-5"
            zIndex={2}
          />
        </div>

        <div className="inCircle2 absolute  right-[10.6em] top-[28em] ">
          <Circle
            color="bg-gradient-to-br from-gray-400 to-gray-500"
            size="w-5 h-5"
            zIndex={1}
          />
        </div>
        <div className="inCircle3 absolute  right-[14.4em] top-[28em]  ">
          <Circle
            color="bg-gradient-to-br from-gray-400 to-gray-500"
            size="w-5 h-5"
            zIndex={1}
          />
        </div>

        {/* 1st circle  down*/}
        <div className='relative   h-2 flex'>
          <div className="downcircle1 absolute ml-12">
            <Circle
              color="bg-gradient-to-br from-gray-400 to-gray-500"
              size="w-8 h-8"
              zIndex={2}
            />
          </div>

          <div className="newCircleContainer flex">
            <div className="newCircle1 absolute  right-[5.2em]">
              <Circle
                color="bg-gradient-to-br from-gray-400 to-gray-500"
                size="w-5 h-5"
                zIndex={2}
              />
            </div>
            <div className="newCircle2 absolute right-[8.6em]">
              <Circle
                color="bg-gradient-to-br from-gray-400 to-gray-500"
                size="w-5 h-5"
                zIndex={1}
              />
            </div>
            <div className="newCircle3 absolute  right-[12.4em]">
              <Circle
                color="bg-gradient-to-br from-gray-400 to-gray-500"
                size="w-5 h-5"
                zIndex={1}
              />
            </div>

		<div className='endCircles'>

           	   <div className="absolute right-[8.8em] top-[2em]">
                <Circle
                  color="bg-gradient-to-br from-gray-400 to-gray-500"
                  size="w-10 h-10"
                  zIndex={2} />
                </div>

                <div className="absolute right-[1.2em] top-[2em]">
                <Circle
                  color="bg-gradient-to-br from-gray-400 to-gray-500"
                  size="w-10 h-10"
                  zIndex={2} />
                </div>

                <div className="absolute right-[4.8em] top-[2em]">
                <Circle
                  color="bg-gradient-to-br from-gray-400 to-gray-500"
                  size="w-10 h-10"
                  zIndex={2} />
                </div>
            </div>

          </div>

          <div className="downcircle2 absolute ml-6 mb-8 mt-7">
            <Circle
              color="bg-gradient-to-br from-gray-400 to-gray-500"
              size="w-20 h-20"
              zIndex={2}
            />
          </div>
        </div>
      </div>


      <div className='mt-32 flex justify-center'>
        <button
          className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
          onClick={handleSave} >
          SAVE
        </button>
      </div>
      {isButtonPopupOpen && (
        <ButtonGrid
          isOpen={isButtonPopupOpen}
          onClose={closePopup}
          bankIndex={selectedBank}
          isTop={isTop}
          bankStatus={bankStatus}
          updateBankStatus={updateBankStatus}
        />
      )}
    </div>
  );
};

export default Interface;
