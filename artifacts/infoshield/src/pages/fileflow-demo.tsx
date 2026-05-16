import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Search, Grid3X3, List, ChevronDown, Zap, FolderOpen, Star,
  FileText, Image, Video, Music, Archive, Code, File,
  ChevronRight, X, Minus, Square, FolderSearch, Copy,
  Trash2, Tag, Clock, HardDrive, LayoutGrid, AlignJustify,
  SlidersHorizontal, RefreshCw, CheckCircle2, AlertTriangle, Check,
  Sparkles, Brain, ArrowRight, Home, FolderPlus, Settings,
  Info, Eye, Download, ZoomIn, MoreHorizontal, Shield,
  TrendingUp, Filter, Maximize2
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

type FileItem = {
  id: number;
  name: string;
  ext: string;
  size: string;
  sizeBytes: number;
  modified: string;
  folder: string;
  aiCategory: string;
  aiTags: string[];
  isDuplicate: boolean;
  duplicateOf: number | null;
  renameSuggestion: string | null;
  organized: boolean;
  color: string;
  emoji: string;
};

const FILES: FileItem[] = [
  { id: 1, name: "Q4_Financial_Report_2024.pdf", ext: "pdf", size: "2.4 MB", sizeBytes: 2516582, modified: "Dec 15, 2024", folder: "Downloads", aiCategory: "Finance", aiTags: ["report", "quarterly", "finance"], isDuplicate: false, duplicateOf: null, renameSuggestion: "2024-Q4-Financial-Report.pdf", organized: false, color: "#FF9F0A", emoji: "📄" },
  { id: 2, name: "vacation_photos_edit.zip", ext: "zip", size: "156 MB", sizeBytes: 163577856, modified: "Dec 10, 2024", folder: "Downloads", aiCategory: "Personal", aiTags: ["photos", "vacation", "archive"], isDuplicate: true, duplicateOf: 14, renameSuggestion: null, organized: false, color: "#30D158", emoji: "🗜️" },
  { id: 3, name: "project_mockup_v3_FINAL.fig", ext: "fig", size: "8.2 MB", sizeBytes: 8598323, modified: "Dec 14, 2024", folder: "Desktop", aiCategory: "Work", aiTags: ["design", "mockup", "ui"], isDuplicate: false, duplicateOf: null, renameSuggestion: "project-mockup-v3.fig", organized: false, color: "#0A84FF", emoji: "🎨" },
  { id: 4, name: "Invoice_November_2024.pdf", ext: "pdf", size: "412 KB", sizeBytes: 421888, modified: "Nov 30, 2024", folder: "Downloads", aiCategory: "Finance", aiTags: ["invoice", "payment", "finance"], isDuplicate: false, duplicateOf: null, renameSuggestion: "2024-11-Invoice.pdf", organized: false, color: "#FF9F0A", emoji: "📄" },
  { id: 5, name: "photo_001.jpg", ext: "jpg", size: "4.1 MB", sizeBytes: 4299161, modified: "Dec 8, 2024", folder: "Desktop", aiCategory: "Media", aiTags: ["photo", "image", "personal"], isDuplicate: true, duplicateOf: 15, renameSuggestion: null, organized: false, color: "#BF5AF2", emoji: "🖼️" },
  { id: 6, name: "client_contract_draft.docx", ext: "docx", size: "890 KB", sizeBytes: 911360, modified: "Dec 12, 2024", folder: "Documents", aiCategory: "Work", aiTags: ["contract", "legal", "client"], isDuplicate: false, duplicateOf: null, renameSuggestion: "Client-Contract-Draft-2024.docx", organized: false, color: "#0A84FF", emoji: "📝" },
  { id: 7, name: "budget_2025_planning.xlsx", ext: "xlsx", size: "1.2 MB", sizeBytes: 1258291, modified: "Dec 11, 2024", folder: "Documents", aiCategory: "Finance", aiTags: ["budget", "planning", "spreadsheet"], isDuplicate: false, duplicateOf: null, renameSuggestion: "2025-Budget-Planning.xlsx", organized: false, color: "#FF9F0A", emoji: "📊" },
  { id: 8, name: "family_vacation_video.mp4", ext: "mp4", size: "2.1 GB", sizeBytes: 2254857830, modified: "Dec 5, 2024", folder: "Downloads", aiCategory: "Media", aiTags: ["video", "family", "vacation"], isDuplicate: false, duplicateOf: null, renameSuggestion: null, organized: false, color: "#BF5AF2", emoji: "🎬" },
  { id: 9, name: "quick_notes.txt", ext: "txt", size: "12 KB", sizeBytes: 12288, modified: "Dec 13, 2024", folder: "Desktop", aiCategory: "Personal", aiTags: ["notes", "text", "personal"], isDuplicate: false, duplicateOf: null, renameSuggestion: null, organized: false, color: "#30D158", emoji: "📋" },
  { id: 10, name: "macOS_Sonoma.dmg", ext: "dmg", size: "14.2 GB", sizeBytes: 15250856755, modified: "Nov 20, 2024", folder: "Downloads", aiCategory: "System", aiTags: ["software", "installer", "macos"], isDuplicate: false, duplicateOf: null, renameSuggestion: null, organized: false, color: "#64D2FF", emoji: "💿" },
  { id: 11, name: "presentation_dec.pptx", ext: "pptx", size: "18 MB", sizeBytes: 18874368, modified: "Dec 14, 2024", folder: "Documents", aiCategory: "Work", aiTags: ["presentation", "slides", "work"], isDuplicate: false, duplicateOf: null, renameSuggestion: "Dec-2024-Presentation.pptx", organized: false, color: "#0A84FF", emoji: "📊" },
  { id: 12, name: "resume_2024_v2.pdf", ext: "pdf", size: "340 KB", sizeBytes: 348160, modified: "Oct 15, 2024", folder: "Documents", aiCategory: "Personal", aiTags: ["resume", "career", "personal"], isDuplicate: false, duplicateOf: null, renameSuggestion: "Resume-2024.pdf", organized: false, color: "#30D158", emoji: "📄" },
  { id: 13, name: "app_screenshot_old.png", ext: "png", size: "890 KB", sizeBytes: 911360, modified: "Nov 5, 2024", folder: "Desktop", aiCategory: "Work", aiTags: ["screenshot", "design", "app"], isDuplicate: false, duplicateOf: null, renameSuggestion: null, organized: false, color: "#0A84FF", emoji: "🖼️" },
  { id: 14, name: "vacation_photos_edit_copy.zip", ext: "zip", size: "156 MB", sizeBytes: 163577856, modified: "Dec 10, 2024", folder: "Documents", aiCategory: "Personal", aiTags: ["photos", "vacation", "duplicate"], isDuplicate: true, duplicateOf: 2, renameSuggestion: null, organized: false, color: "#FF453A", emoji: "🗜️" },
  { id: 15, name: "photo_001_backup.jpg", ext: "jpg", size: "4.1 MB", sizeBytes: 4299161, modified: "Dec 8, 2024", folder: "Downloads", aiCategory: "Media", aiTags: ["photo", "backup", "duplicate"], isDuplicate: true, duplicateOf: 5, renameSuggestion: null, organized: false, color: "#FF453A", emoji: "🖼️" },
  { id: 16, name: "taxes_2023.pdf", ext: "pdf", size: "1.8 MB", sizeBytes: 1887437, modified: "Apr 15, 2024", folder: "Documents", aiCategory: "Finance", aiTags: ["taxes", "2023", "finance"], isDuplicate: false, duplicateOf: null, renameSuggestion: "2023-Tax-Return.pdf", organized: false, color: "#FF9F0A", emoji: "📄" },
  { id: 17, name: "code_backup.zip", ext: "zip", size: "45 MB", sizeBytes: 47185920, modified: "Dec 1, 2024", folder: "Downloads", aiCategory: "Work", aiTags: ["code", "backup", "development"], isDuplicate: false, duplicateOf: null, renameSuggestion: null, organized: false, color: "#0A84FF", emoji: "🗜️" },
  { id: 18, name: "music_playlist.mp3", ext: "mp3", size: "6.7 MB", sizeBytes: 7021158, modified: "Nov 28, 2024", folder: "Downloads", aiCategory: "Media", aiTags: ["music", "audio", "media"], isDuplicate: false, duplicateOf: null, renameSuggestion: null, organized: false, color: "#BF5AF2", emoji: "🎵" },
];

const FOLDERS = [
  { name: "All Files", icon: "📁", count: 18 },
  { name: "Downloads", icon: "⬇️", count: 9 },
  { name: "Documents", icon: "📂", count: 6 },
  { name: "Desktop", icon: "🖥️", count: 4 },
  { name: "Finance", icon: "💰", count: 5 },
  { name: "Work Projects", icon: "💼", count: 4 },
  { name: "Personal", icon: "👤", count: 3 },
  { name: "Media", icon: "🎬", count: 4 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Finance: "#FF9F0A",
  Work: "#0A84FF",
  Personal: "#30D158",
  Media: "#BF5AF2",
  System: "#64D2FF",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FileIcon({ ext, emoji }: { ext: string; emoji: string }) {
  return <span className="text-2xl leading-none">{emoji}</span>;
}

function CategoryBadge({ cat, small = false }: { cat: string; small?: boolean }) {
  const color = CATEGORY_COLORS[cat] || "#888";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium ${small ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"}`}
      style={{ background: `${color}20`, color }}
    >
      {cat}
    </span>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

type AppView = "grid" | "organize" | "duplicates" | "preview";

interface GridViewProps {
  files: FileItem[];
  viewMode: "grid" | "list";
  selectedFile: FileItem | null;
  onSelectFile: (f: FileItem) => void;
  organized: boolean;
  searchQuery: string;
}

function GridView({ files, viewMode, selectedFile, onSelectFile, organized, searchQuery }: GridViewProps) {
  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.aiCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewMode === "list") {
    return (
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 grid grid-cols-[1fr_80px_100px_90px_90px] gap-3 px-4 py-2 text-[10px] text-white/30 uppercase tracking-wider border-b border-white/[0.04] bg-[#1C1C1E] font-medium">
          <span>Name</span>
          <span>Size</span>
          <span>Type</span>
          <span>Modified</span>
          <span>Category</span>
        </div>
        <div>
          {filtered.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.025 }}
              onClick={() => onSelectFile(file)}
              className={`grid grid-cols-[1fr_80px_100px_90px_90px] gap-3 px-4 py-2.5 border-b border-white/[0.03] cursor-pointer transition-colors ${selectedFile?.id === file.id ? "bg-[#0A84FF]/15 border-[#0A84FF]/20" : "hover:bg-white/[0.03]"} ${file.isDuplicate && organized ? "bg-[#FF453A]/5" : ""}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base leading-none flex-shrink-0">{file.emoji}</span>
                <span className="text-[12px] font-medium text-white/85 truncate">{file.name}</span>
                {file.isDuplicate && organized && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF453A]/20 text-[#FF453A] flex-shrink-0">DUP</span>}
              </div>
              <span className="text-[11px] text-white/40 self-center">{file.size}</span>
              <span className="text-[11px] text-white/40 self-center uppercase">{file.ext}</span>
              <span className="text-[11px] text-white/40 self-center">{file.modified}</span>
              <div className="self-center">{organized && <CategoryBadge cat={file.aiCategory} small />}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {organized && (
        <div className="mb-4">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
            const catFiles = filtered.filter(f => f.aiCategory === cat);
            if (!catFiles.length) return null;
            return (
              <div key={cat} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">{cat}</span>
                  <span className="text-[10px] text-white/30">— {catFiles.length} files</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
                  {catFiles.map((file, i) => (
                    <FileCard key={file.id} file={file} i={i} selected={selectedFile?.id === file.id} onSelect={onSelectFile} organized={organized} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!organized && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
          {filtered.map((file, i) => (
            <FileCard key={file.id} file={file} i={i} selected={selectedFile?.id === file.id} onSelect={onSelectFile} organized={organized} />
          ))}
        </div>
      )}
    </div>
  );
}

function FileCard({ file, i, selected, onSelect, organized }: {
  file: FileItem; i: number; selected: boolean; onSelect: (f: FileItem) => void; organized: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => onSelect(file)}
      className={`relative p-3 rounded-xl border cursor-pointer transition-all ${
        selected
          ? "border-[#0A84FF]/60 bg-[#0A84FF]/15 shadow-[0_0_0_1px_#0A84FF30]"
          : file.isDuplicate && organized
          ? "border-[#FF453A]/30 bg-[#FF453A]/8 hover:bg-[#FF453A]/12"
          : "border-white/[0.05] bg-[#2C2C2E] hover:bg-[#343436] hover:border-white/10"
      }`}
    >
      {file.isDuplicate && organized && (
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#FF453A] flex items-center justify-center">
          <Copy className="w-2 h-2 text-white" />
        </div>
      )}
      <div className="text-2xl mb-2">{file.emoji}</div>
      <div className="text-[10px] text-white/80 font-medium truncate leading-tight">{file.name}</div>
      <div className="text-[9px] text-white/35 mt-0.5">{file.size}</div>
      {organized && <div className="mt-1.5"><CategoryBadge cat={file.aiCategory} small /></div>}
    </motion.div>
  );
}

interface OrganizeViewProps {
  files: FileItem[];
  onComplete: () => void;
}

function OrganizeView({ files, onComplete }: OrganizeViewProps) {
  const [phase, setPhase] = useState<"scanning" | "categorizing" | "moving" | "done">("scanning");
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [categorized, setCategorized] = useState<number[]>([]);

  useEffect(() => {
    const phases: Array<{ phase: typeof phase; duration: number }> = [
      { phase: "scanning", duration: 2000 },
      { phase: "categorizing", duration: 3500 },
      { phase: "moving", duration: 2000 },
      { phase: "done", duration: 0 },
    ];

    let timeout: ReturnType<typeof setTimeout>;
    let i = 0;
    let p = 0;

    const progressInterval = setInterval(() => {
      p += 1.5;
      setProgress(Math.min(p, 100));
    }, 60);

    const fileInterval = setInterval(() => {
      setCurrentFile(prev => {
        if (prev < files.length - 1) {
          setCategorized(c => [...c, prev]);
          return prev + 1;
        }
        clearInterval(fileInterval);
        return prev;
      });
    }, 180);

    const advance = () => {
      if (i < phases.length - 1) {
        i++;
        setPhase(phases[i].phase);
        if (phases[i].duration > 0) {
          timeout = setTimeout(advance, phases[i].duration);
        } else {
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(onComplete, 800);
        }
      }
    };

    timeout = setTimeout(advance, phases[0].duration);
    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
      clearInterval(fileInterval);
    };
  }, []);

  const phaseMessages = {
    scanning: "Scanning file metadata and content...",
    categorizing: "AI is analyzing and categorizing files...",
    moving: "Moving files to organized folders...",
    done: "Organization complete!",
  };

  const categoryStats = Object.entries(CATEGORY_COLORS).map(([cat, color]) => ({
    cat, color, count: files.filter(f => f.aiCategory === cat).length
  }));

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#0A84FF]" />
          </div>
          <div>
            <h3 className="font-semibold text-[15px]">AI Auto-Organize</h3>
            <p className="text-[12px] text-white/40">{phaseMessages[phase]}</p>
          </div>
          {phase === "done" && <CheckCircle2 className="w-5 h-5 text-[#30D158] ml-auto" />}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#0A84FF] to-[#64D2FF]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
          <span>{Math.round(progress)}% complete</span>
          <span>{categorized.length} of {files.length} files processed</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {categoryStats.map(({ cat, color, count }) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.03] text-center"
          >
            <div className="text-2xl font-bold mb-1" style={{ color }}>{count}</div>
            <div className="text-[10px] text-white/40">{cat}</div>
          </motion.div>
        ))}
      </div>

      {/* File processing list */}
      <div className="space-y-1.5 max-h-[280px] overflow-auto">
        {files.slice(0, Math.max(currentFile + 1, 0)).map((file, i) => {
          const isDone = i < categorized.length;
          const isCurrent = i === currentFile && !isDone;
          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isCurrent ? "bg-[#0A84FF]/15 border border-[#0A84FF]/25" : "bg-white/[0.02]"
              }`}
            >
              <span className="text-base leading-none w-5 text-center flex-shrink-0">{file.emoji}</span>
              <span className="text-[11px] text-white/70 flex-1 truncate font-medium">{file.name}</span>
              <span className="text-[10px] text-white/30 flex-shrink-0">{file.size}</span>
              {isDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
                  <CategoryBadge cat={file.aiCategory} small />
                </motion.div>
              ) : isCurrent ? (
                <div className="w-3 h-3 border border-[#0A84FF]/60 border-t-[#0A84FF] rounded-full animate-spin flex-shrink-0" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-white/10 flex-shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface DuplicatesViewProps {
  files: FileItem[];
}

function DuplicatesView({ files }: DuplicatesViewProps) {
  const [deleted, setDeleted] = useState<number[]>([]);

  const duplicatePairs = files
    .filter(f => f.isDuplicate && f.duplicateOf !== null && !deleted.includes(f.id))
    .map(f => ({ dup: f, original: files.find(o => o.id === f.duplicateOf)! }))
    .filter(p => p.original && !deleted.includes(p.original.id));

  const totalSavings = duplicatePairs.reduce((acc, p) => acc + p.dup.sizeBytes, 0);
  const formatBytes = (b: number) => b > 1e9 ? `${(b / 1e9).toFixed(1)} GB` : b > 1e6 ? `${(b / 1e6).toFixed(0)} MB` : `${(b / 1e3).toFixed(0)} KB`;

  return (
    <div className="flex-1 p-5 overflow-auto">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 text-center">
          <div className="text-3xl font-bold text-[#FF453A] mb-1">{duplicatePairs.length}</div>
          <div className="text-[11px] text-white/40">Duplicate Pairs</div>
        </div>
        <div className="p-4 rounded-xl bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 text-center">
          <div className="text-3xl font-bold text-[#FF9F0A] mb-1">{formatBytes(totalSavings)}</div>
          <div className="text-[11px] text-white/40">Reclaimable Space</div>
        </div>
        <div className="p-4 rounded-xl bg-[#30D158]/10 border border-[#30D158]/20 text-center">
          <div className="text-3xl font-bold text-[#30D158] mb-1">{deleted.length}</div>
          <div className="text-[11px] text-white/40">Already Removed</div>
        </div>
      </div>

      {duplicatePairs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <CheckCircle2 className="w-12 h-12 text-[#30D158] mx-auto mb-4" />
          <h3 className="font-semibold text-[16px] mb-2">All duplicates removed!</h3>
          <p className="text-[13px] text-white/40">You've freed up all duplicate space.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="text-[11px] text-white/35 uppercase tracking-wider font-medium mb-3">
            Duplicate Files Found
          </div>
          {duplicatePairs.map(({ dup, original }) => (
            <motion.div
              key={dup.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="p-4 rounded-xl border border-[#FF453A]/20 bg-[#FF453A]/6"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white/40 mb-2">Identical files ({dup.size} each)</div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{original.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-white/90 truncate">{original.name}</div>
                      <div className="text-[10px] text-white/35">{original.folder} · Original</div>
                    </div>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md bg-[#30D158]/15 text-[#30D158] flex-shrink-0">Keep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-[#FF453A] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] text-white/60 truncate">{dup.name}</div>
                      <div className="text-[10px] text-white/35">{dup.folder} · Duplicate</div>
                    </div>
                    <button
                      onClick={() => setDeleted(d => [...d, dup.id])}
                      className="ml-auto flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg bg-[#FF453A]/20 hover:bg-[#FF453A]/35 text-[#FF453A] transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {duplicatePairs.length > 0 && (
            <button
              onClick={() => setDeleted(duplicatePairs.map(p => p.dup.id))}
              className="w-full py-2.5 rounded-xl bg-[#FF453A]/15 hover:bg-[#FF453A]/25 border border-[#FF453A]/25 text-[12px] text-[#FF453A] font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove All Duplicates — Save {formatBytes(totalSavings)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface PreviewPanelProps {
  file: FileItem;
  onClose: () => void;
  organized: boolean;
}

function PreviewPanel({ file, onClose, organized }: PreviewPanelProps) {
  const isImage = ["jpg", "png", "gif", "webp"].includes(file.ext);
  const isPdf = file.ext === "pdf";
  const isVideo = ["mp4", "mov", "avi"].includes(file.ext);

  const previewColors = ["#0A84FF", "#BF5AF2", "#30D158", "#FF9F0A", "#FF453A", "#64D2FF"];
  const bgColor = CATEGORY_COLORS[file.aiCategory] || "#0A84FF";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="w-64 flex-shrink-0 border-l border-white/[0.06] bg-[#232325] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">File Info</span>
        <button onClick={onClose} className="w-5 h-5 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors">
          <X className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>

      {/* Preview area */}
      <div className="mx-4 mt-4 rounded-xl aspect-square flex items-center justify-center overflow-hidden" style={{ background: `${bgColor}15` }}>
        <div className="text-center">
          <div className="text-6xl mb-2">{file.emoji}</div>
          {isImage && (
            <div className="absolute inset-0 flex items-end justify-end p-2">
              <ZoomIn className="w-4 h-4 text-white/30" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-auto space-y-4">
        {/* File name */}
        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Filename</div>
          <div className="text-[12px] text-white/85 font-medium break-all leading-snug">{file.name}</div>
        </div>

        {/* Rename suggestion */}
        {file.renameSuggestion && organized && (
          <div className="p-3 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3 h-3 text-[#0A84FF]" />
              <span className="text-[10px] text-[#0A84FF] font-semibold">Smart Rename</span>
            </div>
            <div className="text-[11px] text-white/70 break-all">{file.renameSuggestion}</div>
            <button className="mt-2 text-[10px] text-[#0A84FF] hover:underline">Apply suggestion →</button>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2.5">
          {[
            { label: "Size", value: file.size, icon: HardDrive },
            { label: "Modified", value: file.modified, icon: Clock },
            { label: "Location", value: file.folder, icon: FolderOpen },
            { label: "Type", value: file.ext.toUpperCase(), icon: File },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="w-3 h-3 text-white/25 flex-shrink-0" />
              <span className="text-[10px] text-white/30 w-14 flex-shrink-0">{label}</span>
              <span className="text-[11px] text-white/70">{value}</span>
            </div>
          ))}
        </div>

        {/* AI Category */}
        {organized && (
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">AI Category</div>
            <CategoryBadge cat={file.aiCategory} />
          </div>
        )}

        {/* AI Tags */}
        {organized && file.aiTags.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider">AI Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {file.aiTags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-white/50">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Duplicate warning */}
        {file.isDuplicate && organized && (
          <div className="p-3 rounded-lg bg-[#FF453A]/10 border border-[#FF453A]/20">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3 h-3 text-[#FF453A]" />
              <span className="text-[10px] text-[#FF453A] font-semibold">Duplicate File</span>
            </div>
            <div className="text-[10px] text-white/45">This file is identical to another in your library.</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 space-y-2">
        <button className="w-full py-2 rounded-lg bg-[#0A84FF]/20 hover:bg-[#0A84FF]/30 text-[11px] text-[#0A84FF] font-medium transition-colors flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          Quick Look
        </button>
        <button className="w-full py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-[11px] text-white/60 transition-colors flex items-center justify-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Open in Finder
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main App Window ──────────────────────────────────────────────────────────

function AppWindow() {
  const [activeView, setActiveView] = useState<AppView>("grid");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedFolder, setSelectedFolder] = useState("All Files");
  const [organized, setOrganized] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAutoOrganize = () => {
    setIsOrganizing(true);
    setActiveView("organize");
    setSelectedFile(null);
  };

  const handleOrganizeComplete = () => {
    setIsOrganizing(false);
    setOrganized(true);
    setActiveView("grid");
    showNotification("✨ 18 files organized into 5 categories · 4.2 GB space saved");
  };

  const handleDuplicates = () => {
    setActiveView("duplicates");
    setSelectedFile(null);
  };

  const filteredFiles = FILES.filter(f => {
    if (selectedFolder === "All Files") return true;
    if (selectedFolder === "Finance") return f.aiCategory === "Finance";
    if (selectedFolder === "Work Projects") return f.aiCategory === "Work";
    if (selectedFolder === "Personal") return f.aiCategory === "Personal";
    if (selectedFolder === "Media") return f.aiCategory === "Media";
    return f.folder === selectedFolder;
  });

  const mainViewFiles = viewMode === "list"
    ? [...filteredFiles].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "size") return b.sizeBytes - a.sizeBytes;
        return 0;
      })
    : filteredFiles;

  return (
    <div
      className={`flex flex-col bg-[#1C1C1E] text-white overflow-hidden transition-all duration-300 ${
        maximized ? "fixed inset-0 z-50 rounded-none" : "rounded-xl border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
      }`}
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      {/* ── Title Bar ── */}
      <div className="h-10 bg-[#2C2C2E] flex items-center px-4 gap-3 flex-shrink-0 border-b border-white/[0.06] select-none">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button className="group w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center transition-colors">
            <X className="w-2 h-2 opacity-0 group-hover:opacity-100 text-[#8B0000]" />
          </button>
          <button className="group w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 flex items-center justify-center transition-colors">
            <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 text-[#6B4200]" />
          </button>
          <button onClick={() => setMaximized(m => !m)} className="group w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center transition-colors">
            <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 text-[#0B4D10]" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center gap-2">
          <FolderSearch className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[12px] text-white/50">FileFlow — {selectedFolder} ({filteredFiles.length})</span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="w-6 h-6 rounded-md hover:bg-white/[0.06] flex items-center justify-center transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5 text-white/35" />
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="h-12 bg-[#252527] flex items-center gap-2 px-4 border-b border-white/[0.05] flex-shrink-0">
        {/* Search */}
        <div className="flex-1 max-w-xs h-7 bg-white/[0.07] rounded-lg flex items-center px-3 gap-2 hover:bg-white/[0.09] transition-colors focus-within:ring-1 ring-[#0A84FF]/40">
          <Search className="w-3 h-3 text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-[12px] text-white/80 placeholder:text-white/25 outline-none w-full"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-white/[0.06] rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`w-7 h-6 rounded-md flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-white/15 text-white" : "text-white/35 hover:text-white/60"}`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`w-7 h-6 rounded-md flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-white/15 text-white" : "text-white/35 hover:text-white/60"}`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(s => !s)}
            className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.09] text-[11px] text-white/50 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            Sort
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className="absolute top-9 left-0 z-20 w-36 bg-[#3A3A3C] rounded-xl border border-white/10 py-1 shadow-xl"
              >
                {["date", "name", "size", "type"].map(s => (
                  <button
                    key={s}
                    onClick={() => { setSortBy(s); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-[12px] hover:bg-white/[0.06] transition-colors capitalize flex items-center gap-2 ${sortBy === s ? "text-[#0A84FF]" : "text-white/70"}`}
                  >
                    {sortBy === s && <Check className="w-3 h-3" />}
                    <span className={sortBy === s ? "ml-0" : "ml-5"}>{s === "date" ? "Date Modified" : s === "size" ? "File Size" : s.charAt(0).toUpperCase() + s.slice(1)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Duplicate detector */}
        <button
          onClick={handleDuplicates}
          className={`flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-medium transition-all ${activeView === "duplicates" ? "bg-[#FF453A]/25 text-[#FF453A]" : "bg-white/[0.06] hover:bg-white/[0.09] text-white/50"}`}
        >
          <Copy className="w-3 h-3" />
          Duplicates
          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#FF453A]/20 text-[#FF453A]">3</span>
        </button>

        <div className="h-5 w-px bg-white/[0.08] mx-1" />

        {/* Auto-Organize CTA */}
        <button
          onClick={handleAutoOrganize}
          disabled={isOrganizing}
          className={`flex items-center gap-2 h-8 px-4 rounded-lg text-[12px] font-semibold transition-all ${
            organized
              ? "bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30"
              : isOrganizing
              ? "bg-[#0A84FF]/40 text-white/60 cursor-not-allowed"
              : "bg-[#0A84FF] hover:bg-[#0A84FF]/85 text-white shadow-[0_0_16px_rgba(10,132,255,0.35)]"
          }`}
        >
          {organized ? (
            <><CheckCircle2 className="w-3.5 h-3.5" /> Organized</>
          ) : isOrganizing ? (
            <><div className="w-3.5 h-3.5 border border-white/30 border-t-white/80 rounded-full animate-spin" /> Organizing...</>
          ) : (
            <><Zap className="w-3.5 h-3.5" /> Auto-Organize</>
          )}
        </button>
      </div>

      {/* ── Content Area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="flex-shrink-0 bg-[#252527] border-r border-white/[0.05] flex flex-col overflow-hidden"
            >
              <div className="p-3 flex flex-col gap-0.5 flex-1 overflow-auto">
                <div className="text-[9px] text-white/25 uppercase tracking-widest px-2 py-1.5 font-semibold">Folders</div>
                {FOLDERS.map(folder => (
                  <button
                    key={folder.name}
                    onClick={() => {
                      setSelectedFolder(folder.name);
                      if (activeView !== "organize") setActiveView("grid");
                    }}
                    className={`flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-[12px] transition-colors ${
                      selectedFolder === folder.name && activeView !== "organize" && activeView !== "duplicates"
                        ? "bg-[#0A84FF]/20 text-[#64BAFF]"
                        : "text-white/55 hover:text-white/80 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-base leading-none w-4 text-center">{folder.icon}</span>
                    <span className="flex-1 truncate">{folder.name}</span>
                    <span className="text-[9px] text-white/20">{folder.count}</span>
                  </button>
                ))}

                <div className="text-[9px] text-white/25 uppercase tracking-widest px-2 py-1.5 font-semibold mt-3">Tools</div>
                <button
                  onClick={handleDuplicates}
                  className={`flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-[12px] transition-colors ${activeView === "duplicates" ? "bg-[#FF453A]/15 text-[#FF453A]" : "text-white/55 hover:text-white/80 hover:bg-white/[0.04]"}`}
                >
                  <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">Duplicate Finder</span>
                  <span className="text-[9px] bg-[#FF453A]/20 text-[#FF453A] px-1.5 py-0.5 rounded-full">3</span>
                </button>
                <button className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-[12px] text-white/55 hover:text-white/80 hover:bg-white/[0.04] transition-colors">
                  <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                  Rules Engine
                </button>
                <button className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-[12px] text-white/55 hover:text-white/80 hover:bg-white/[0.04] transition-colors">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  Scheduled Tasks
                </button>
              </div>

              {/* Storage bar */}
              <div className="p-3 border-t border-white/[0.05]">
                <div className="flex justify-between text-[9px] text-white/30 mb-1.5">
                  <span>Storage</span>
                  <span>186 / 500 GB</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "75%" }}
                    animate={{ width: organized ? "58%" : "75%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0A84FF] to-[#64D2FF]"
                  />
                </div>
                {organized && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-[#30D158] mt-1">
                    ↓ 4.2 GB freed by FileFlow
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === "organize" ? (
              <motion.div key="organize" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <OrganizeView files={FILES} onComplete={handleOrganizeComplete} />
              </motion.div>
            ) : activeView === "duplicates" ? (
              <motion.div key="duplicates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <DuplicatesView files={FILES} />
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <GridView
                    files={mainViewFiles}
                    viewMode={viewMode}
                    selectedFile={selectedFile}
                    onSelectFile={f => setSelectedFile(prev => prev?.id === f.id ? null : f)}
                    organized={organized}
                    searchQuery={searchQuery}
                  />
                </div>
                <AnimatePresence>
                  {selectedFile && (
                    <PreviewPanel
                      key={selectedFile.id}
                      file={selectedFile}
                      onClose={() => setSelectedFile(null)}
                      organized={organized}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className="h-7 bg-[#252527] border-t border-white/[0.05] flex items-center px-4 gap-5 flex-shrink-0">
        {[
          { label: `${filteredFiles.length} files`, color: "#30D158" },
          { label: organized ? "148 GB used (↓4.2 GB)" : "186 GB used", color: "#0A84FF" },
          { label: "3 duplicates found", color: "#FF9F0A" },
          { label: organized ? "Last organized: just now" : "Last scan: 2 min ago", color: "rgba(255,255,255,0.25)" },
        ].map(({ label, color }) => (
          <span key={label} className="text-[10px]" style={{ color }}>{label}</span>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse" />
          <span className="text-[10px] text-white/25">FileFlow v2.4.1</span>
        </div>
      </div>

      {/* ── Notification toast ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl bg-[#3A3A3C] border border-white/10 shadow-xl text-[12px] text-white/90 flex items-center gap-2 whitespace-nowrap z-30"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Demo Page ───────────────────────────────────────────────────────────

export function FileFlowDemo() {
  const [activeScene, setActiveScene] = useState(0);

  const scenes = [
    { label: "Grid View", description: "Browse and manage files" },
    { label: "AI Organize", description: "Watch AI in action" },
    { label: "Duplicate Detector", description: "Find and remove copies" },
    { label: "File Preview", description: "Inspect with AI tags" },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-['Inter',sans-serif]">
      {/* Demo header */}
      <div className="border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/fileflow">
              <button className="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white/70 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Back to FileFlow
              </button>
            </Link>
            <div className="h-4 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#0A84FF] flex items-center justify-center">
                <FolderSearch className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-medium">FileFlow Desktop</span>
              <span className="text-[11px] text-white/30">— Interactive Demo</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/30 hidden sm:block">No download needed · Runs in browser</span>
            <a href="#download">
              <button className="h-7 px-3 bg-[#0A84FF]/15 hover:bg-[#0A84FF]/25 border border-[#0A84FF]/25 rounded-lg text-[11px] text-[#0A84FF] transition-colors flex items-center gap-1.5">
                <Download className="w-3 h-3" />
                Download App
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Scene selector */}
      <div className="border-b border-white/[0.06] bg-[#0F0F11]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-hide">
            {scenes.map((scene, i) => (
              <button
                key={scene.label}
                onClick={() => setActiveScene(i)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-[13px] border-b-2 transition-all ${
                  activeScene === i
                    ? "border-[#0A84FF] text-white"
                    : "border-transparent text-white/40 hover:text-white/65"
                }`}
              >
                <span className="font-medium">{scene.label}</span>
                <span className={`text-[10px] hidden sm:block ${activeScene === i ? "text-white/40" : "text-white/20"}`}>
                  {scene.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* App demo area */}
      <div className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {activeScene === 0 && <GridScene />}
          {activeScene === 1 && <OrganizeScene />}
          {activeScene === 2 && <DuplicatesScene />}
          {activeScene === 3 && <PreviewScene />}
        </div>
      </div>

      {/* Feature legend */}
      <div className="border-t border-white/[0.06] bg-[#0F0F11] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Brain, label: "On-Device AI", desc: "No cloud, no privacy risk", color: "#0A84FF" },
              { icon: Copy, label: "Duplicate Scan", desc: "Content-based matching", color: "#FF453A" },
              { icon: Archive, label: "Compression", desc: "Save space automatically", color: "#BF5AF2" },
              { icon: Shield, label: "Private & Secure", desc: "Files never leave your Mac", color: "#30D158" },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <div className="text-[12px] font-semibold mb-0.5">{label}</div>
                  <div className="text-[11px] text-white/35">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scene Wrappers ───────────────────────────────────────────────────────────

function SceneShell({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div>
      {hint && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20 w-fit"
        >
          <Info className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span className="text-[12px] text-[#0A84FF]/80">{hint}</span>
        </motion.div>
      )}
      <motion.div
        key="scene"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        style={{ height: 580 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function GridScene() {
  return (
    <SceneShell hint="Click any file to see details in the right panel. Use view toggle and search bar.">
      <div className="h-full">
        <AppWindow />
      </div>
    </SceneShell>
  );
}

function OrganizeScene() {
  const [key, setKey] = useState(0);
  return (
    <SceneShell hint='Click "Auto-Organize" button in toolbar to watch AI organize your files in real-time.'>
      <div className="h-full">
        <AppWindow key={key} />
      </div>
      <button
        onClick={() => setKey(k => k + 1)}
        className="mt-3 flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Reset demo
      </button>
    </SceneShell>
  );
}

function DuplicatesScene() {
  const [key, setKey] = useState(0);
  return (
    <SceneShell hint='Click "Duplicates" in toolbar or sidebar to open the duplicate detector panel.'>
      <div className="h-full">
        <AppWindow key={key} />
      </div>
      <button
        onClick={() => setKey(k => k + 1)}
        className="mt-3 flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Reset demo
      </button>
    </SceneShell>
  );
}

function PreviewScene() {
  return (
    <SceneShell hint="Click any file in the grid to open the AI-powered preview panel on the right.">
      <div className="h-full">
        <AppWindow />
      </div>
    </SceneShell>
  );
}
