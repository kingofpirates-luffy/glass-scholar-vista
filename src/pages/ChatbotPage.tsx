import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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

  const handleSendMessage = async () => {
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

    // Prepare OpenAI-style message history for API
    const apiMessages = [
      ...messages
        .filter((msg) => msg.sender !== "bot" || msg.id !== 1) // skip the initial welcome message
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      { role: "user", content: input },
    ];

    try {
      const res = await fetch("http://localhost:8000/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "LMS-MODEL",
          messages: apiMessages,
          stream: false,
        }),
      });
      const data = await res.json();
      const assistantContent =
        data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
          ? data.choices[0].message.content
          : "Sorry, I didn't get a response from the assistant.";
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: assistantContent,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, there was an error connecting to the assistant.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    }
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
                {message.sender === "bot" ? (
                  <div className="text-sm">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.text}</p>
                )}
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
