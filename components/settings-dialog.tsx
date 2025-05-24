'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSystemPrompt } from '@/hooks/use-system-prompt';
import { useToast } from '@/hooks/use-toast';
import geminiService from '@/lib/gemini-service';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SettingsDialog() {
    const { systemPrompt, setSystemPrompt, resetSystemPrompt } = useSystemPrompt();
    const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt);
    const [apiKey, setApiKey] = useState(geminiService.getApiKey() || '');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    // Update local state when systemPrompt changes
    useEffect(() => {
        setLocalSystemPrompt(systemPrompt);
    }, [systemPrompt]);

    const handleSave = () => {
        setSystemPrompt(localSystemPrompt);

        if (apiKey && apiKey !== geminiService.getApiKey()) {
            geminiService.setApiKey(apiKey);
        }

        setOpen(false);

        toast({
            title: 'Settings saved',
            description: 'Your system prompt and API key have been updated.',
        });
    };

    const handleReset = () => {
        resetSystemPrompt();
        setLocalSystemPrompt(systemPrompt);

        toast({
            title: 'System prompt reset',
            description: 'The system prompt has been reset to default.',
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Configure your Gemini AI settings here. These settings will be saved to your
                        browser.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="api-key">Gemini API Key</Label>
                        <Input
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API key"
                        />
                        <p className="text-sm text-muted-foreground">
                            You can get your API key from the{' '}
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-4"
                            >
                                Google AI Studio
                            </a>
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="system-prompt">System Prompt</Label>
                        <Textarea
                            id="system-prompt"
                            value={localSystemPrompt}
                            onChange={e => setLocalSystemPrompt(e.target.value)}
                            rows={10}
                            className="resize-none"
                        />
                        <p className="text-sm text-muted-foreground">
                            The system prompt defines how the AI assistant behaves.
                        </p>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="outline" onClick={handleReset}>
                        Reset to Default
                    </Button>
                    <Button onClick={handleSave} className="ml-auto">
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
