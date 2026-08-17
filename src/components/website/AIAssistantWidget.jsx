import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { askAiAssistant } from "@/services/aiChatService";
import { getErrorMessage } from "@/services/api";

const quickQuestions = [
  "I need a business website. How can you help?",
  "Can you build an e-commerce website?",
  "What do you need to estimate my project?",
];

const initialMessages = [
  {
    role: "assistant",
    content:
      "Hi, I am the CodeCraft.BD service assistant. Tell me what you want to build, and I will guide you to the right service.",
  },
];

const linkPattern = /(https?:\/\/[^\s]+)/g;

const renderMessageContent = (content) => {
  const parts = String(content).split(linkPattern);

  return parts.map((part, index) => {
    if (!part.match(linkPattern)) return part;

    const href = part.replace(/[.,)]$/, "");
    const trailingText = part.slice(href.length);

    return (
      <span key={`${href}-${index}`}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-current/40 underline-offset-4 transition hover:decoration-current"
        >
          {href}
        </a>
        {trailingText}
      </span>
    );
  });
};

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isOpen]);

  const sendMessage = async (messageText = input) => {
    const text = messageText.trim();
    if (!text || isSending) return;

    setMessages((current) => [...current, { role: "user", content: text }]);
    setInput("");
    setIsSending(true);

    try {
      const history = messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await askAiAssistant({
        message: text,
        history,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            response.data?.reply ||
            "Thanks. Please share a few project details and our team can guide you further.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `${getErrorMessage(
            error,
            "I could not answer right now.",
          )} You can still contact CodeCraft.BD through WhatsApp or the contact form.`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 flex h-[min(560px,calc(100vh-10rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft sm:w-96">
          <div className="flex items-center justify-between border-b border-border bg-canvas px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  Service assistant
                </p>
                <p className="truncate text-xs text-ink-muted">
                  Instant answers for project questions
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-ink/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label="Close AI assistant"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-accent text-white"
                      : "rounded-bl-md bg-canvas text-ink ring-1 ring-border"
                  }`}
                >
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-canvas px-4 py-3 text-sm text-ink-muted ring-1 ring-border">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  Finding an answer
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-surface px-4 py-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  disabled={isSending}
                  className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                maxLength={800}
                rows={1}
                placeholder="Ask about your project..."
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:h-14 sm:w-14"
        aria-label={isOpen ? "Close service assistant" : "Open service assistant"}
        title="Service assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default AIAssistantWidget;
