import React from 'react';
import { PRESET_DRUGS } from '../constants';

interface DrugInputFormProps {
    drugName: string;
    setDrugName: (name: string) => void;
    onSubmit: () => void;
    onPresetSelect: (name: string) => void;
    onFileUpload: (file: File) => void;
    isLoading: boolean;
}

const DrugInputForm: React.FC<DrugInputFormProps> = ({ drugName, setDrugName, onSubmit, onPresetSelect, onFileUpload, isLoading }) => {
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="e.g., Aspirin"
                    className="flex-grow w-full px-4 py-3 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-200 ease-in-out"
                    disabled={isLoading}
                    aria-label="Drug Name Input"
                />
                <button
                    type="submit"
                    className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={isLoading || !drugName}
                >
                    {isLoading ? 'Working...' : 'Visualize'}
                </button>
            </form>

            <div className="relative flex items-center justify-center my-2">
                <div className="flex-grow border-t border-slate-300"></div>
                <span className="flex-shrink mx-4 text-slate-500 font-medium">OR</span>
                <div className="flex-grow border-t border-slate-300"></div>
            </div>

            <div className="flex justify-center">
                 <label htmlFor="prescription-upload" className="w-full sm:w-auto cursor-pointer">
                    <div className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 text-center">
                        Upload Prescription
                    </div>
                    <input
                        id="prescription-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        aria-label="Upload Prescription"
                    />
                </label>
            </div>


            <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm font-medium text-slate-500">Or try one:</span>
                {PRESET_DRUGS.map((drug) => (
                    <button
                        key={drug}
                        onClick={() => onPresetSelect(drug)}
                        disabled={isLoading}
                        className="px-3 py-1 text-sm text-cyan-700 bg-cyan-100 rounded-full hover:bg-cyan-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {drug}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DrugInputForm;