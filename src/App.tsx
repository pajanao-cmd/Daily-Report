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
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { toPng } from 'html-to-image';
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
  progress?: number;
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
  date: "9 มีนาคม 2569",
  dateEn: "09 MARCH 2026",
  summaryTh: "สรุปการประชุมรายสัปดาห์ NMD ครอบคลุมความคืบหน้าของแผนก Production ในการบริหารจัดการโควตาคอนเทนต์ และแผนก IT ในโครงการ Rebranding, ระบบ AMS, แชมป์กีฬาบาสเกตบอล 3x3 รวมถึงโครงการ Cloud ต่างๆ ที่กำลังดำเนินการ โดยภาพรวมโครงการส่วนใหญ่อยู่ในเกณฑ์ดีและเป็นไปตามแผนงาน",
  projects: [
    {
      title: "Production & Content",
      titleTh: "แผนกโปรดักชั่นและคอนเทนต์",
      descriptionTh: "สรุปโควตาการสนับสนุนคอนเทนต์ 7HD ประจำปี และการจัดการคอนเทนต์นักศึกษาฝึกงาน",
      color: "bg-indigo-600",
      iconName: "Tv",
      progress: 12,
      content: [
        {
          category: "7HD Content Quota (150 EP/Year)",
          items: [
            "เดือนมีนาคม: ใช้ไป 2 EP | 6 Short Clips",
            "รวม ม.ค. - ก.พ.: 18 EP | 52 Short Clips",
            "โควตาคงเหลือ: 132 EP | 48 Short Clips"
          ]
        },
        {
          category: "Internship Content",
          items: [
            "รายการ 'ก็ทายมาดิ' / 'เล่นกับหนูหน่อย'",
            "สถานะ: รอส่งให้พี่เบิ้ลตรวจสอบก่อนลง BUGABOO"
          ]
        }
      ]
    },
    {
      title: "Ch7 Rebranding",
      titleTh: "โครงการปรับโฉม Ch7",
      descriptionTh: "การพัฒนาหน้าเว็บไซต์ใหม่แบ่งเป็น 2 ระยะ (MVP1 & MVP2) ตามแผนงานปี 2569",
      color: "bg-sky-500",
      iconName: "Zap",
      progress: 35,
      content: [
        {
          category: "Timeline & Milestones",
          items: [
            "MVP1: กำหนดการเดือนกรกฎาคม (JULY)",
            "MVP2: กำหนดการเดือนกันยายน (SEPTEMBER)"
          ]
        },
        {
          category: "Current Progress",
          items: [
            "หารือหน้าผู้ประกาศข่าวเรียบร้อยแล้ว (9 มี.ค.)",
            "ทีม Design: ออกแบบหน้า Home / ข่าว / ผู้ประกาศ เพิ่มเติม",
            "ทีม Dev: วางแผนพัฒนาตาม Sprint งาน"
          ]
        }
      ]
    },
    {
      title: "IT Systems & Support",
      titleTh: "ระบบไอทีและซัพพอร์ต",
      descriptionTh: "การดูแลและพัฒนาระบบ AMS, MyCensor, BBMS และ SingleID",
      color: "bg-emerald-500",
      iconName: "ShieldCheck",
      progress: 85,
      content: [
        {
          category: "AMS & Chatbot",
          items: [
            "AMS Dashboard Chatbot: รอคิวนำเสนอกับคุณพัฒน์",
            "AMS Support: Deploy เมื่อ 5 มี.ค. และดูแล User ต่อเนื่อง"
          ]
        },
        {
          category: "MyCensor & Others",
          items: [
            "MyCensor: ซ่อน Checkbox 'เฉพาะช่อง 7HD' ตาม Request",
            "MyCensor: จัดทำสรุปยอดการชำระเงิน",
            "SingleID / BBMS: Support User และ Update Log ตามปกติ"
          ]
        }
      ]
    },
    {
      title: "Basketball 3x3",
      titleTh: "แชมป์กีฬา: บาสเกตบอล 3x3",
      descriptionTh: "ความคืบหน้าการพัฒนาระบบรับสมัครและหน้าประกาศผลการแข่งขัน",
      color: "bg-orange-500",
      iconName: "Trophy",
      progress: 90,
      content: [
        {
          category: "Phase 1: Regulation",
          items: [
            "หน้าระเบียบการ: ระบบพร้อม Go-Live"
          ]
        },
        {
          category: "Phase 1.2: Registration",
          items: [
            "Web: ระบบรับสมัครและชำระเงิน พร้อมส่งทดสอบ (10 มี.ค.)",
            "BOF: เชื่อมต่อระบบชำระเงิน พร้อมส่งทดสอบ (10 มี.ค.)",
            "App: ทดสอบปุ่มสมัครและหน้าประกาศผล (Web view)"
          ]
        }
      ]
    },
    {
      title: "Live Events (PPV)",
      titleTh: "ถ่ายทอดสดและกิจกรรมพิเศษ",
      descriptionTh: "แผนการเตรียมความพร้อมสำหรับการถ่ายทอดสดกีฬาผ่านแพลตฟอร์ม",
      color: "bg-rose-500",
      iconName: "Activity",
      progress: 60,
      content: [
        {
          category: "Basketball 3x3 (Tero)",
          items: [
            "ถ่ายทอดสด: 13 - 15 มี.ค. 69",
            "การเตรียมงาน: ปรับชิ้นงานโปรโมต ส่งงาน 10 มี.ค.",
            "สถานะ: รอรับสัญญาณจากทางช่อง"
          ]
        },
        {
          category: "Badminton",
          items: [
            "ถ่ายทอดสด: 30 - 31 พ.ค. 69"
          ]
        }
      ]
    },
    {
      title: "Cloud & Business",
      titleTh: "โครงการคลาวด์และธุรกิจใหม่",
      descriptionTh: "การขยายฐานลูกค้าและบริการด้าน Cloud Solutions และ AI Chatbot",
      color: "bg-slate-700",
      iconName: "Target",
      progress: 45,
      content: [
        {
          category: "Project Status",
          items: [
            "The Mall: E-Auction เรียบร้อยแล้ว รอประกาศผล",
            "Metro_Magnecomp: เริ่มทำเนื้อหาสำหรับ Workshop",
            "Honda: เริ่มทำ Proposal ส่งลูกค้าในสัปดาห์นี้"
          ]
        },
        {
          category: "Revenue Outlook",
          items: [
            "แนวโน้มเก็บเงินปีนี้: ~3 ล้านบาท",
            "งานใหม่ที่คาดว่าจะเข้า: ~5 ล้านบาท"
          ]
        }
      ]
    }
  ],
  nextSteps: [
    { project: "Basketball 3x3", issue: "Review ระบบ Phase 1.2", next: "นัดประชุมวันพุธนี้เพื่อตรวจสอบความพร้อมก่อน Go-Live", color: "bg-amber-100" },
    { project: "Honda", issue: "AI Chatbot Proposal", next: "ส่ง Proposal ให้ลูกค้าภายในสัปดาห์นี้", color: "bg-sky-100" },
    { project: "Production", issue: "Internship Content", next: "ส่งรายการให้พี่เบิ้ลตรวจสอบก่อนนำขึ้น BUGABOO", color: "bg-indigo-50" }
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
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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
            - progress: Estimated progress percentage (0-100) based on the input.
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
          maxOutputTokens: 16384, // Increase limit for large reports
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
                    progress: { type: Type.NUMBER },
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

      let result;
      try {
        const rawText = response.text || "{}";
        result = JSON.parse(rawText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("The AI response was incomplete or malformed. Please try again with a shorter input or try regenerating.");
      }

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

  const handleExportImage = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    setStatusMessage("Preparing image export...");
    
    try {
      // Small delay to ensure any hover states or animations are settled
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#f8fafc',
        pixelRatio: 2, // High resolution for A4 width
        style: {
          padding: '40px',
          borderRadius: '0px',
          width: '210mm' // Force A4 width during export
        }
      });
      
      const link = document.createElement('a');
      link.download = `Daily-Intelligence-${data.dateEn.replace(/\s/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      
      setStatusMessage("Export successful.");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error("Export failed:", error);
      setStatusMessage("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-2 md:p-6 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[210mm] mx-auto">
        
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
          ref={reportRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 pb-12"
        >
          {/* Editorial Header Section */}
          <header className="p-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                    <Activity className="w-3 h-3" />
                    Status: Operational
                  </div>
                  <div className="px-3 py-1 border border-slate-200 rounded-full text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                    Ref: AIS-{data.dateEn.replace(/\s/g, '-')}
                  </div>
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                    Daily Operations Report
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setShowInput(!showInput)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${showInput ? 'rotate-180' : ''} transition-transform duration-500`} />
                    {showInput ? 'ปิดหน้าต่าง' : 'อัปเดตข้อมูลรายวัน'}
                  </button>
                  <button 
                    onClick={() => {
                      if (!inputText.trim()) {
                        setShowInput(true);
                        setStatusMessage("Please input data first.");
                      } else {
                        generateReport(inputText);
                      }
                    }}
                    disabled={isGenerating}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {isGenerating ? 'Generating...' : 'Generate AI'}
                  </button>
                  <button 
                    onClick={handleExportImage}
                    disabled={isExporting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    {isExporting ? 'Exporting...' : 'Export Image'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-[0.9] uppercase">
                  Daily <br />
                  <span className="text-indigo-600">Intelligence.</span>
                </h1>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                  A comprehensive analysis of current operational metrics, project milestones, and strategic risk assessments for the CH7ON ecosystem.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Reference Date</div>
                <div className="text-3xl font-bold text-slate-900 tracking-tighter tabular-nums">{data.dateEn}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">System Integrity</div>
                  <div className="text-lg font-bold text-emerald-500">98.4</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </header>

          {/* Executive Summary Bento */}
          <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Main Narrative */}
              <div className="lg:col-span-7 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col justify-between group hover:border-indigo-200 transition-all duration-500">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Executive Summary</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {data.summaryTh}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm">
                          U{i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Column */}
              <div className="lg:col-span-5 space-y-4">
                {/* Highlights */}
                <div className="p-6 bg-indigo-600 rounded-[2rem] text-white space-y-4 shadow-xl shadow-indigo-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
                  <h3 className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60 relative z-10">Key Highlights</h3>
                  <ul className="space-y-3 relative z-10">
                    {data.projects.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className="mt-1.5 w-1 h-1 rounded-full bg-indigo-300 group-hover/item:scale-150 transition-transform" />
                        <span className="text-sm font-medium leading-tight">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-400">Risk Assessment</h3>
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="space-y-4">
                    {data.nextSteps.slice(0, 2).map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-rose-500" />
                          <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Critical Path</span>
                        </div>
                        <p className="text-sm font-bold text-rose-900 leading-tight tracking-tight">{item.issue}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-rose-100">
                    <div className="flex items-center justify-between text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1.5">
                      <span>Mitigation Level</span>
                      <span>Moderate</span>
                    </div>
                    <div className="w-full h-1 bg-rose-200 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-rose-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Deep-Dive Section */}
          <div className="p-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-end justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 tracking-tighter uppercase">Project Deep-Dive</h3>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Projects</div>
                  <div className="text-lg font-black">{data.projects.length.toString().padStart(2, '0')}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((project, idx) => (
                <div key={idx} className="group flex flex-col md:flex-row gap-4 p-4 rounded-[1.5rem] bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-700 border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-lg ${project.color} flex items-center justify-center text-white shadow-lg shadow-current/20 shrink-0 group-hover:scale-105 transition-transform duration-700`}>
                    {React.cloneElement(getIcon(project.iconName) as React.ReactElement, { className: 'w-5 h-5' })}
                  </div>
                  <div className="space-y-3 py-0.5 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">{project.title}</div>
                        <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</div>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 tracking-tighter leading-tight">{project.titleTh}</h4>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {project.descriptionTh}
                    </p>

                    <div className="pt-1 space-y-1.5">
                      {project.content.map((cat, cIdx) => (
                        <div key={cIdx} className="space-y-1">
                          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{cat.category}</div>
                          <ul className="space-y-1">
                            {cat.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium leading-relaxed">
                                <div className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${project.color}`} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Next Steps */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 border border-white/5">
            <div className="absolute top-0 right-0 w-[20rem] h-[20rem] bg-indigo-500/10 rounded-full blur-[100px] -mr-24 -mt-24" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tighter uppercase">Strategic Next Steps</h3>
                  <p className="text-sm text-slate-400 font-medium max-w-lg leading-relaxed">Immediate actions required to maintain project velocity and mitigate identified risks.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Total Actions</div>
                    <div className="text-xl font-black">{data.nextSteps.length.toString().padStart(2, '0')}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.nextSteps.map((step, idx) => (
                  <div key={idx} className={`p-6 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.3em]">{step.project}</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      </div>
                      <h4 className="text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">{step.issue}</h4>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">{step.next}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <Flag className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-bold tracking-tighter uppercase">Operational Intelligence Unit</div>
                <div className="text-[8px] text-slate-400 font-black uppercase tracking-[0.4em]">Internal Classification: Level 4</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <div className="text-right">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Last Updated</div>
                <div className="text-base font-black tabular-nums">{data.date} 23:59</div>
              </div>
              <div className="w-px h-10 bg-slate-200 hidden md:block" />
              <div className="text-right">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Authorized By</div>
                <div className="text-base font-black">Executive Board</div>
              </div>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
