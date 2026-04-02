/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Layout, 
  AlertCircle, 
  Users, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Gamepad2, 
  Mail, 
  Settings, 
  Trophy,
  Search,
  ChevronRight,
  Zap,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  PenTool,
  Lock,
  Tv,
  FileText,
  Download,
  Activity,
  Target,
  Flag,
  Upload,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

// --- Types ---

interface ProjectSection {
  title: string;
  titleTh: string;
  color: string;
  iconName: string;
  descriptionTh: string;
  content: {
    category: string;
    items: string[];
  }[];
}

interface NextStep {
  project: string;
  issue: string;
  next: string;
  color: string;
}

interface ReportData {
  date: string;
  dateEn: string;
  summaryTh: string;
  projects: ProjectSection[];
  nextSteps: NextStep[];
}

// --- Icon Mapping ---
const ICON_MAP: Record<string, React.ReactNode> = {
  PenTool: <PenTool className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
  Lock: <Lock className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Tv: <Tv className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  AlertCircle: <AlertCircle className="w-6 h-6" />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6" />,
  Flag: <Flag className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
};

const getIcon = (name: string) => ICON_MAP[name] || <FileText className="w-6 h-6" />;

// --- Initial Data ---

const INITIAL_DATA: ReportData = {
  date: "1 เมษายน 2569",
  dateEn: "1 Apr 2026",
  summaryTh: "สรุปสถานะการดำเนินงานรายวันของโครงการ IT และสื่อสาร โดยเน้นที่การพัฒนา UI ของ CH7ON, การทดสอบระบบ Basketball Phase 2, และการแก้ไขปัญหาทางเทคนิคในระบบ AMS และ ESS เพื่อเตรียมความพร้อมสำหรับการ Deploy ระบบในลำดับถัดไป",
  projects: [
    {
      title: "CH7ON",
      titleTh: "CH7ON: ปรับ UI และรอผลพิจารณาด้านกฎหมาย",
      color: "bg-amber-400",
      iconName: "PenTool",
      descriptionTh: "อยู่ระหว่างปรึกษากฎหมายเรื่องโลโก้ และรอ Feedback สีเพื่อปรับปรุง UX/UI ต่อไป",
      content: [
        {
          category: "Design",
          items: [
            "Logo: Consult กฎหมาย (Seven Network Australia)",
            "UI: Home/ผังรายการ (Desktop) ส่งพิจารณา",
            "UI: เมนูข่าว วาง layout รอ feedback",
            "ปรับ UI ตามโทนสีใหม่ (กระทบ UX/UI)"
          ]
        }
      ]
    },
    {
      title: "Basketball 3x3",
      titleTh: "Basketball Phase 2: อยู่ในขั้นตอนการทดสอบ (QA)",
      color: "bg-emerald-500",
      iconName: "Trophy",
      descriptionTh: "ทดสอบระบบหน้าบ้าน (FE) และหลังบ้าน (BOF) ทั้งบนเว็บและแอปพลิเคชัน",
      content: [
        {
          category: "Phase 2",
          items: [
            "FE: ทดสอบ ทีม/คะแนน/โปรแกรม/รางวัล",
            "FE: ดึงข้อมูล Bugaboo Shop",
            "BOF: ทดสอบ Live Program (Live/Group/HOF)"
          ]
        }
      ]
    },
    {
      title: "Game 9-11",
      titleTh: "Game 9-11: เตรียมพร้อมและผลักดันเข้าสู่ระบบ",
      color: "bg-emerald-400",
      iconName: "Gamepad2",
      descriptionTh: "เตรียมเกม 9-11 และทำการ Push เกม Bug-blast (Game 9) เรียบร้อยแล้ว",
      content: [
        {
          category: "Development",
          items: ["เตรียมเกม 9–11", "Push เกม 9 (bug-blast)"]
        }
      ]
    },
    {
      title: "ESS",
      titleTh: "เร่งแก้ไขปัญหา Login ของระบบ ESS",
      color: "bg-rose-500",
      iconName: "Lock",
      descriptionTh: "พบปัญหา Error 403 ขณะ Login โดยกำลังประสานงานเพื่อใช้ Keycloak Prod ในการแก้ไข",
      content: [
        {
          category: "Auth",
          items: ["Error 403: แก้แล้วแต่ยัง login ไม่ได้", "ต้องใช้ Keycloak Prod"]
        }
      ]
    },
    {
      title: "AMS",
      titleTh: "กำหนดการ Deploy และปรับปรุงระบบสำคัญ",
      color: "bg-blue-500",
      iconName: "Clock",
      descriptionTh: "Deploy AMS V2 (2 เม.ย.) และแผนปรับปรุง SSL ในวันที่ 7-8 เม.ย. นี้",
      content: [
        {
          category: "Operations",
          items: ["Deploy V2: 2 เม.ย.", "SSL Update: 7-8 เม.ย."]
        }
      ]
    },
    {
      title: "TVOD",
      titleTh: "BUGABOO TVOD ผ่านการทดสอบบน Staging",
      color: "bg-amber-500",
      iconName: "Tv",
      descriptionTh: "ทดสอบระบบ Package UI และ Banner ผ่านแล้ว อยู่ระหว่างจัดการประเด็นชื่อ Package บนระบบจริง",
      content: [
        {
          category: "QA",
          items: ["Test package UI / banner (ผ่าน)", "Log issue เปลี่ยนเงื่อนไขเป็นชื่อ package"]
        }
      ]
    }
  ],
  nextSteps: [
    { project: "CH7ON", issue: "ข้อกฎหมายเรื่องโลโก้/สี", next: "รอ Feedback จากทีมกฎหมายเพื่อดำเนินการต่อ", color: "bg-amber-100" },
    { project: "AMS / TVOD", issue: "พบ Issue หลายจุดและเงื่อนไขชื่อ Package", next: "เคลียร์ Issue ทั้งหมดก่อนการ Deploy", color: "bg-amber-50" },
    { project: "ESS", issue: "ระบบยังติดปัญหา Login (403)", next: "ประสานทีม Dev เพื่อเชื่อมต่อ Keycloak Prod", color: "bg-rose-100" }
  ]
};

// --- Data ---
// (Keeping CHART_DATA and PIE_DATA as they are mostly for visual flair)
const CHART_DATA = [
  { name: 'CH7ON', progress: 75, color: '#3b82f6' },
  { name: 'Basketball', progress: 85, color: '#f97316' },
  { name: 'AMS', progress: 60, color: '#10b981' },
  { name: 'TVOD', progress: 90, color: '#f43f5e' },
  { name: 'ESS', progress: 40, color: '#8b5cf6' },
  { name: 'Game', progress: 50, color: '#475569' },
];

const PIE_DATA = [
  { name: 'Operational', value: 4, color: '#10b981' },
  { name: 'In Progress', value: 3, color: '#3b82f6' },
  { name: 'Issues', value: 2, color: '#f43f5e' },
];

// --- Components ---

const Card: React.FC<{ className?: string }> = ({ children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ title, icon, color }: { title: string; icon: React.ReactNode; color: string }) => (
  <div className={`flex items-center gap-3 p-4 text-white ${color}`}>
    {icon}
    <h2 className="font-bold tracking-tight">{title}</h2>
  </div>
);

const CategoryBlock: React.FC<{ category: string; items: string[] }> = ({ category, items }) => (
  <div className="p-4 border-b border-slate-50 last:border-0">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
      <ChevronRight className="w-3 h-3" />
      {category}
    </h3>
    <ul className="space-y-1.5">
      {items.map((item, idx) => (
        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (text) {
        await generateReport(text);
      }
    };
    reader.readAsText(file);
  };

  const generateReport = async (text: string) => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setStatusMessage("Analyzing data...");
    try {
      // Use process.env.GEMINI_API_KEY as per instructions
      const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key not found. Please ensure it is configured in the environment.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following daily operational data and generate a comprehensive, detailed report in JSON format. 
        The report should be exhaustive, capturing all key metrics, project updates, and strategic risks from the input.
        
        The JSON structure must include:
        - date: Thai date string (e.g., 2 เมษายน 2569)
        - dateEn: English date string (e.g., 02 APRIL 2026)
        - summaryTh: A detailed executive summary in Thai (at least 3-5 sentences) covering the overall operational status and key achievements.
        - projects: Array of projects. Each project must have:
            - title: Project name in English
            - titleTh: Project name in Thai
            - descriptionTh: A detailed description of the project status in Thai.
            - color: Tailwind background color class (e.g., bg-indigo-600, bg-emerald-500, bg-amber-500, bg-rose-500, bg-sky-500).
            - iconName: One of: PenTool, Trophy, Gamepad2, Lock, Clock, Tv, Activity, Target, ShieldCheck, Zap, AlertCircle, CheckCircle2, Flag, FileText.
            - content: Array of categories (e.g., "Achievements", "Milestones", "Technical Updates") with a detailed list of items for each.
        - nextSteps: Array of next steps. Each step must have:
            - project: Project name
            - issue: Detailed description of the issue or task
            - next: Immediate action required
            - color: Tailwind background color class.

        Input Data:
        ${text}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              dateEn: { type: Type.STRING },
              summaryTh: { type: Type.STRING },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    titleTh: { type: Type.STRING },
                    descriptionTh: { type: Type.STRING },
                    color: { type: Type.STRING },
                    iconName: { type: Type.STRING },
                    content: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          category: { type: Type.STRING },
                          items: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    }
                  }
                }
              },
              nextSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    project: { type: Type.STRING },
                    issue: { type: Type.STRING },
                    next: { type: Type.STRING },
                    color: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      if (result.projects && result.summaryTh) {
        setData(result);
        setStatusMessage(null);
        setShowInput(false); // Close console on success
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setStatusMessage(error instanceof Error ? error.message : "Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-12 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".txt,.md,.json"
        />

        {/* Input Console */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="p-8 bg-white rounded-[3rem] border-2 border-slate-900 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Data Input Console</h3>
                  </div>
                  <button 
                    onClick={() => setShowInput(false)}
                    className="text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <AlertCircle className="w-6 h-6 rotate-45" />
                  </button>
                </div>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your daily operational notes, logs, or updates here..."
                  className="w-full h-48 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium leading-relaxed resize-none"
                />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 text-slate-400">
                      <Info className="w-5 h-5" />
                      <p className="text-xs font-bold uppercase tracking-widest leading-none">AI will analyze and format your input into the report structure below.</p>
                    </div>
                    {statusMessage && (
                      <p className={`text-xs font-bold uppercase tracking-widest ${statusMessage.includes('Failed') || statusMessage.includes('not found') ? 'text-rose-500' : 'text-indigo-500'}`}>
                        {statusMessage}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => {
                        setInputText("");
                        setStatusMessage(null);
                      }}
                      className="px-6 py-4 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 md:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-200 transition-all"
                    >
                      Upload File
                    </button>
                    <button 
                      onClick={() => generateReport(inputText)}
                      disabled={isGenerating || !inputText.trim()}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isGenerating ? 'Processing...' : 'Generate Report'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Report Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-20 pb-32"
        >
          {/* Editorial Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b-2 border-slate-900 pb-16">
            <div className="space-y-8 max-w-3xl">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                  <Activity className="w-3 h-3" />
                  Status: Operational
                </div>
                <div className="px-4 py-1.5 border border-slate-200 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  Ref: AIS-{data.dateEn.replace(/\s/g, '-')}
                </div>
                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                  Daily Operations Report
                </div>
                <button 
                  onClick={() => setShowInput(!showInput)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-colors"
                >
                  <PenTool className="w-3 h-3" />
                  {showInput ? 'Close Console' : 'Input Data'}
                </button>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.8] uppercase">
                  Daily <br />
                  <span className="text-indigo-600">Intelligence.</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                  A comprehensive analysis of current operational metrics, project milestones, and strategic risk assessments for the CH7ON ecosystem.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-6">
              <div className="text-right">
                <div className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Reference Date</div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{data.dateEn}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Integrity</div>
                  <div className="text-xl font-black text-emerald-500">98.4%</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          </header>

          {/* Executive Summary Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Narrative */}
            <div className="lg:col-span-7 p-12 bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/40 flex flex-col justify-between group hover:border-indigo-200 transition-all duration-500">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Section 01</div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Executive Summary</h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  {data.summaryTh}
                </p>
              </div>
              <div className="mt-16 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reviewed by Operations Lead</div>
                </div>
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Column */}
            <div className="lg:col-span-5 space-y-8">
              {/* Highlights */}
              <div className="p-12 bg-indigo-600 rounded-[4rem] text-white space-y-8 shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-colors" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-60 relative z-10">Key Highlights</h3>
                <ul className="space-y-6 relative z-10">
                  {data.projects.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-5 group/item">
                      <div className="mt-2 w-2 h-2 rounded-full bg-indigo-300 group-hover/item:scale-150 transition-transform" />
                      <span className="text-lg font-bold leading-tight">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="p-12 bg-rose-50 rounded-[4rem] border border-rose-100 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-rose-400">Risk Assessment</h3>
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                </div>
                <div className="space-y-8">
                  {data.nextSteps.slice(0, 2).map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Critical Path</span>
                      </div>
                      <p className="text-lg font-black text-rose-900 leading-none tracking-tight">{item.issue}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-rose-100">
                  <div className="flex items-center justify-between text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3">
                    <span>Mitigation Level</span>
                    <span>Moderate</span>
                  </div>
                  <div className="w-full h-2 bg-rose-200 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-rose-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Deep-Dive Section */}
          <div className="space-y-16">
            <div className="flex items-end justify-between border-b-2 border-slate-900 pb-8">
              <div className="space-y-4">
                <div className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em]">Section 02</div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Project Deep-Dive</h3>
              </div>
              <div className="flex gap-12">
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Projects</div>
                  <div className="text-2xl font-black">{data.projects.length.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Velocity</div>
                  <div className="text-2xl font-black text-indigo-600">68%</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {data.projects.map((project, idx) => (
                <div key={idx} className="group flex flex-col md:flex-row gap-8 p-8 rounded-[3rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 border border-transparent hover:border-slate-100">
                  <div className={`w-16 h-16 rounded-2xl ${project.color} flex items-center justify-center text-white shadow-xl shadow-current/20 shrink-0 group-hover:scale-105 transition-transform duration-700`}>
                    {React.cloneElement(getIcon(project.iconName) as React.ReactElement, { className: 'w-8 h-8' })}
                  </div>
                  <div className="space-y-6 py-1 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{project.title}</div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</div>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{project.titleTh}</h4>
                    </div>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                      {project.descriptionTh}
                    </p>
                    <div className="pt-4 flex flex-wrap gap-3">
                      {project.content[0].items.map((item, i) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-tighter group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Next Steps */}
          <div className="bg-slate-900 rounded-[5rem] p-16 md:p-24 text-white relative overflow-hidden shadow-3xl shadow-indigo-900/20">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[150px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -ml-48 -mb-48" />
            
            <div className="relative z-10 space-y-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/10 pb-12">
                <div className="space-y-6">
                  <div className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.5em]">Section 03</div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase">Strategic Next Steps</h3>
                  <p className="text-lg text-slate-400 font-medium max-w-xl">Immediate actions required to maintain project velocity and mitigate identified risks.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Actions</div>
                    <div className="text-3xl font-black">{data.nextSteps.length.toString().padStart(2, '0')}</div>
                  </div>
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <ArrowRight className="w-10 h-10 text-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {data.nextSteps.map((step, idx) => (
                  <div key={idx} className={`p-10 rounded-[3.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group`}>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{step.project}</div>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      </div>
                      <h4 className="text-xl font-black tracking-tight group-hover:text-indigo-400 transition-colors leading-none">{step.issue}</h4>
                      <p className="text-lg text-slate-400 font-medium leading-relaxed">{step.next}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="pt-20 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <Flag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-black tracking-tighter uppercase">Operational Intelligence Unit</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Internal Classification: Level 4</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-12">
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Updated</div>
                <div className="text-lg font-black tabular-nums">{data.date} 23:59</div>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden md:block" />
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorized By</div>
                <div className="text-lg font-black">Executive Board</div>
              </div>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
