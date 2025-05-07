import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export const ChatbotModal = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: data.response },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: "Sorry, there was an error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg bg-purple-600 hover:bg-purple-700 text-white"
          size="icon"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Student Assistant</DialogTitle>
          <DialogDescription>
            Ask me anything about your studies or data!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 h-80 overflow-y-auto bg-muted p-2 rounded mb-2">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              Start the conversation!
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs whitespace-pre-line text-sm ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-black border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="resize-none min-h-[40px] max-h-[80px]"
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            {loading ? "..." : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal; 