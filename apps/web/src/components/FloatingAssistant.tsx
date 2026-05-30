"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "What fragrances do you offer?",
  "Check my order status",
  "What's on sale?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "rgba(201,168,76,0.70)" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1.1, delay: i * 0.18, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

const WELCOME: Message = {
  role: "assistant",
  content: "I'm an AI-Powered agent from Scentora, how may we help you?",
};

export default function FloatingAssistant() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>([WELCOME]);
  const [input, setInput]         = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  async function sendMessage(text = input.trim()) {
    if (!text || streaming) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, I'm having trouble right now. Please email demo@demo.com.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9998] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col"
            style={{
              width: "min(320px, calc(100vw - 32px))",
              height: "min(460px, calc(100dvh - 120px))",
              background: "rgba(12,10,8,0.94)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 20,
              boxShadow: "0 24px 64px rgba(0,0,0,0.60), inset 0 0 0 1px rgba(201,168,76,0.07)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 60%)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.28)" }}
              >
                <span className="font-display text-gold-primary text-[13px]">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-text-primary leading-tight">Scentora AI Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[9px] text-text-muted">{streaming ? "Typing…" : "Online"}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={15} strokeWidth={1.8} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[82%] px-3.5 py-2.5 text-[12px] leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            background: "rgba(201,168,76,0.18)",
                            border: "1px solid rgba(201,168,76,0.28)",
                            borderRadius: "14px 14px 4px 14px",
                            color: "rgba(255,248,220,0.92)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "14px 14px 14px 4px",
                            color: "rgba(220,210,195,0.90)",
                          }
                    }
                  >
                    {streaming && i === messages.length - 1 && msg.role === "assistant" && msg.content === ""
                      ? <TypingDots />
                      : msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick-reply pills */}
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap shrink-0">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={streaming}
                  className="text-[10px] px-3 py-1.5 rounded-full transition-colors duration-200 disabled:opacity-40"
                  style={{
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.22)",
                    color: "rgba(201,168,76,0.85)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.18)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.08)"; }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-3 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask us anything…"
                disabled={streaming}
                className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || streaming}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-35"
                style={{
                  background: input.trim() && !streaming ? "rgba(201,168,76,1)" : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(201,168,76,0.30)",
                }}
              >
                {streaming
                  ? <Loader2 size={12} className="text-gold-primary animate-spin" />
                  : <Send size={12} strokeWidth={1.8} style={{ color: input.trim() ? "#0F0D0A" : "rgba(201,168,76,0.6)" }} />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Assistant"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative flex items-center justify-center"
        style={{
          height: 48,
          paddingLeft: open ? 16 : 22,
          paddingRight: open ? 16 : 22,
          borderRadius: 999,
          background: open
            ? "rgba(30,25,15,0.95)"
            : "linear-gradient(135deg, rgba(201,168,76,1) 0%, rgba(160,120,40,1) 100%)",
          border: open ? "1px solid rgba(201,168,76,0.40)" : "1px solid rgba(255,240,180,0.25)",
          boxShadow: open
            ? "0 4px 20px rgba(0,0,0,0.5)"
            : "0 4px 24px rgba(201,168,76,0.45), 0 8px 40px rgba(0,0,0,0.35)",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.18 }}
            >
              <X size={20} strokeWidth={1.8} className="text-gold-primary" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <MessageCircle size={17} strokeWidth={1.8} style={{ color: "#0F0D0A" }} />
              <span
                className="font-medium whitespace-nowrap"
                style={{ fontSize: 11.5, letterSpacing: "0.04em", color: "#0F0D0A" }}
              >
                Chat with Assistant
              </span>
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{ borderRadius: 999, border: "2px solid rgba(201,168,76,0.55)" }}
            animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>
    </div>
  );
}
