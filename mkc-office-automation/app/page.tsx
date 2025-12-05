import Link from "next/link";
import { Briefcase, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-background to-background dark:from-slate-800 -z-10" />

      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Mahajan Kohli <span className="text-secondary">&</span> Co.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-widest font-medium">
          Office Automation Protocol
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Staff Card */}
        <Link
          href="/staff/dashboard"
          className="group relative flex flex-col items-center p-10 bg-card rounded-2xl shadow-xl border border-border/50 hover:border-secondary transition-all hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="p-4 bg-muted rounded-full mb-6 group-hover:bg-secondary/10 transition-colors">
            <Users className="w-12 h-12 text-muted-foreground group-hover:text-secondary transition-colors" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Staff Portal</h2>
          <p className="text-center text-muted-foreground mb-8">
            Update activity, mark attendance, and submit daily reports.
          </p>
          <div className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:text-secondary">
            Enter Portal <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>

        {/* Partner Card */}
        <Link
          href="/partner/dashboard"
          className="group relative flex flex-col items-center p-10 bg-card rounded-2xl shadow-xl border border-border/50 hover:border-primary transition-all hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="p-4 bg-muted rounded-full mb-6 group-hover:bg-primary/10 transition-colors">
            <Briefcase className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Partner Portal</h2>
          <p className="text-center text-muted-foreground mb-8">
            Monitor activity, assign tasks, and review performance.
          </p>
          <div className="mt-auto flex items-center text-sm font-semibold text-primary">
            Enter Portal <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>
      </div>

      <footer className="mt-16 text-sm text-muted-foreground">
        © {new Date().getFullYear()} MKC Internal Systems
      </footer>
    </main>
  );
}
