"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const GREETING =
  "Hey there! 👋 I'm Amy's AI assistant. I can help you with finding homes, answering questions about Kingman, Golden Valley, Bullhead City, or Fort Mohave, or getting you connected with Amy directly. What can I help you with?";

const FONT = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  type: string;
  timeline: string;
  area: string;
  showingRequest: string;
  cashOfferInterest: boolean;
  notes: string;
}

const STYLES = `
  @keyframes chatRingPulse {
    0%   { transform: scale(1);   opacity: 0.55; }
    75%  { opacity: 0; }
    100% { transform: scale(2.4); opacity: 0;    }
  }
  @keyframes chatWindowOpen {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  @keyframes chatDotBounce {
    0%, 60%, 100% { transform: translateY(0);   }
    30%            { transform: translateY(-5px); }
  }

  .chat-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(184,168,152,0.45);
    animation: chatRingPulse 1.8s ease-out 0.7s forwards;
  }
  .chat-ring-2 { animation-delay: 1.15s; }

  .chat-window-open {
    animation: chatWindowOpen 300ms cubic-bezier(0.34,1.56,0.64,1) both;
    transform-origin: bottom right;
  }

  .chat-btn {
    transition: transform 180ms ease, box-shadow 180ms ease;
  }
  .chat-btn:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 6px 28px rgba(0,0,0,0.38) !important;
  }

  .chat-close-btn { transition: color 150ms ease; }
  .chat-close-btn:hover { color: #F0EBE3 !important; }

  .chat-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #B8A898;
    display: inline-block;
    animation: chatDotBounce 1.2s ease-in-out infinite;
  }
  .chat-dot:nth-child(2) { animation-delay: 0.18s; }
  .chat-dot:nth-child(3) { animation-delay: 0.36s; }

  .chat-messages {
    scrollbar-width: thin;
    scrollbar-color: rgba(184,168,152,0.3) transparent;
  }
  .chat-messages::-webkit-scrollbar       { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: rgba(184,168,152,0.3); border-radius: 2px; }

  .chat-input::placeholder { color: rgba(240,235,227,0.35); }

  @media (max-width: 480px) {
    .chat-window {
      width: calc(100vw - 32px) !important;
      height: calc(100vh - 120px) !important;
    }
  }
`;

export default function ChatWidget() {
  const pathname = usePathname();

  const [isOpen,       setIsOpen]       = useState(false);
  const [hasOpened,    setHasOpened]    = useState(false);
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [inputValue,   setInputValue]   = useState("");
  const [isTyping,     setIsTyping]     = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  // UUID in React state only — not localStorage
  const [sessionId] = useState<string>(() =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36)
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  if (pathname.startsWith("/admin")) return null;

  // Auto-scroll to bottom on new messages or typing indicator change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleOpen() {
    if (!hasOpened) {
      setMessages([{ role: "assistant", content: GREETING }]);
      setHasOpened(true);
    }
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 150);
  }

  function handleClose() {
    setIsOpen(false);
  }

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:  newMessages,
          sessionId,
          pageUrl:   typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "You've sent a lot of messages! Please wait a few minutes and try again. 😊" },
        ]);
        return;
      }

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong on my end. Please try again in a moment!" },
        ]);
        return;
      }

      const data: { content: string; leadData: LeadData | null } = await res.json();

      const updatedMessages: Message[] = [
        ...newMessages,
        { role: "assistant", content: data.content },
      ];
      setMessages(updatedMessages);

      // Fire lead capture exactly once per session when Claude signals it has contact info
      if (data.leadData && !leadCaptured) {
        setLeadCaptured(true);
        const transcript = updatedMessages
          .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
          .join("\n\n");

        fetch("/api/chat/capture-lead", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data.leadData, sessionId, conversationTranscript: transcript }),
        }).catch((err) => console.error("[Chat] Lead capture error:", err));
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = inputValue.trim().length > 0 && !isTyping;

  return (
    <>
      <style>{STYLES}</style>

      {/* Pulse rings — shown once on first page load, before user opens chat */}
      {!hasOpened && (
        <div
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9998,
            width: 60, height: 60, pointerEvents: "none",
          }}
        >
          <span className="chat-ring" />
          <span className="chat-ring chat-ring-2" />
        </div>
      )}

      {/* ── Chat toggle button (closed state) ──────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="chat-btn"
          aria-label="Open chat with Amy's assistant"
          style={{
            position:    "fixed",
            bottom:      24,
            right:       24,
            zIndex:      9999,
            width:       60,
            height:      60,
            borderRadius: "50%",
            background:  "#B8A898",
            border:      "none",
            cursor:      "pointer",
            display:     "flex",
            alignItems:  "center",
            justifyContent: "center",
            boxShadow:   "0 4px 20px rgba(0,0,0,.25)",
          }}
        >
          {/* Chat bubble icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              fill="white"
            />
          </svg>
        </button>
      )}

      {/* ── Chat window (open state) ────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="chat-window chat-window-open"
          style={{
            position:     "fixed",
            bottom:       24,
            right:        24,
            zIndex:       9999,
            width:        380,
            height:       520,
            background:   "#212529",
            borderRadius: 16,
            overflow:     "hidden",
            boxShadow:    "0 8px 40px rgba(0,0,0,.35)",
            display:      "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background:      "#2E3338",
              padding:         "16px 20px",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "space-between",
              flexShrink:      0,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 500,
                  fontSize:   15,
                  color:      "#F0EBE3",
                  margin:     0,
                  lineHeight: 1.3,
                }}
              >
                Amy&apos;s Assistant
              </p>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize:   12,
                  color:      "#B8A898",
                  margin:     "3px 0 0",
                }}
              >
                Typically replies instantly
              </p>
            </div>

            <button
              onClick={handleClose}
              className="chat-close-btn"
              aria-label="Close chat"
              style={{
                background: "none",
                border:     "none",
                cursor:     "pointer",
                color:      "#B8A898",
                display:    "flex",
                alignItems: "center",
                padding:    6,
                borderRadius: 6,
                lineHeight:   0,
              }}
            >
              {/* X icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div
            className="chat-messages"
            style={{
              flex:           1,
              overflowY:      "auto",
              padding:        "20px",
              display:        "flex",
              flexDirection:  "column",
              gap:            12,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display:        "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    background:   msg.role === "user" ? "#B8A898" : "#2E3338",
                    borderRadius: msg.role === "user"
                      ? "14px 14px 4px 14px"
                      : "14px 14px 14px 4px",
                    padding:      "12px 16px",
                    maxWidth:     "85%",
                    fontFamily:   FONT,
                    fontSize:     14,
                    color:        msg.role === "user" ? "#212529" : "#F0EBE3",
                    lineHeight:   1.6,
                    whiteSpace:   "pre-wrap",
                    wordBreak:    "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background:   "#2E3338",
                    borderRadius: "14px 14px 14px 4px",
                    padding:      "14px 18px",
                    display:      "flex",
                    gap:          6,
                    alignItems:   "center",
                  }}
                >
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              background:  "#2E3338",
              padding:     "12px 16px",
              borderTop:   "1px solid rgba(240,235,227,.06)",
              display:     "flex",
              alignItems:  "center",
              gap:         10,
              flexShrink:  0,
            }}
          >
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Type a message..."
              style={{
                flex:        1,
                background:  "#212529",
                color:       "#F0EBE3",
                border:      "none",
                borderRadius: 999,
                padding:     "10px 18px",
                fontFamily:  FONT,
                fontSize:    14,
                outline:     "none",
                minWidth:    0,
              }}
            />

            <button
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
              style={{
                width:        36,
                height:       36,
                borderRadius: "50%",
                background:   canSend ? "#B8A898" : "rgba(184,168,152,0.35)",
                border:       "none",
                cursor:       canSend ? "pointer" : "default",
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                flexShrink:   0,
                transition:   "background 180ms ease",
              }}
            >
              {/* Arrow right icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 8H14M14 8L9 3M14 8L9 13"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
