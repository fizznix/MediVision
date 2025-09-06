import React from 'react';
import type { Explanation } from '../services/geminiService';
import ExplanationDisplay from './ExplanationDisplay';
import ImageDisplay from './ImageDisplay';

interface VisualizationCardProps {
    visualization: {
        submittedDrugName: string;
        correctedDrugName: string;
        explanation: Explanation;
        imageUrl: string;
    };
}

const VisualizationCard: React.FC<VisualizationCardProps> = ({ visualization }) => {
    const { correctedDrugName, submittedDrugName, explanation, imageUrl } = visualization;
    const showCorrection = correctedDrugName && submittedDrugName.toLowerCase() !== correctedDrugName.toLowerCase();

    return (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-1 border border-white animate-fade-in">
            <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                    {correctedDrugName}
                </h2>
                {showCorrection && (
                    <div className="text-center text-sm text-slate-500 mb-6" role="status">
                        (Showing results for <strong className="font-semibold text-slate-700">{correctedDrugName}</strong>, corrected from "{submittedDrugName}")
                    </div>
                )}
                <div className="mt-6 space-y-8">
                    <ExplanationDisplay explanation={explanation} />
                    <ImageDisplay imageUrl={imageUrl} />
                </div>
            </div>
        </div>
    );
};

export default VisualizationCard;
