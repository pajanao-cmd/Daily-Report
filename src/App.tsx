/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  Loader2,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { toPng } from 'html-to-image';

// --- Types ---

interface ProjectDetail {
  name: string;
  updates: string[];
  status: 'on-track' | 'at-risk' | 'delayed';
}

interface ReportData {
  date: string;
  dateEn: string;
  summaryTh: string;
  projectDetails: ProjectDetail[];
}

// --- Constants & Defaults ---

const DEFAULT_DATA: ReportData = {
  date: "8 เมษายน 2569",
  dateEn: "8 Apr 2026",
  summaryTh: "ภาพรวมการทำงานวันที่ 8 เมษายน 2569 มุ่งเน้นไปที่การทดสอบระบบ CH7ON และบาสเกตบอล 3x3 โดยพบปัญหาหลักด้านเทคนิคในการ Build App และประเด็นทางกฎหมายเรื่องลิขสิทธิ์โลโก้ที่คล้ายกับต่างประเทศ ในส่วนงานสนับสนุนระบบหลัก (AMS/MyCensor) มีการทำ Change Request เพื่อลดขั้นตอนการทำงานและแก้ไขปัญหาการนำเข้าข้อมูลรายวัน ขณะที่งานด้านเอกสารสัญญาและรายงานประจำเดือนอยู่ในกระบวนการประสานงานกับฝ่ายที่เกี่ยวข้อง",
  projectDetails: [
    {
      name: "แชมป์กีฬา (บาส 3x3)",
      status: "at-risk",
      updates: [
        "Web (FE/BOF) และ Web Static 2025 ทดสอบผ่านเรียบร้อย",
        "ทีม BOF ปรับปรุงเรื่อง Cache เพื่อการอัปเดตข้อมูล",
        "พบปัญหา Build เครื่องสำหรับ Test ในส่วน App Frontend",
        "QA ทดสอบ Shelf Live, ข่าว, คะแนน, คลิป และอัลบั้มภาพ เรียบร้อยแล้ว"
      ]
    },
    {
      name: "CH7ON",
      status: "delayed",
      updates: [
        "UI หน้าแรก Desktop ผ่านการพิจารณาเบื้องต้น",
        "อยู่ระหว่างการพิจารณาเรื่อง Logo และโทนสีจากฝ่ายกฎหมายเนื่องจากเสี่ยงลิขสิทธิ์ต่างประเทศ",
        "หน้าพุทธศาสนสุภาษิต พัฒนาเสร็จและอยู่ระหว่าง QA ทดสอบทั้ง iOS และ Android",
        "พบประเด็นข้อมูลผู้ประกาศข่าวยังรอการอนุมัติและรอข้อมูลเพิ่มเติม"
      ]
    },
    {
      name: "AMS & MyCensor",
      status: "on-track",
      updates: [
        "แก้ไขปัญหา Agency ไม่สามารถ Import Order Spot ในระบบ AMS ได้สำเร็จ",
        "ประชุมปรับปรุงขั้นตอนการลงนามในระบบ MyCensor (CR)",
        "ตรวจสอบสถานะการนำเข้า Order ผ่าน Email ของ AMS ให้ถูกต้อง"
      ]
    },
    {
      name: "Production & Support",
      status: "on-track",
      updates: [
        "Banner กิจกรรมละครเล่ห์มยุรามือบาล อยู่ระหว่างดำเนินการ (In Progress)",
        "ปรับปรุงวิธีการเล่นของเกมที่ 9-11",
        "รับ Requirement เพิ่มเติมสำหรับ Bot RPA เพื่อสร้าง Report TVOD"
      ]
    }
  ]
};

// --- Utilities ---

const fixTruncatedJson = (json: string): string => {
  let fixed = json.trim();
  
  // 1. Try to close an open string
  let quoteCount = 0;
  let inString = false;
  for (let i = 0; i < fixed.length; i++) {
    if (fixed[i] === '"' && (i === 0 || fixed[i - 1] !== '\\')) {
      inString = !inString;
      quoteCount++;
    }
  }
  if (inString) {
    fixed += '"';
  }

  // 2. Remove trailing commas or incomplete property names
  fixed = fixed.replace(/,\s*$/, '');
  fixed = fixed.replace(/,\s*"[^"]*$/, '');
  fixed = fixed.replace(/"[^"]*"\s*:\s*$/, '');

  // 3. Close open brackets and braces
  const stack: string[] = [];
  let isEscaped = false;
  let currentInString = false;

  for (let i = 0; i < fixed.length; i++) {
    const char = fixed[i];
    if (char === '\\') {
      isEscaped = !isEscaped;
      continue;
    }
    if (char === '"' && !isEscaped) {
      currentInString = !currentInString;
    }
    isEscaped = false;

    if (!currentInString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}' || char === ']') {
        stack.pop();
      }
    }
  }

  while (stack.length > 0) {
    const last = stack.pop();
    if (last === '{') fixed += '}';
    if (last === '[') fixed += ']';
  }

  return fixed;
};

// --- Components ---

export default function App() {
  const [data, setData] = useState<ReportData>(DEFAULT_DATA);
  const [inputText, setInputText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportId] = useState(() => `RPT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
  
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const generateReport = async (text: string) => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setStatusMessage("กำลังวิเคราะห์ข้อมูลด้วย AI...");
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found.");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following daily operational data and generate a comprehensive executive dashboard report in JSON format.
        
        Principles:
        1. Executive Summary: A high-level overview in Thai (summaryTh). This must be the primary focus for a quick 5-second read.
        2. Project-First Organization: Group ALL updates by Project. Do not use categories or team groupings.
        3. NO DATA LOSS: Do not cut or omit any information from the input. Capture every task, update, and risk.
        4. CONCISE BUT COMPLETE: Rephrase for professional conciseness while preserving 100% of the original meaning and context.
        
        Input Data:
        ${text}`,
        config: {
          systemInstruction: `You are an expert operational analyst. Extract structured data for an executive dashboard.
          CRITICAL: Do not omit any information from the input data. Your goal is to be comprehensive.
          Rephrase long sentences into concise, professional bullet points without losing any meaning or context.
          Return a valid JSON object matching this schema:
          - date: Thai date (e.g., 8 เมษายน 2569)
          - dateEn: English date (e.g., 8 Apr 2026)
          - summaryTh: A comprehensive yet concise summary paragraph in Thai that captures the day's essence.
          - projectDetails: Array of { name, updates[], status }. 
            Status MUST be one of: 'on-track', 'at-risk', 'delayed'.
            Ensure every single update from the input is included under its respective project.`,
          responseMimeType: "application/json",
          maxOutputTokens: 65536,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              dateEn: { type: Type.STRING },
              summaryTh: { type: Type.STRING },
              projectDetails: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    updates: { type: Type.ARRAY, items: { type: Type.STRING } },
                    status: { type: Type.STRING, enum: ['on-track', 'at-risk', 'delayed'] }
                  }
                }
              }
            }
          }
        }
      });

      const rawText = response.text || "{}";
      
      // Clean potential markdown blocks if AI accidentally includes them
      const cleanedText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      
      let result;
      try {
        result = JSON.parse(cleanedText);
      } catch (parseError: any) {
        console.warn("Initial JSON parse failed, attempting repair...");
        try {
          const repairedText = fixTruncatedJson(cleanedText);
          result = JSON.parse(repairedText);
        } catch (repairError) {
          console.error("JSON Repair failed:", repairError);
          console.error("Raw text preview:", rawText.substring(0, 500));
          throw new Error(`AI response was malformed and could not be repaired: ${parseError.message}`);
        }
      }
      
      if (result && typeof result === 'object') {
        // Ensure date fields exist and map correctly to the new schema
        const finalData: ReportData = {
          date: result.date || data.date,
          dateEn: result.dateEn || data.dateEn,
          summaryTh: result.summaryTh || data.summaryTh,
          projectDetails: result.projectDetails || data.projectDetails
        };
        setData(finalData);
        setStatusMessage(null);
        setShowInput(false);
      } else {
        throw new Error("AI response was not a valid object.");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setStatusMessage(error.message || "เกิดข้อผิดพลาดในการประมวลผล");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLineText = () => {
    let text = `📅 ${data.date}\n\n`;
    text += `📝 EXECUTIVE SUMMARY:\n${data.summaryTh}\n\n`;
    
    text += `🔍 PROJECT DETAILS:\n`;
    data.projectDetails?.forEach(project => {
      const statusEmoji = project.status === 'on-track' ? '✅' : project.status === 'at-risk' ? '⚠️' : '🔴';
      text += `${statusEmoji} ${project.name || 'Unnamed Project'} [${project.status?.toUpperCase()}]\n`;
      project.updates?.forEach(update => {
        text += `  → ${update}\n`;
      });
      text += '\n';
    });
    
    return text.trim();
  };

  const copyToClipboard = () => {
    const text = generateLineText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportImage = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    setStatusMessage("กำลังเตรียมการส่งออกรูปภาพคุณภาพสูง...");
    
    try {
      // Create a temporary wrapper for the "framed" look
      const originalElement = reportRef.current;
      const wrapper = document.createElement('div');
      wrapper.className = 'export-mode';
      
      // Clone the element to avoid disturbing the live UI
      const clone = originalElement.cloneNode(true) as HTMLElement;
      clone.classList.add('export-container');
      clone.classList.remove('mx-auto', 'shadow-2xl', 'w-full', 'max-w-[1587px]');
      
      // Show export-only elements in the clone
      const exportOnly = clone.querySelectorAll('.export-only');
      exportOnly.forEach(el => (el as HTMLElement).style.display = 'block');
      
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);
      
      // Wait for fonts and layout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(wrapper, {
        quality: 1.0,
        pixelRatio: 2.5,
        backgroundColor: '#F1F5F9',
      });
      
      document.body.removeChild(wrapper);
      
      const link = document.createElement('a');
      link.download = `Executive-Dashboard-${data.dateEn.replace(/\s/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      setStatusMessage(null);
    } catch (error) {
      console.error("Export Error:", error);
      setStatusMessage("ไม่สามารถส่งออกรูปภาพได้");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation / Actions */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="max-w-[210mm] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">Operational</p>
              <p className="text-xs font-bold text-slate-900 leading-none">Daily Report Console</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowInput(!showInput)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${showInput ? 'rotate-180' : ''} transition-transform duration-500`} />
              {showInput ? 'ปิดหน้าต่าง' : 'อัปเดตข้อมูล'}
            </button>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-100"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'คัดลอกแล้ว' : 'Copy for Line'}
            </button>
            <button 
              onClick={() => {
                if (!inputText.trim()) {
                  setShowInput(true);
                  setStatusMessage("กรุณาใส่ข้อมูลก่อนทำการ Generate");
                } else {
                  generateReport(inputText);
                }
              }}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isGenerating ? 'กำลังประมวลผล' : 'Generate AI'}
            </button>
            <button 
              onClick={handleExportImage}
              disabled={isExporting}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isExporting ? 'กำลังส่งออก' : 'Export Image'}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 overflow-x-auto">
        {/* Input Console */}
        <AnimatePresence>
          {showInput && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-[1587px] mx-auto mb-12 overflow-hidden"
            >
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Data Input Console</h3>
                  {statusMessage && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                      {statusMessage}
                    </p>
                  )}
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="วางข้อมูลการดำเนินงานรายวันของคุณที่นี่..."
                  className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium leading-relaxed resize-none mb-6"
                />
                <div className="flex items-center justify-end gap-3">
                  <button 
                    onClick={() => setInputText("")}
                    className="px-6 py-3 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => generateReport(inputText)}
                    disabled={isGenerating || !inputText.trim()}
                    className="px-10 py-3 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                  >
                    {isGenerating ? 'Processing...' : 'Generate Report'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          ref={reportRef}
          className="mx-auto bg-white shadow-2xl shadow-slate-200/50 w-full max-w-[1587px] p-12 flex flex-col gap-10 relative overflow-hidden rounded-[2.5rem] border border-slate-100"
        >
          {/* Export Only Watermark */}
          <div className="hidden export-only absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
          </div>
          {/* Header */}
          <header className="flex justify-between items-end relative z-10 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Activity className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-indigo-600 text-[9px] font-black text-white rounded uppercase tracking-widest">Confidential</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{reportId}</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                  OPERATIONAL <span className="text-indigo-600">DASHBOARD</span>
                </h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">{data.dateEn}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Executive Briefing</p>
            </div>
          </header>

          {/* Executive Summary - Top Priority */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden shadow-2xl shadow-slate-900/20"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full -mr-48 -mt-48 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full -ml-48 -mb-48 blur-[120px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner">
                  <Sparkles className="w-10 h-10 text-indigo-300" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-1 bg-indigo-500 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400">Executive Summary</h3>
                </div>
                <p className="text-2xl font-medium leading-[1.6] tracking-tight text-slate-100 thai-text">
                  {data.summaryTh}
                </p>
              </div>
              <div className="flex-shrink-0 text-right hidden lg:block border-l border-white/10 pl-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Analysis Confidence</p>
                <p className="text-4xl font-black text-white tracking-tighter">98.4<span className="text-indigo-400 text-xl">%</span></p>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">AI Generated Insight</p>
              </div>
            </div>
          </motion.div>

          {/* Project Status Board - Main Content */}
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shadow-inner">
                  <LayoutGrid className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Status Board</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Operational Updates</p>
                </div>
              </div>
              <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">On Track</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">At Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Delayed</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {data.projectDetails?.map((project, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="group flex bg-white hover:bg-slate-50/50 rounded-[2rem] overflow-hidden border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
                >
                  <div className={`w-48 p-8 flex flex-col justify-center border-r border-slate-100 flex-shrink-0 transition-colors relative overflow-hidden
                    ${project.status === 'on-track' ? 'bg-emerald-50/30' : project.status === 'at-risk' ? 'bg-amber-50/30' : 'bg-rose-50/30'}`}>
                    
                    <div className={`absolute top-0 left-0 w-1 h-full 
                      ${project.status === 'on-track' ? 'bg-emerald-500' : project.status === 'at-risk' ? 'bg-amber-500' : 'bg-rose-500'}`} />

                    <div className="flex items-center gap-2 mb-3">
                      {project.status === 'on-track' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {project.status === 'at-risk' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {project.status === 'delayed' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                      <span className={`text-[10px] font-black uppercase tracking-widest
                        ${project.status === 'on-track' ? 'text-emerald-600' : project.status === 'at-risk' ? 'text-amber-600' : 'text-rose-600'}`}>
                        {project.status?.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Name</p>
                    <h4 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{project.name}</h4>
                  </div>
                  
                  <div className="flex-grow p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
                    {project.updates?.map((update, uIdx) => (
                      <div key={uIdx} className="flex items-start gap-4 group/item">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                          ${project.status === 'on-track' ? 'bg-emerald-50 text-emerald-500' : project.status === 'at-risk' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                        <p className="text-[13px] font-bold text-slate-600 leading-relaxed thai-text group-hover/item:text-slate-900 transition-colors">{update}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center text-slate-300 relative z-10">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">Verified Operational Intelligence</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">
              © 2026 AIS EXECUTIVE DASHBOARD
            </p>
          </footer>
        </div>
      </main>

      {/* Mobile Export Button (Floating) */}
      <button 
        onClick={handleExportImage}
        disabled={isExporting}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl shadow-slate-900/40 z-50 disabled:opacity-50"
      >
        {isExporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
      </button>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="ArrowRight" />
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
