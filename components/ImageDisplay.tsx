
import React from 'react';

interface ImageDisplayProps {
    imageUrl: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100 animate-fade-in animation-delay-200">
             <h2 className="text-2xl font-bold text-slate-700 mb-4">Visual Metaphor</h2>
            <div className="aspect-square w-full bg-slate-100 rounded-xl overflow-hidden">
                <img
                    src={imageUrl}
                    alt="AI-generated visualization of drug action"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default ImageDisplay;
