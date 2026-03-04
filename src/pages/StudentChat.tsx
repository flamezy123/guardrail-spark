import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, HelpCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const StudentChat = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      // Fetch course name
      supabase.from("courses").select("title").eq("id", courseId).single().then(({ data }) => {
        if (data) setCourseName(data.title);
      });
      // Create session
      supabase.from("chat_sessions").insert({ course_id: courseId }).select().single().then(({ data }) => {
        if (data) setSessionId(data.id);
      });
    }
  }, [courseId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string, isStuck = false) => {
    if (!content.trim() || isLoading || !courseId) return;

    const userMsg: Message = { role: "user", content: isStuck ? `[STUDENT IS STUCK] ${content || "I'm stuck and need a hint."}` : content };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Save user message
    if (sessionId) {
      await supabase.from("chat_messages").insert({ session_id: sessionId, role: "user", content: userMsg.content });
    }

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, courseId, isStuck }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate limited", description: "Please wait a moment and try again.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Usage limit reached", description: "Please try again later.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantSoFar += delta;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save assistant message
      if (sessionId && assistantSoFar) {
        await supabase.from("chat_messages").insert({ session_id: sessionId, role: "assistant", content: assistantSoFar });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Could not reach the AI. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-sm font-[Space_Grotesk]">Neural Layer</h1>
          <p className="text-xs text-muted-foreground">{courseName || "Loading..."}</p>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <Brain className="w-16 h-16 mx-auto text-primary/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Ready to learn?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ask me a question about the course material. I won't give you direct answers — I'll help you think through problems step by step.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-card border rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => sendMessage("I'm stuck and need a hint on what we've been discussing.", true)}
            disabled={isLoading || messages.length === 0}
            title="I'm stuck — get a hint"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
          <form
            className="flex gap-2 flex-1"
            onSubmit={e => { e.preventDefault(); sendMessage(input); }}
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;
