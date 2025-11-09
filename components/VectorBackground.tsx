"use client";

interface VectorBackgroundProps {
  darkMode?: boolean;
}

export default function VectorBackground({ darkMode = false }: VectorBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Hearts */}
      <div className="absolute top-10 left-10 animate-float-slow">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(236, 72, 153, 0.1)" : "rgba(236, 72, 153, 0.15)"}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <div className="absolute top-1/4 right-20 animate-float-medium">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(167, 139, 250, 0.1)" : "rgba(167, 139, 250, 0.15)"}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <div className="absolute bottom-1/4 left-1/4 animate-float-fast">
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(244, 114, 182, 0.08)" : "rgba(244, 114, 182, 0.12)"}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Stars */}
      <div className="absolute top-1/3 left-1/2 animate-pulse-slow">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(251, 191, 36, 0.15)" : "rgba(251, 191, 36, 0.2)"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 right-1/3 animate-pulse-medium">
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(251, 191, 36, 0.12)" : "rgba(251, 191, 36, 0.18)"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* Music Notes */}
      <div className="absolute top-1/2 right-10 animate-float-slow">
        <svg
          width="35"
          height="35"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(96, 165, 250, 0.1)" : "rgba(96, 165, 250, 0.15)"}
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-1/3 animate-float-medium">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(96, 165, 250, 0.08)" : "rgba(96, 165, 250, 0.12)"}
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>

      {/* Sparkles */}
      <div className="absolute top-20 right-1/4 animate-twinkle">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(192, 132, 252, 0.2)" : "rgba(192, 132, 252, 0.25)"}
        >
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-1/4 animate-twinkle-delayed">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={darkMode ? "rgba(192, 132, 252, 0.15)" : "rgba(192, 132, 252, 0.2)"}
        >
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
      </div>

      {/* Abstract Circles */}
      <div className="absolute top-1/4 left-10 opacity-30">
        <div
          className={`w-32 h-32 rounded-full ${
            darkMode
              ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
              : "bg-gradient-to-br from-purple-200/30 to-pink-200/30"
          } blur-2xl animate-pulse-slow`}
        />
      </div>

      <div className="absolute bottom-1/3 right-10 opacity-30">
        <div
          className={`w-40 h-40 rounded-full ${
            darkMode
              ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
              : "bg-gradient-to-br from-blue-200/30 to-purple-200/30"
          } blur-2xl animate-pulse-medium`}
        />
      </div>

      <div className="absolute top-1/2 left-1/3 opacity-20">
        <div
          className={`w-24 h-24 rounded-full ${
            darkMode
              ? "bg-gradient-to-br from-pink-500/10 to-rose-500/10"
              : "bg-gradient-to-br from-pink-200/30 to-rose-200/30"
          } blur-2xl animate-pulse-fast`}
        />
      </div>
    </div>
  );
}

