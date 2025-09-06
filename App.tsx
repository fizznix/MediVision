import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import DrugInputForm from './components/DrugInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import VisualizationCard from './components/VisualizationCard';
import { generateExplanation, generateImage, correctDrugName, analyzePrescription, type Explanation } from './services/geminiService';

interface Visualization {
    id: string;
    submittedDrugName: string;
    correctedDrugName: string;
    explanation: Explanation;
    imageUrl: string;
}

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });


const App: React.FC = () => {
    const [drugName, setDrugName] = useState<string>('');
    const [visualizations, setVisualizations] = useState<Visualization[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const processSingleDrug = async (submittedDrug: string) => {
        setLoadingMessage('Generating your visualization...');
        const correctedName = await correctDrugName(submittedDrug);
        const explanation = await generateExplanation(correctedName);
        if (!explanation || !explanation.metaphor) {
            throw new Error(`Could not generate an explanation for ${correctedName}.`);
        }
        const imageUrl = await generateImage(explanation.metaphor);
        setVisualizations([{
            id: submittedDrug,
            submittedDrugName: submittedDrug,
            correctedDrugName: correctedName,
            explanation,
            imageUrl
        }]);
    }

    const processMultipleDrugs = async (drugs: string[]) => {
        setLoadingMessage(`Found ${drugs.length} medication(s). Generating visualizations...`);
        const visualizationPromises = drugs.map(async (drug) => {
            try {
                const correctedName = await correctDrugName(drug);
                const explanation = await generateExplanation(correctedName);
                if (!explanation || !explanation.metaphor) {
                   throw new Error(`Could not generate an explanation for ${correctedName}.`);
                }
                const imageUrl = await generateImage(explanation.metaphor);
                return {
                    id: drug,
                    submittedDrugName: drug,
                    correctedDrugName: correctedName,
                    explanation,
                    imageUrl
                };
            } catch (err) {
                console.error(`Failed to process ${drug}:`, err);
                // Return null for failed drugs to filter them out later
                return null;
            }
        });

        const results = await Promise.all(visualizationPromises);
        const successfulVisualizations = results.filter((v): v is Visualization => v !== null);

        if (successfulVisualizations.length === 0) {
            throw new Error("Could not generate visualizations for any of the detected medications.");
        }

        setVisualizations(successfulVisualizations);
    }
    
    const runVisualization = async (action: () => Promise<void>) => {
        setIsLoading(true);
        setError(null);
        setVisualizations([]);
        
        try {
            await action();
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Sorry, we couldn't complete your request. ${message}`);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }

    const handleSubmit = useCallback((submittedDrug: string) => {
        if (!submittedDrug.trim()) {
            setError("Please enter a drug name.");
            return;
        }
        runVisualization(() => processSingleDrug(submittedDrug));
    }, []);

    const handleFileUpload = useCallback(async (file: File) => {
       runVisualization(async () => {
            setLoadingMessage('Analyzing your prescription...');
            const base64Image = await fileToBase64(file);
            const detectedDrugs = await analyzePrescription(base64Image, file.type);
            
            if (detectedDrugs.length === 0) {
                setError("No medications could be identified in the uploaded image. Please try a clearer picture.");
                return;
            }
            
            await processMultipleDrugs(detectedDrugs);
       });
    }, []);

    const handlePresetSelect = (presetDrug: string) => {
        setDrugName(presetDrug);
        handleSubmit(presetDrug);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-200 font-sans text-slate-800">
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-3xl mx-auto">
                    <Header />

                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 mt-8 border border-white">
                        <DrugInputForm
                            drugName={drugName}
                            setDrugName={setDrugName}
                            onSubmit={() => handleSubmit(drugName)}
                            onPresetSelect={handlePresetSelect}
                            onFileUpload={handleFileUpload}
                            isLoading={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {isLoading && (
                        <div className="mt-8 text-center">
                            <LoadingSpinner />
                            <p className="mt-4 text-lg text-slate-600 animate-pulse">{loadingMessage}</p>
                        </div>
                    )}

                    {!isLoading && visualizations.length > 0 && (
                        <div className="mt-8 space-y-8">
                            {visualizations.map(viz => (
                                <VisualizationCard key={viz.id} visualization={viz} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
             <footer className="text-center py-4 text-sm text-slate-500">
                <p>This tool is for educational purposes only and is not a substitute for professional medical advice.</p>
            </footer>
        </div>
    );
};

export default App;