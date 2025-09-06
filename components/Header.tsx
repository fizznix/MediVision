
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                MediVision: Drug Action Visualizer
            </h1>
            <p className="mt-3 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Understand your medication like never before. Enter a drug name or upload prescription to see a simple, visual story of how it works in your body.
            </p>
        </header>
    );
};

export default Header;
