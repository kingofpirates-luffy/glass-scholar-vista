
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm your study assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";

      // Simple pattern matching for demo purposes
      if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
        botResponse = "Hello! How can I assist with your studies today?";
      } else if (input.toLowerCase().includes("help") || input.toLowerCase().includes("assist")) {
        botResponse = "I can help you with studying, answering questions about your coursework, creating study plans, or explaining difficult concepts. What would you like help with?";
      } else if (input.toLowerCase().includes("math") || input.toLowerCase().includes("calculus")) {
        botResponse = "I'd be happy to help with math problems! Please share the specific question or concept you're working on.";
      } else if (input.toLowerCase().includes("thank")) {
        botResponse = "You're welcome! Feel free to ask if you need any more help.";
      } else {
        botResponse = "I understand you're asking about that topic. Could you provide more details so I can give you a more specific answer?";
      }

      const newBotMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Study Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about your studies and I'll do my best to help you.
        </p>
      </div>

      <Card className="glass-card flex-1 flex flex-col mb-6 overflow-hidden">
        <CardContent className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-purple-dark text-white rounded-t-lg rounded-l-lg"
                    : "bg-white/40 rounded-t-lg rounded-r-lg"
                } p-4 relative`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1 rounded-full bg-white/20 flex items-center justify-center">
                    {message.sender === "user" ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3" />
                    )}
                  </span>
                  <span className="text-xs font-medium">
                    {message.sender === "user" ? "You" : "ScholarBot"}
                  </span>
                  <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="glass"
        />
        <Button onClick={handleSendMessage} className="bg-purple hover:bg-purple-dark">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotPage;
