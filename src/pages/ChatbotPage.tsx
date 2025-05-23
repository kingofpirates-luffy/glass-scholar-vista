import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Pencil, Trash2, Plus, Check, X, ChevronLeft, ChevronRight, Eye, EyeOff, History } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface Visualization {
  title: string;
  description: string;
  image_base64: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  visualizations?: Visualization[];
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

const LOCAL_STORAGE_KEY = "chatbot_sessions";

const getDefaultWelcomeMessage = (): Message => ({
  id: 1,
  text: "Hi there! I'm your study assistant. How can I help you today?",
  sender: "bot",
  timestamp: new Date(),
});

const createNewSession = (): ChatSession => ({
  id: crypto.randomUUID(),
  title: "New Chat",
  createdAt: Date.now(),
  messages: [getDefaultWelcomeMessage()],
});

const ChatbotPage = () => {
  // Chat session state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed: ChatSession[] = JSON.parse(stored);
      // Convert timestamps to Date objects in messages
      parsed.forEach((s) => s.messages.forEach((m) => (m.timestamp = new Date(m.timestamp))));
      setSessions(parsed);
      setActiveSessionId(parsed[0]?.id || null);
    } else {
      // If no sessions, create a new one
      const newSession = createNewSession();
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession ? activeSession.messages : [];

  // --- Chat logic ---
  const handleSendMessage = async () => {
    if (!input.trim() || !activeSession) return;
    const newUserMessage: Message = {
      id: activeSession.messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    // Optimistically update UI
    updateSessionMessages(activeSession.id, [...activeSession.messages, newUserMessage]);
    setInput("");
    // Prepare OpenAI-style message history for API
    const apiMessages = [
      ...activeSession.messages
        .filter((msg) => msg.sender !== "bot" || msg.id !== 1)
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
      const visualizations = data.visualizations || [];
      const newBotMessage: Message = {
        id: activeSession.messages.length + 2,
        text: assistantContent,
        sender: "bot",
        timestamp: new Date(),
        visualizations,
      };
      updateSessionMessages(activeSession.id, [...activeSession.messages, newUserMessage, newBotMessage]);
    } catch (error) {
      const newBotMessage: Message = {
        id: activeSession.messages.length + 2,
        text: "Sorry, there was an error connecting to the assistant.",
        sender: "bot",
        timestamp: new Date(),
      };
      updateSessionMessages(activeSession.id, [...activeSession.messages, newUserMessage, newBotMessage]);
    }
  };

  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, messages: newMessages } : s))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    const newSession = createNewSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    // If deleting the active session, switch to another
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSessionId(remaining[0]?.id || null);
    }
  };

  const handleRenameSession = (id: string, title: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
    setEditingTitleId(null);
    setEditingTitle("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- UI ---
  return (
    <SidebarProvider>
      <div className="flex flex-col h-[calc(100vh-64px)] w-full">
        {/* Mobile: Button to open chat history */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b bg-white/80 z-10">
          <Button variant="ghost" size="icon" onClick={() => setShowHistoryMobile(true)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </Button>
          <span className="font-bold text-lg">Study Assistant</span>
          <div style={{ width: 40 }} /> {/* Spacer for symmetry */}
        </div>
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Desktop: Chat history panel with vertical bar collapse */}
          {isHistoryCollapsed ? (
            <div className="hidden md:flex flex-col items-center justify-center bg-white/90 border-r border-gray-200 w-11 h-full shadow-lg rounded-r-2xl m-2 mr-0 transition-all duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center h-full w-full rounded-none hover:bg-purple/10"
                onClick={() => setIsHistoryCollapsed(false)}
                aria-label="Show chat history sidebar"
              >
                <History className="h-6 w-6 text-gray-500 mb-1" />
                <span className="text-[10px] text-gray-500" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>History</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex flex-col bg-white/90 border-r border-gray-200 min-w-[240px] max-w-[300px] w-[22vw] h-full shadow-lg rounded-r-2xl m-2 mr-0 transition-all duration-300 relative">
              <SidebarHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
                <span className="font-bold text-lg tracking-tight">Chats</span>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={handleNewChat} title="New chat" className="hover:bg-purple/10">
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-purple/10"
                    onClick={() => setIsHistoryCollapsed(true)}
                    aria-label="Hide chat history sidebar"
                  >
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              </SidebarHeader>
              <SidebarContent className="flex-1 overflow-y-auto px-2 pb-2">
                <SidebarMenu>
                  {sessions.map((session) => (
                    <SidebarMenuItem key={session.id}>
                      <SidebarMenuButton
                        isActive={session.id === activeSessionId}
                        onClick={() => handleSelectSession(session.id)}
                        className={
                          `flex items-center group justify-between w-full rounded-lg px-3 py-2 mb-1 transition-colors ${
                            session.id === activeSessionId
                              ? 'bg-purple/10 text-purple font-semibold shadow-sm'
                              : 'hover:bg-gray-100/80'
                          }`
                        }
                      >
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className="truncate text-sm max-w-[110px]">{session.title}</span>
                          <span className="ml-1 text-xs text-gray-400 whitespace-nowrap">{new Date(session.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          {editingTitleId === session.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleRenameSession(session.id, editingTitle);
                              }}
                              className="flex items-center gap-1 w-full"
                            >
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                autoFocus
                                className="h-7 text-xs px-2 py-1"
                                onBlur={() => setEditingTitleId(null)}
                              />
                              <Button size="icon" type="submit" className="h-7 w-7 p-0"><Check className="h-4 w-4" /></Button>
                              <Button size="icon" type="button" className="h-7 w-7 p-0" onClick={() => setEditingTitleId(null)}><X className="h-4 w-4" /></Button>
                            </form>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-purple/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTitleId(session.id);
                                  setEditingTitle(session.title);
                                }}
                                title="Rename"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-red-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="px-4 pb-4 pt-2">
                <SidebarSeparator />
                <span className="text-xs text-gray-400 mt-2 block">{sessions.length} chats</span>
              </SidebarFooter>
            </div>
          )}
          {/* Mobile: Chat history drawer */}
          <Sheet open={showHistoryMobile} onOpenChange={setShowHistoryMobile}>
            <SheetContent side="left" className="p-0 w-64 max-w-full">
              <SidebarHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
                <span className="font-bold text-lg tracking-tight">Chats</span>
                <Button size="icon" variant="ghost" onClick={handleNewChat} title="New chat" className="hover:bg-purple/10">
                  <Plus className="h-5 w-5" />
                </Button>
              </SidebarHeader>
              <SidebarContent className="flex-1 overflow-y-auto px-2 pb-2">
                <SidebarMenu>
                  {sessions.map((session) => (
                    <SidebarMenuItem key={session.id}>
                      <SidebarMenuButton
                        isActive={session.id === activeSessionId}
                        onClick={() => { handleSelectSession(session.id); setShowHistoryMobile(false); }}
                        className={
                          `flex items-center group justify-between w-full rounded-lg px-3 py-2 mb-1 transition-colors ${
                            session.id === activeSessionId
                              ? 'bg-purple/10 text-purple font-semibold shadow-sm'
                              : 'hover:bg-gray-100/80'
                          }`
                        }
                      >
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className="truncate text-sm max-w-[110px]">{session.title}</span>
                          <span className="ml-1 text-xs text-gray-400 whitespace-nowrap">{new Date(session.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          {editingTitleId === session.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleRenameSession(session.id, editingTitle);
                              }}
                              className="flex items-center gap-1 w-full"
                            >
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                autoFocus
                                className="h-7 text-xs px-2 py-1"
                                onBlur={() => setEditingTitleId(null)}
                              />
                              <Button size="icon" type="submit" className="h-7 w-7 p-0"><Check className="h-4 w-4" /></Button>
                              <Button size="icon" type="button" className="h-7 w-7 p-0" onClick={() => setEditingTitleId(null)}><X className="h-4 w-4" /></Button>
                            </form>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-purple/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTitleId(session.id);
                                  setEditingTitle(session.title);
                                }}
                                title="Rename"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-red-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="px-4 pb-4 pt-2">
                <SidebarSeparator />
                <span className="text-xs text-gray-400 mt-2 block">{sessions.length} chats</span>
              </SidebarFooter>
            </SheetContent>
          </Sheet>
          {/* Chat area */}
          <div className="flex-1 flex flex-col px-2 md:px-8 py-4 overflow-hidden">
            <div className="flex flex-col gap-2 mb-6 mt-2 md:mt-4">
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
                      } p-4 relative message-bubble`}
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
                          <ReactMarkdown 
                            rehypePlugins={[rehypeRaw]} 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({node, ...props}) => (
                                <table className="markdown-table" {...props} />
                              ),
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                          {message.visualizations && message.visualizations.length > 0 && (
                            <div className="mt-4 flex flex-col gap-4">
                              {message.visualizations.map((viz, idx) => (
                                <div key={idx} className="flex flex-col items-center border rounded-lg p-2 bg-white/70">
                                  <img
                                    src={`data:image/png;base64,${viz.image_base64}`}
                                    alt={viz.title}
                                    className="max-w-full max-h-64 rounded shadow"
                                  />
                                  <div className="mt-2 text-center">
                                    <div className="font-semibold">{viz.title}</div>
                                    <div className="text-xs text-gray-600">{viz.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-2 mb-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="glass"
                disabled={!activeSession}
              />
              <Button onClick={handleSendMessage} className="bg-purple hover:bg-purple-dark" disabled={!activeSession}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatbotPage;
