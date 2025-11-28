"use client";

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
      className="min-h-screen bg-background text-foreground transition-colors duration-700"
    >
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center transition-colors duration-700">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">TruthBox</h1>

        <p
          style={{ color: "var(--muted-foreground)" }}
          className="text-lg max-w-md mb-10"
        >
          Receive honest anonymous messages safely and easily. Share your link
          and start getting real feedback.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/login"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            className="relative px-8 py-3 rounded-xl font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 group overflow-hidden"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            Login
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
          </a>

          <a
            href="/signup"
            style={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
            }}
            className="relative px-8 py-3 rounded-xl border font-medium shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 group overflow-hidden"
          >
            <span
              style={{ backgroundColor: "var(--primary)" }}
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            />
            Create Account
            <span
              style={{ backgroundColor: "var(--primary)" }}
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
            />
          </a>
        </div>
      </main>
    </div>
  );
}
