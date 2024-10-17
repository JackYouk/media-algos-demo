"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftCircle, ArrowRightCircle, Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";
  
interface Response {
    id: string;
    text: string;
    bias: boolean;
    timestamp: string;
}

interface ApiResponse {
    status: number;
    responses: Response[];
}

export default function ResponsesPage() {
    const [responses, setResponses] = useState<Response[]>([]);
    const [activeResponse, setActiveResponse] = useState<number>(0);
    const [showBias, setShowBias] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(120);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResponses = async () => {
        try {
            const response = await fetch('/api/getResponses', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data: ApiResponse = await response.json();
            setResponses(data.responses);
            setIsLoading(false);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch responses:", err);
            setError(err.message || 'Failed to fetch responses');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();
        const interval = setInterval(() => {
            fetchResponses();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const biasFilteredResponses = responses.filter(response => response.bias);

    useEffect(() => {
        if (!showBias) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setShowBias(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showBias]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePrev = () => {
        setActiveResponse((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        const maxIndex = showBias ? biasFilteredResponses.length - 1 : responses.length - 1;
        setActiveResponse((prev) => Math.min(prev + 1, maxIndex));
    };

    if (!isLoading && (!responses || responses.length === 0 || !biasFilteredResponses || biasFilteredResponses.length === 0)) {
        return(
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <Loader2Icon className="animate-spin w-20 h-20 text-gray-500"/>
                <div className="text-sm text-gray-500 mt-2">no responses yet</div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="w-full h-screen flex justify-center items-center"><Loader2Icon className="animate-spin w-20 h-20"/></div>;
    }

    if (error) {
        return <div className="w-full h-screen flex justify-center items-center text-xl text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full min-h-screen p-4 md:p-20 flex flex-col justify-center items-center relative">
            {!showBias && (
                <div 
                    className={`absolute top-4 right-4 text-xl font-semibold p-2 
                    border border-dashed rounded ${timeLeft < 15 ? 'border-red-500 text-red-500' : timeLeft < 60 ? 'border-orange-400 text-orange-400' : 'border-green-500 text-green-500'}`}
                >
                    {formatTime(timeLeft)}
                </div>
            )}

            {!showBias && biasFilteredResponses && biasFilteredResponses.length > 0 ? (
                <Card className="w-full md:w-2/3">
                    <CardHeader>
                        <CardTitle>@student{activeResponse + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl">{biasFilteredResponses[activeResponse].text}</CardContent>
                    <CardFooter>
                        <div className="w-full flex justify-between space-x-2">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={handlePrev} 
                                disabled={activeResponse === 0}
                                aria-label="Previous Response"
                            >
                                <ArrowLeftCircle />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={handleNext} 
                                disabled={activeResponse === biasFilteredResponses.length - 1}
                                aria-label="Next Response"
                            >
                                <ArrowRightCircle />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {responses.map((response, index) => (
                        <Card
                            className={`border-2 ${response.bias ? 'border-green-500' : 'border-red-500'}`}
                            key={index}
                        >
                            <CardHeader>
                                <CardTitle>@student{index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-2xl">{response.text}</CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}