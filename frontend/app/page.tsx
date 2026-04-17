import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg flex flex-col">
        {/* Hero */}
        <section className="flex-1 flex flex-col justify-center max-w-5xl mx-auto px-6 pt-32 pb-24">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-px bg-accent" />
            <span className="text-label font-mono text-accent uppercase tracking-widest">
              Phase 1 · Private Beta
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-display-1 text-ink leading-tight mb-6 max-w-3xl">
            GitHub for your{" "}
            <span className="text-accent italic">mind.</span>
          </h1>

          {/* Subheading */}
          <p className="font-body text-body-lg text-muted-light max-w-xl mb-10 leading-relaxed">
            Track every book, article, podcast, and paper you consume. Build
            your intellectual fingerprint. Share a living portrait of who you
            are intellectually.
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/sign-up" id="hero-signup-btn" className="btn-primary text-sm">
              Start Tracking
            </Link>
            <Link href="/u/aseem" id="hero-demo-link" className="btn-ghost text-xs">
              View Demo Profile
            </Link>
          </div>

          {/* Divider */}
          <div className="divider mt-20 mb-16" />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Media Log",
                desc: "Books, articles, podcasts, videos, papers, newsletters — all in one place.",
              },
              {
                icon: Zap,
                title: "AI Insights",
                desc: "Claude generates a 1-sentence insight for every entry you log.",
              },
              {
                icon: Users,
                title: "Public Profile",
                desc: "Share /u/you — a scrollable page showing your intellectual fingerprint.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border-t border-border pt-6">
                <Icon size={18} className="text-accent mb-4" />
                <h3 className="font-serif text-h3 text-ink mb-2">{title}</h3>
                <p className="font-body text-body text-muted-light">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 px-6 max-w-5xl mx-auto w-full">
          <p className="text-label font-mono text-muted">
            © 2026 BrainLog · Dark mode only, by design.
          </p>
        </footer>
      </main>
    </>
  );
}
