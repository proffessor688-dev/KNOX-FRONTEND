import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext.jsx";
import { getCharacterById } from "../api/character.js";
import { getMessagesByConversationId } from "../api/conversation.js";

const DEFAULT_AVATAR = "/default-avatar.png";
const BASE_URL = "https://knox-backend-2.onrender.com";

export default function ChatPage() {
  const { characterId } = useParams();
  const { user, loading: authLoading } = useUser();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const bottomRef = useRef(null);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const [charRes, msgRes] = await Promise.all([
          getCharacterById(characterId),
          getMessagesByConversationId(characterId),
        ]);

        const charData = charRes.data.characters;
        const history = msgRes.data.messages || [];

        setCharacter(charData);

        // ALWAYS show greeting at the top, followed by history
        const greeting = {
          sender: "ai",
          message: charData?.greeting || `Hello! I am ${charData?.name || "your companion"}.`,
          isGreeting: true,
        };

        setMessages([greeting, ...history]);
        setDataLoaded(true);
      } catch (err) {
        console.error("Chat Init Error:", err);
        setDataLoaded(true);
      }
    };

    if (characterId) initChat();
  }, [characterId]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMsg = { sender: "user", message: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/chat/send`,
        { characterId, message: trimmedInput },
        { withCredentials: true }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "ai", message: res.data.aiReply },
      ]);
    } catch (err) {
      console.error("Send Error:", err);
      // Optional: Add a "failed to send" state to the last message
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !dataLoaded) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#05050c] text-purple-500">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-purple-500/20 rounded-full animate-spin mb-4" />
        <p className="font-bold tracking-widest animate-pulse">SYNCHRONIZING...</p>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#05050c] text-zinc-100 overflow-hidden">
      {/* HEADER */}
      <header className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0d0d12]/90 backdrop-blur-2xl z-50 shadow-2xl">
        <Link to="/Explore" className="flex items-center gap-3 group">
          <div className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <span className="text-purple-500 text-2xl">←</span>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50 bg-zinc-800 shadow-lg">
            <img
              src={character?.avatar ? `${BASE_URL}${character.avatar}` : DEFAULT_AVATAR}
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              className="w-full h-full object-cover"
              alt="Character"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide group-hover:text-purple-400 transition-colors">
              {character?.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</span>
            </div>
          </div>
        </Link>

        <Link to="/profile" className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-zinc-800 hover:border-purple-500/50 transition-all flex items-center justify-center">
          {user?.avatar ? (
            <img
              src={`${BASE_URL}${user.avatar}`}
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              className="w-full h-full object-cover"
              alt="User"
            />
          ) : (
            <span className="text-purple-400 font-bold uppercase">{user?.name?.[0] || "U"}</span>
          )}
        </Link>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:px-20 lg:px-64 space-y-8 scrollbar-thin scrollbar-thumb-white/10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#05050c] to-[#05050c]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex-shrink-0 shadow-md">
              <img
                src={msg.sender === "ai" 
                  ? (character?.avatar ? `${BASE_URL}${character.avatar}` : DEFAULT_AVATAR) 
                  : (user?.avatar ? `${BASE_URL}${user.avatar}` : DEFAULT_AVATAR)
                }
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                className="w-full h-full object-cover grayscale-[0.2]"
                alt="Avatar"
              />
            </div>

            <div
              className={`max-w-[85%] md:max-w-[75%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-2xl ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none"
                  : "bg-white/[0.05] border border-white/10 text-zinc-100 rounded-tl-none backdrop-blur-sm"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10" />
            <div className="flex gap-1.5 p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </main>

      {/* INPUT AREA */}
      <footer className="p-4 md:p-8 bg-[#05050c] border-t border-white/5">
        <div className="max-w-4xl mx-auto flex gap-4 items-center bg-white/[0.03] p-2 pl-5 pr-2 rounded-[30px] border border-white/10 focus-within:border-purple-500/40 focus-within:bg-white/[0.05] transition-all shadow-2xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Message ${character?.name}...`}
            className="flex-1 bg-transparent py-3 text-white outline-none placeholder:text-zinc-600 text-sm md:text-base"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-purple-600 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full text-white hover:bg-purple-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:scale-100 shadow-lg shadow-purple-900/20"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer >
    </div>
  );
}