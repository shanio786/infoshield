import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Link } from "wouter";
import {
  Cpu, FolderSearch, Copy, Archive, Eye, Settings, Clock,
  Download, ChevronRight, Star, Zap, Shield, Check,
  MonitorDown, Apple, ArrowRight, Play
} from "lucide-react";

const stats = [
  { value: "2,847", label: "Files Organized", suffix: "" },
  { value: "4.2", label: "GB Space Saved", suffix: " GB" },
  { value: "156", label: "Duplicates Found", suffix: "" },
  { value: "12", label: "Hours Saved", suffix: "h" },
];

const features = [
  {
    icon: Cpu,
    title: "AI Auto-Categorize",
    description: "Automatically classifies files into Work, Personal, Finance, Media, and more using on-device AI.",
    color: "#0A84FF",
    tag: "Core Feature",
  },
  {
    icon: FolderSearch,
    title: "Smart Rename",
    description: "Suggests meaningful filenames based on file content — no more 'document_final_v3_REAL.pdf'.",
    color: "#30D158",
    tag: "AI Powered",
  },
  {
    icon: Copy,
    title: "Duplicate Detector",
    description: "Finds identical and near-identical files across all your folders, even if renamed.",
    color: "#FF9F0A",
    tag: "Storage Saver",
  },
  {
    icon: Archive,
    title: "File Compression",
    description: "Batch-compress old files to free up space while keeping them accessible.",
    color: "#BF5AF2",
    tag: "Space Saver",
  },
  {
    icon: Eye,
    title: "Quick Preview",
    description: "Preview images, PDFs, and documents without opening any external app.",
    color: "#64D2FF",
    tag: "Productivity",
  },
  {
    icon: Settings,
    title: "Rules Engine",
    description: "Set custom rules like 'if extension = .pdf → Finance folder' and watch it work automatically.",
    color: "#FF453A",
    tag: "Automation",
  },
];

const testimonials = [
  { name: "Sarah K.", role: "Freelance Designer", text: "FileFlow saved me hours every week. My Downloads folder is finally clean.", stars: 5 },
  { name: "Marcus T.", role: "Software Engineer", text: "The duplicate detector alone freed up 8 GB. Incredible tool.", stars: 5 },
  { name: "Priya M.", role: "Finance Analyst", text: "The rules engine is exactly what I needed for my documents workflow.", stars: 5 },
];

function CountUp({ target, suffix }: { target: string; suffix: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(target.replace(",", ""));
    const isDecimal = target.includes(".");
    const steps = 40;
    let current = 0;
    const timer = setInterval(() => {
      current += num / steps;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      setDisplay(
        isDecimal
          ? current.toFixed(1)
          : Math.floor(current).toLocaleString()
      );
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export function FileFlowLanding() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-['Inter',sans-serif] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0A84FF] flex items-center justify-center">
              <FolderSearch className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">FileFlow</span>
            <span className="text-xs text-white/30 ml-1">Desktop</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[13px] text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <Link href="/fileflow/demo" className="hover:text-white transition-colors">Demo</Link>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Changelog</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/fileflow/demo">
              <button className="text-[13px] text-white/60 hover:text-white transition-colors hidden sm:block">
                Live Demo
              </button>
            </Link>
            <a href="#download">
              <button className="h-8 px-4 bg-[#0A84FF] hover:bg-[#0A84FF]/90 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#0A84FF]/10 rounded-full blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-[#BF5AF2]/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0A84FF]/30 bg-[#0A84FF]/10 text-[12px] text-[#0A84FF] font-medium mb-6">
              <Zap className="w-3 h-3" />
              AI-Powered File Organization
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Your files,{" "}
            <span className="bg-gradient-to-r from-[#0A84FF] via-[#64D2FF] to-[#BF5AF2] bg-clip-text text-transparent">
              finally organized
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[17px] text-white/55 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            FileFlow uses on-device AI to automatically organize, rename, and clean up
            your files. No cloud uploads. No subscriptions. Just a clean desktop.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
          >
            <a href="#download">
              <button className="group flex items-center gap-2.5 h-12 px-6 bg-white text-black rounded-xl font-semibold text-[14px] hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Apple className="w-4 h-4" />
                Download for macOS
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </a>
            <a href="#download">
              <button className="group flex items-center gap-2.5 h-12 px-6 bg-white/[0.08] border border-white/10 rounded-xl font-semibold text-[14px] hover:bg-white/[0.12] transition-all">
                <MonitorDown className="w-4 h-4 text-white/70" />
                <span className="text-white/80">Download for Windows</span>
              </button>
            </a>
            <Link href="/fileflow/demo">
              <button className="group flex items-center gap-2 h-12 px-5 text-[14px] text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors">
                <Play className="w-3.5 h-3.5" />
                Watch Live Demo
              </button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[12px] text-white/30"
          >
            Free to try · No account required · Works on macOS 12+ and Windows 10+
          </motion.p>
        </div>

        {/* App Window Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto mt-14"
        >
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            {/* Window title bar */}
            <div className="h-9 bg-[#2C2C2E] flex items-center px-4 gap-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[12px] text-white/40">FileFlow — All Files (2,847)</span>
              </div>
            </div>

            {/* App body preview */}
            <div className="flex h-[420px] bg-[#1C1C1E]">
              {/* Sidebar */}
              <div className="w-48 bg-[#252527] border-r border-white/[0.06] p-3 flex flex-col gap-1 flex-shrink-0">
                {["Downloads", "Documents", "Desktop", "Pictures", "Finance", "Work"].map((folder, i) => (
                  <div key={folder} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] cursor-default ${i === 0 ? "bg-[#0A84FF]/20 text-[#0A84FF]" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-[#0A84FF]" : "bg-white/20"}`} />
                    {folder}
                  </div>
                ))}
                <div className="mt-auto pt-4 border-t border-white/[0.06]">
                  <div className="text-[10px] text-white/30 px-2 mb-1.5">STORAGE</div>
                  <div className="px-2">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[62%] bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] rounded-full" />
                    </div>
                    <div className="text-[10px] text-white/30 mt-1">186 GB of 500 GB</div>
                  </div>
                </div>
              </div>

              {/* Main area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="h-11 flex items-center gap-3 px-4 border-b border-white/[0.06] bg-[#242426]">
                  <div className="flex-1 h-7 bg-white/[0.06] rounded-lg flex items-center px-3 gap-2">
                    <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span className="text-[11px] text-white/25">Search files...</span>
                  </div>
                  <div className="h-7 px-3 bg-[#0A84FF] rounded-lg text-[11px] font-medium flex items-center gap-1.5 flex-shrink-0">
                    <Zap className="w-3 h-3" />
                    Auto-Organize
                  </div>
                </div>

                {/* File grid */}
                <div className="flex-1 p-4 grid grid-cols-5 gap-3 overflow-hidden">
                  {[
                    { name: "Q4_Report.pdf", icon: "📄", cat: "Finance", color: "#FF9F0A" },
                    { name: "vacation.zip", icon: "🗜️", cat: "Personal", color: "#30D158" },
                    { name: "mockup_v3.fig", icon: "🎨", cat: "Work", color: "#0A84FF" },
                    { name: "invoice_nov.pdf", icon: "📄", cat: "Finance", color: "#FF9F0A" },
                    { name: "photo_001.jpg", icon: "🖼️", cat: "Media", color: "#BF5AF2" },
                    { name: "contract.docx", icon: "📝", cat: "Work", color: "#0A84FF" },
                    { name: "budget.xlsx", icon: "📊", cat: "Finance", color: "#FF9F0A" },
                    { name: "family_vid.mp4", icon: "🎬", cat: "Media", color: "#BF5AF2" },
                    { name: "notes.txt", icon: "📋", cat: "Personal", color: "#30D158" },
                    { name: "backup.dmg", icon: "💿", cat: "System", color: "#64D2FF" },
                  ].map((file, i) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.04 }}
                      className="bg-[#2C2C2E] rounded-lg p-2.5 flex flex-col gap-2 border border-white/[0.04] hover:border-white/10 cursor-default"
                    >
                      <div className="text-xl leading-none">{file.icon}</div>
                      <div>
                        <div className="text-[10px] text-white/80 font-medium truncate">{file.name}</div>
                        <div className="text-[9px] mt-0.5 px-1 py-0.5 rounded-sm inline-block" style={{ background: `${file.color}20`, color: file.color }}>
                          {file.cat}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="h-7 bg-[#2C2C2E] border-t border-white/[0.06] flex items-center px-4 gap-6">
              {[["2,847 files", "#30D158"], ["186 GB used", "#0A84FF"], ["156 duplicates", "#FF9F0A"], ["Last scan: 2 min ago", "rgba(255,255,255,0.3)"]].map(([text, color]) => (
                <span key={text} className="text-[10px]" style={{ color }}>{text}</span>
              ))}
            </div>
          </div>

          {/* Glow effect behind window */}
          <div className="absolute inset-0 -z-10 bg-[#0A84FF]/10 blur-[60px] scale-90" />
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold tracking-tight text-white mb-1">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[13px] text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-[12px] text-white/40 uppercase tracking-widest mb-4 font-medium">Features</div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Everything your files need
            </h2>
            <p className="text-[16px] text-white/45 max-w-xl mx-auto">
              Powerful AI features built for power users who demand more from their file manager.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onHoverStart={() => setHoveredFeature(i)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-default overflow-hidden group"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(ellipse at top left, ${feature.color}08, transparent 60%)` }}
                  />
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${feature.color}18` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: feature.color }} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[15px]">{feature.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: `${feature.color}15`, color: feature.color }}>
                        {feature.tag}
                      </span>
                    </div>
                    <p className="text-[13px] text-white/50 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white/[0.015] border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-[12px] text-white/40 uppercase tracking-widest mb-4 font-medium">How It Works</div>
            <h2 className="text-4xl font-bold tracking-tight">Clean in 3 steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Install & Scan", desc: "Install FileFlow, point it at your folders, and let the AI scan your files in seconds.", icon: "🔍" },
              { step: "02", title: "Review AI Tags", desc: "See how the AI has categorized every file. Approve, adjust, or set custom rules.", icon: "🏷️" },
              { step: "03", title: "Auto-Organize", desc: "Hit the button. Files move to the right folders, duplicates are flagged, space is freed.", icon: "✨" },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-[11px] text-[#0A84FF] font-mono font-bold tracking-widest mb-2">STEP {step.step}</div>
                <h3 className="font-semibold text-[17px] mb-2">{step.title}</h3>
                <p className="text-[13px] text-white/45 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-3">Loved by power users</h2>
            <div className="flex items-center justify-center gap-1 text-[#FF9F0A]">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-[13px] text-white/40 ml-2">4.9 / 5 on Product Hunt</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.07]"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[#FF9F0A] text-[#FF9F0A]" />
                  ))}
                </div>
                <p className="text-[13px] text-white/65 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-medium text-[13px]">{t.name}</div>
                  <div className="text-[11px] text-white/35">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#0A84FF]/25 bg-gradient-to-br from-[#0A84FF]/10 to-[#BF5AF2]/10 p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A84FF]/5 to-transparent" />
            <div className="relative">
              <div className="text-4xl mb-4">🖥️</div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">See FileFlow in action</h2>
              <p className="text-[15px] text-white/50 mb-6">
                Try the interactive demo — no download required. Experience the full app UI in your browser.
              </p>
              <Link href="/fileflow/demo">
                <button className="inline-flex items-center gap-2 h-11 px-6 bg-[#0A84FF] hover:bg-[#0A84FF]/90 rounded-xl text-[14px] font-semibold transition-all shadow-[0_0_30px_rgba(10,132,255,0.3)]">
                  <Play className="w-4 h-4" />
                  Open Live Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download section */}
      <section id="download" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[12px] text-white/40 uppercase tracking-widest mb-4 font-medium">Download</div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Start for free today</h2>
            <p className="text-[16px] text-white/45 mb-10">
              Available on macOS and Windows. Free plan includes up to 1,000 files.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="group flex items-center justify-center gap-3 h-14 px-8 bg-white text-black rounded-2xl font-semibold text-[15px] hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.12)]">
                <Apple className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[10px] font-normal opacity-60">Download for</div>
                  <div>macOS</div>
                </div>
                <span className="ml-1 text-[10px] bg-black/10 px-2 py-0.5 rounded-full">v2.4.1</span>
              </button>

              <button className="group flex items-center justify-center gap-3 h-14 px-8 bg-white/[0.07] border border-white/10 rounded-2xl font-semibold text-[15px] hover:bg-white/[0.10] transition-all">
                <MonitorDown className="w-5 h-5 text-white/70" />
                <div className="text-left">
                  <div className="text-[10px] font-normal opacity-40">Download for</div>
                  <div className="text-white/80">Windows</div>
                </div>
                <span className="ml-1 text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/40">v2.4.1</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-[12px] text-white/30">
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#30D158]" />Free to start</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#30D158]" />No account needed</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-[#30D158]" />100% on-device AI</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#0A84FF] flex items-center justify-center">
              <FolderSearch className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-[14px]">FileFlow Desktop</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Support</a>
            <a href="#" className="hover:text-white/60 transition-colors">GitHub</a>
          </div>
          <span className="text-[12px] text-white/25">© 2024 FileFlow. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
