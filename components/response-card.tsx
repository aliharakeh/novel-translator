'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ResponseCardProps {
    response: string;
    isLoading?: boolean;
}

export function ResponseCard({ response, isLoading = false }: ResponseCardProps) {
    const formatResponse = (text: string) => {
        const sentences: string[] = [];
        let currentSentence = '';
        let insideQuotes = false;

        for (let i = 0; i < text.length; i++) {
            currentSentence += text[i];

            if (text[i] === '"' || text[i] === '`') {
                insideQuotes = !insideQuotes;
            }

            if (!insideQuotes && text[i] === '.' && (i === text.length - 1 || text[i + 1] === ' ')) {
                sentences.push(currentSentence.trim());
                currentSentence = '';
            }
        }

        if (currentSentence.trim()) {
            sentences.push(currentSentence.trim());
        }

        return sentences
            .map(sentence => sentence.replace(/["`]/g, '🔸').replace(/[\[\]]/g, '🔹'))
            .join('\n\n');
    };

    return (
        <Card
            className={cn(
                'w-full transition-all duration-300 ease-in-out',
                'border-2 shadow-sm hover:shadow-md',
                isLoading ? 'animate-pulse' : '',
                'flex-1 min-w-full'
            )}
        >
            <CardContent className="p-6 w-full">
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-line w-full text-[1.7rem] !text-gray-300">
                        <ReactMarkdown>{formatResponse(response)}</ReactMarkdown>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
