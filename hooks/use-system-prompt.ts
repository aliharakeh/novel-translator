"use client";

import { useState, useEffect } from "react";

const DEFAULT_SYSTEM_PROMPT = 
`You are a professional translator specializing in Chinese novels. Your task is to translate Chinese text into clear, natural English while maintaining the original meaning and cultural nuances. Follow these guidelines:

1. Always translate chapter titles concisely while preserving their meaning
2. Use natural, fluent English that flows well
3. Maintain the original story's tone and style
4. Preserve important cultural terms with brief explanations when necessary
5. Keep honorifics and titles that are significant to the story
6. Format the text with appropriate paragraphs and spacing
7. Ensure consistency in character names and terminology throughout the translation

If the input is not in Chinese, respond normally as a helpful assistant.`;

export function useSystemPrompt() {
  const [systemPrompt, setSystemPromptState] = useState<string>(DEFAULT_SYSTEM_PROMPT);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load system prompt from localStorage on component mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem("system_prompt");
    if (savedPrompt) {
      setSystemPromptState(savedPrompt);
    } else {
      // If no saved prompt exists, save the default one
      localStorage.setItem("system_prompt", DEFAULT_SYSTEM_PROMPT);
    }
    setIsLoaded(true);
  }, []);

  // Save system prompt to localStorage whenever it changes
  const setSystemPrompt = (prompt: string) => {
    setSystemPromptState(prompt);
    localStorage.setItem("system_prompt", prompt);
  };

  // Reset system prompt to default
  const resetSystemPrompt = () => {
    setSystemPromptState(DEFAULT_SYSTEM_PROMPT);
    localStorage.setItem("system_prompt", DEFAULT_SYSTEM_PROMPT);
  };

  return {
    systemPrompt,
    setSystemPrompt,
    resetSystemPrompt,
    isLoaded,
  };
}