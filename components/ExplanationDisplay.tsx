import React from 'react';
import type { Explanation } from '../services/geminiService';

interface ExplanationDisplayProps {
    explanation: Explanation;
}

const InfoCard: React.FC<{ title: string, content: string, icon: React.ReactNode }> = ({ title, content, icon }) => (
    <div>
        <h3 className="flex items-center text-xl font-bold text-slate-700 mb-2">
            <span className="mr-3 flex-shrink-0">{icon}</span>
            {title}
        </h3>
        <p className="text-md text-slate-600 leading-relaxed pl-9">
            {content}
        </p>
    </div>
);


const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ explanation }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100 animate-fade-in">
            <div className="space-y-6">
                <InfoCard 
                    title="How It Works: A Simple Story" 
                    content={explanation.metaphor}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                 <InfoCard 
                    title="What It Helps With" 
                    content={explanation.issues}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                 <InfoCard 
                    title="Common Usage" 
                    content={explanation.usage}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
};

export default ExplanationDisplay;