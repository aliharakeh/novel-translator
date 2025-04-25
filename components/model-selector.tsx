'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import geminiService from '@/lib/gemini-service';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const AVAILABLE_MODELS = [
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
];

export function ModelSelector() {
    const [currentModel, setCurrentModel] = useState(geminiService.getModel());
    const { toast } = useToast();

    const handleModelChange = (modelId: string) => {
        geminiService.setModel(modelId);
        setCurrentModel(modelId);
        toast({
            title: 'Model changed',
            description: `Switched to ${AVAILABLE_MODELS.find(m => m.id === modelId)?.name}`,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    {AVAILABLE_MODELS.find(m => m.id === currentModel)?.name}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {AVAILABLE_MODELS.map(model => (
                    <DropdownMenuItem
                        key={model.id}
                        onClick={() => handleModelChange(model.id)}
                        className={currentModel === model.id ? 'bg-accent' : ''}
                    >
                        {model.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
