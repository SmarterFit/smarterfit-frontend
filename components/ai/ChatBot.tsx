"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X, Bot, User, SendHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorToast } from "../toasts/Toasts";
import { chatService } from "@/backend/modules/ai/services/chatServices";

// Gera um ID único simples
const generateId = () => Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9);

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const ChatAvatar = ({ role, className }: { role: "user" | "ai"; className?: string }) => (
  <div
    className={
      `w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        role === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      } ${className}`
    }
  >
    {role === "user" ? <User size={18} /> : <Bot size={18} />}
  </div>
);

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const currentInput = input.trim();
    setInput("");

    const userMessage: Message = { id: generateId(), role: "user", content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    const aiId = generateId();
    let aiContent = "";

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const stream = await chatService.askGroq(currentInput);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      // Processa o stream e adiciona a primeira bolha de IA ao chegar o primeiro chunk
      let firstChunk = true;
      while (true) {
        if (controller.signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;

        if (firstChunk) {
          setMessages(prev => [...prev, { id: aiId, role: "ai", content: aiContent }]);
          firstChunk = false;
        } else {
          setMessages(prev =>
            prev.map(msg => (msg.id === aiId ? { ...msg, content: aiContent } : msg))
          );
        }
      }

      const finalChunk = decoder.decode();
      if (finalChunk) {
        aiContent += finalChunk;
        setMessages(prev =>
          prev.map(msg => (msg.id === aiId ? { ...msg, content: aiContent } : msg))
        );
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        ErrorToast(e.message || "Erro no chat.");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
  };

  const toggleChat = () => {
    if (open) handleStop();
    setOpen(prev => !prev);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-shadow"
          variant="secondary"
          aria-label={open ? "Fechar Chat" : "Abrir Chat"}
        >
          {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 right-4 z-[49] w-full max-w-sm md:max-w-md"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            <Card className="flex flex-col h-[30rem] max-h-[80vh] shadow-2xl rounded-xl p-0 gap-0">
              <div className="flex items-center justify-between p-3 border-b bg-card rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-primary" />
                  <h2 className="font-semibold text-lg">Assistente IA</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 rounded-full" aria-label="Fechar Chat">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <CardContent className="flex-1 overflow-y-auto p-4 bg-muted/20" aria-live="polite">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 text-sm ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    {msg.role === "ai" && <ChatAvatar role="ai" />}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`max-w-[75%] p-3 rounded-2xl shadow-sm break-words whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-background border border-border text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </motion.div>
                    {msg.role === "user" && <ChatAvatar role="user" />}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {loading && (
                <div className="p-2 text-center">
                  <Button variant="outline" size="sm" onClick={handleStop}>
                    Parar Geração
                  </Button>
                </div>
              )}

              <form onSubmit={e => { e.preventDefault(); if (!loading) handleSend(); }} className="flex items-center gap-2 p-3 border-t bg-card rounded-b-2xl">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={loading}
                  className="flex-1 rounded-full px-4 py-2"
                  onKeyPress={e => {
                    if (e.key === "Enter" && !e.shiftKey && !loading) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button type="submit" disabled={loading || !input.trim()} className="rounded-full w-10 h-10 p-0" aria-label="Enviar mensagem">
                  <SendHorizontal size={20} />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
