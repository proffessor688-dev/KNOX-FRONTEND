import React from "react";
import { useNavigate } from "react-router-dom";


const CharacterCard = ({ character, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chat/${character._id}`)}
      className="group relative min-h-[20rem] h-full bg-gradient-to-b from-[#a8bdff] to-[#e6c4ff] border border-white/10 rounded-3xl p-5 sm:p-6 transition-all duration-500 cursor-pointer hover:border-indigo-500/30 hover:-translate-y-2 overflow-hidden flex flex-col"
    >
      {/* Background Decorative Gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600/10 blur-[80px] group-hover:bg-indigo-600/20 transition-all duration-500" />

      {/* Floating Action Menu 
          Changed: Opacity-100 on small screens (mobile) because hover doesn't exist.
          Visible on hover for lg screens.
      */}
      <div
        className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 z-10 
                      opacity-100 lg:opacity-0 lg:group-hover:opacity-100 
                      lg:translate-x-4 lg:group-hover:translate-x-0 transition-all duration-300"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/character/edit/${character._id}`);
          }}
          className="p-2.5 sm:p-2 bg-white/20 lg:bg-white/5 hover:bg-white/30 rounded-full border border-white/20 text-indigo-900 lg:text-white/60 lg:hover:text-white transition-all shadow-sm"
          title="Edit Character"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(character._id);
          }}
          className="p-2.5 sm:p-2 bg-red-500/10 lg:bg-red-500/5 hover:bg-red-500/20 rounded-full border border-red-500/20 text-red-600 lg:text-red-400/60 lg:hover:text-red-400 transition-all shadow-sm"
          title="Delete Character"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between gap-4">
        {/* Avatar Section */}
        <div className="relative mt-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <img
            src={`https://knox-backend-2.onrender.com${character.avatar}`}
            alt={character.name}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-[3px] border-white/50 group-hover:border-white transition-all duration-500 shadow-lg"
          />
        </div>

        {/* Text Content */}
        <div className="text-center w-full px-2">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight transition-all">
            {character.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-700 line-clamp-2 italic leading-relaxed">
            "{character.description}"
          </p>
        </div>

        {/* Action Button - Full width on all screens */}
        <div className="w-full">
          <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/30 lg:bg-white/10 group-hover:bg-indigo-600 transition-all duration-300 text-sm font-bold text-zinc-800 group-hover:text-white border border-white/40 group-hover:border-indigo-400 shadow-sm">
            <span>Chat Now</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
