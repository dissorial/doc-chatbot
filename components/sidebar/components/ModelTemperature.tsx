import React, { useCallback } from 'react';

interface ModelTemperatureProps {
  modelTemperature: number;
  setModelTemperature: React.Dispatch<React.SetStateAction<number>>;
}

const ModelTemperature: React.FC<ModelTemperatureProps> = ({
  modelTemperature,
  setModelTemperature,
}) => {
  const handleTemperatureChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setModelTemperature(parseFloat(event.target.value));
    },
    [setModelTemperature],
  );

  return (
    <div>
      <label className="block font-medium leading-6 text-xs sm:text-sm text-blue-400">
        Model Temperature
      </label>
      <div className="mt-2">
        <input
          type="number"
          min="0"
          max="1"
          value={modelTemperature}
          onChange={handleTemperatureChange}
          step="0.1"
          name="temperature"
          id="temperature"
          className="block w-full rounded-md bg-gray-800 text-gray-300 border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0.0 - 1.0"
        />
      </div>
    </div>
  );
};

export default ModelTemperature;
