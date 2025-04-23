"use client";

import { ChatInput } from "@/components/chat-input";
import { ResponseCard } from "@/components/response-card";
import { SettingsDialog } from "@/components/settings-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSystemPrompt } from "@/hooks/use-system-prompt";
import geminiService from "@/lib/gemini-service";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { systemPrompt, isLoaded } = useSystemPrompt();
  const [response, setResponse] = useState("I'm Gemini, an AI assistant. How can I help you today?");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const stream = geminiService.generateContentStream(message, systemPrompt);
      let isFirstChunk = true;
      
      for await (const chunk of stream) {
        if (isFirstChunk) {
          setIsLoading(false);
          isFirstChunk = false;
        }
        setResponse(prev => prev + chunk);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse("Sorry, there was an error processing your request.");
      setIsLoading(false);
    }
  };

  // Function to handle scrolling
  const handleScroll = (amount: number) => {
    window.scrollBy({ top: amount, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b">
        <div className="flex items-center justify-between h-16 px-8 w-full">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Gemini Chat</h1>
          </div>
          <div className="flex items-center justify-end gap-2">
            <SettingsDialog />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="w-full flex-1 p-8">
        <div className="space-y-8 mb-6">
          <ResponseCard response={response} isLoading={isLoading} />
        </div>
      </main>
      
      <footer className="sticky bottom-0 z-10 backdrop-blur-md bg-background/80 border-t py-4">
        <div className="container max-w-5xl mx-auto flex justify-between items-center">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <div className="flex space-x-2 ml-4">
            <Button onClick={() => handleScroll(-300)} variant="outline" size="icon">
              ↑
            </Button>
            <Button onClick={() => handleScroll(300)} variant="outline" size="icon">
              ↓
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}