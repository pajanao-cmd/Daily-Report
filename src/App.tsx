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
  FileText,
  Download,
  Activity,
  Target,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
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
  color: string;
  icon: React.ReactNode;
  content: {
    category: string;
    items: string[];
    subItems?: { label: string; value: string | string[] }[];
  }[];
}

type ViewMode = 'dashboard' | 'infographic' | 'poster';

// --- Data ---

const REPORT_DATE = "1 Apr 2026";

const SUMMARY = {
  projects: [
    "CH7ON: ปรับ UI + Dev ต่อเนื่อง",
    "Basketball Phase 2: อยู่ระหว่างทดสอบ",
    "Game: เดินหน้า 9–11"
  ],
  system: [
    "AMS monitor + มี issue หลายจุด",
    "ESS ยังติด login",
    "TVOD test ทั้ง staging & prod"
  ],
  risks: [
    "รอ Feedback กฎหมาย (Logo/สี)",
    "แก้ login ESS",
    "เคลียร์ issue AMS + TVOD"
  ]
};

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

const PROJECTS: ProjectSection[] = [
  {
    title: "CH7ON",
    color: "bg-blue-500",
    icon: <Layout className="w-5 h-5" />,
    content: [
      {
        category: "Design",
        items: [
          "Logo: Consult กฎหมาย (Seven Network Australia)",
          "UI: Home/ผังรายการ (Desktop) ส่งพิจารณา",
          "UI: เมนูข่าว วาง layout รอ feedback",
          "ปรับ UI ตามโทนสีใหม่ (กระทบ UX/UI)"
        ]
      },
      {
        category: "Development",
        items: [
          "Search: Transfer outsource, รองรับบาลี",
          "พุทธศาสนสุภาษิต: Tablet/Mobile OK, Dark Mode รอสี",
          "ผู้ประกาศข่าว: รอพัฒนาต่อ",
          "Cookie: เตรียม implement",
          "Migrate: Map news เพิ่ม, อาจไป BUGABOO"
        ]
      },
      {
        category: "QA & Meetings",
        items: [
          "Test Case: ผู้ประกาศข่าว / พุทธศาสนสุภาษิต (Done)",
          "Test Case: News / Home / ผังรายการ (Done)",
          "Weekly progress: สรุปส่งแล้ว",
          "Reel/Short Video: นัด 2 เม.ย. 14:00"
        ]
      }
    ]
  },
  {
    title: "Basketball 3x3",
    color: "bg-orange-500",
    icon: <Trophy className="w-5 h-5" />,
    content: [
      {
        category: "Phase 2 - Web",
        items: [
          "FE: ทดสอบ ทีม/คะแนน/โปรแกรม/รางวัล",
          "FE: ดึงข้อมูล Bugaboo Shop",
          "BOF: ทดสอบ Live Program (Live/Group/HOF)"
        ]
      },
      {
        category: "Phase 2 - App",
        items: [
          "Done: ทีม/คะแนน/ข่าว/Header/คลิป",
          "Doing: โปรแกรม/Live/ทำเนียบแชมป์"
        ]
      },
      {
        category: "Testing & Meetings",
        items: [
          "Web Dev: ส่ง issues แล้ว (Live/ข่าว/ทีม)",
          "BOF Prod: ส่ง issues แล้ว (เพิ่ม/แก้ไขข้อมูล)",
          "Meeting: Dev สอน QA ใช้ BOF"
        ]
      }
    ]
  },
  {
    title: "AMS (Asset Management)",
    color: "bg-emerald-500",
    icon: <Monitor className="w-5 h-5" />,
    content: [
      {
        category: "Monitor & Support",
        items: [
          "ตรวจ Importer / Rental / Email log",
          "Issue: เที่ยงบันเทิงสด ข้อมูลผิดวัน",
          "Issue: API Single ID report ไม่แสดงข้อมูล"
        ]
      },
      {
        category: "Test Issues",
        items: [
          "AR-718: เวลาออกอากาศบันทึกเป็นวินาที",
          "AR-723: API report ไม่ขึ้นข้อมูล"
        ]
      },
      {
        category: "Operations",
        items: [
          "Deploy V2: 2 เม.ย. 21:30–22:30",
          "SSL Update: 7 เม.ย. 21:00–22:00"
        ]
      }
    ]
  },
  {
    title: "BUGABOO TVOD",
    color: "bg-rose-500",
    icon: <Smartphone className="w-5 h-5" />,
    content: [
      {
        category: "Staging (v1.127.4)",
        items: ["Test package UI / banner (ผ่าน)"]
      },
      {
        category: "Production (v1.127.0)",
        items: ["Log issue เปลี่ยนเงื่อนไขเป็นชื่อ package"]
      },
      {
        category: "BOF",
        items: ["เพิ่ม preview clip ใน package"]
      }
    ]
  },
  {
    title: "System & Others",
    color: "bg-slate-600",
    icon: <Settings className="w-5 h-5" />,
    content: [
      {
        category: "MyCensor",
        items: ["Deploy v2.8.0", "Standby Support", "สรุปยอดชำระเงิน"]
      },
      {
        category: "SingleID / BBMS",
        items: ["SSL Update: 8 เม.ย.", "Mailgun config: แจ้งผลแล้ว"]
      },
      {
        category: "Game",
        items: ["เตรียมเกม 9–11", "Push เกม 9 (bug-blast)"]
      }
    ]
  },
  {
    title: "ESS (Employee Self Service)",
    color: "bg-violet-500",
    icon: <Users className="w-5 h-5" />,
    content: [
      {
        category: "Email Service",
        items: ["เลิกใช้ Mailgun", "รอ Timeline"]
      },
      {
        category: "Authentication",
        items: [
          "Error 403: แก้แล้วแต่ยัง login ไม่ได้",
          "ต้องใช้ Keycloak Prod (ประสานงาน)"
        ]
      }
    ]
  }
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
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  return (
    <div className={`min-h-screen transition-colors duration-500 ${viewMode === 'dashboard' ? 'bg-slate-50 text-slate-900' : 'bg-slate-900 text-white'} font-sans p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className={`flex items-center gap-2 font-semibold ${viewMode === 'dashboard' ? 'text-blue-600' : 'text-blue-400'}`}>
              <Calendar className="w-5 h-5" />
              <span>Daily Report</span>
            </div>
            <h1 className={`text-4xl font-black tracking-tight ${viewMode === 'dashboard' ? 'text-slate-900' : 'text-white'}`}>
              {REPORT_DATE}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-lg self-start md:self-auto overflow-hidden">
            <button 
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layout className="w-4 h-4" /> Dashboard
            </button>
            <button 
              onClick={() => setViewMode('infographic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'infographic' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <Sparkles className="w-4 h-4" /> Infographic
            </button>
            <button 
              onClick={() => setViewMode('poster')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'poster' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <FileText className="w-4 h-4" /> Poster
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Summary Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Daily Summary</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-blue-100 text-sm font-bold uppercase tracking-widest">Projects Status</h3>
                      <ul className="space-y-2">
                        {SUMMARY.projects.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                            <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-blue-100 text-sm font-bold uppercase tracking-widest">System Health</h3>
                      <ul className="space-y-2">
                        {SUMMARY.system.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                            <Info className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-rose-50 border-rose-100">
                  <div className="flex items-center gap-2 mb-4 text-rose-600">
                    <AlertCircle className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Next / Risks</h2>
                  </div>
                  <ul className="space-y-4">
                    {SUMMARY.risks.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-rose-100 shadow-sm text-rose-900 font-medium text-sm">
                        <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROJECTS.map((project, idx) => (
                  <Card key={idx} className="flex flex-col">
                    <SectionHeader 
                      title={project.title} 
                      icon={project.icon} 
                      color={project.color} 
                    />
                    <div className="flex-1">
                      {project.content.map((cat, cIdx) => (
                        <CategoryBlock 
                          key={cIdx} 
                          category={cat.category} 
                          items={cat.items} 
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {viewMode === 'infographic' && (
            <motion.div 
              key="infographic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 pb-20"
            >
              {/* Hero Infographic Section */}
              <div className="relative p-8 md:p-16 rounded-[3rem] bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold border border-blue-500/30"
                    >
                      <Zap className="w-4 h-4" />
                      <span>MISSION CRITICAL UPDATES</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                      Progress <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Snapshot</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md">
                      Real-time operational intelligence for the CH7ON ecosystem and associated projects.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="text-4xl font-black text-blue-400 mb-1">03</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Projects</div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="text-4xl font-black text-emerald-400 mb-1">92%</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Uptime</div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="text-4xl font-black text-rose-400 mb-1">05</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Risks</div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="text-4xl font-black text-amber-400 mb-1">11</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Game Pipeline</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Timeline / Flow */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Layers className="w-6 h-6 text-blue-400" />
                  Project Ecosystem
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {PROJECTS.map((project, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative flex flex-col md:flex-row items-stretch gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className={`w-16 h-16 rounded-2xl ${project.color} flex items-center justify-center shrink-0 shadow-lg shadow-black/20`}>
                        {React.cloneElement(project.icon as React.ReactElement, { className: "w-8 h-8 text-white" })}
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h4 className="text-2xl font-bold">{project.title}</h4>
                          <div className="flex gap-2">
                            {project.content.map((c, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-tighter border border-white/10">
                                {c.category}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                          {project.content.map((cat, cIdx) => (
                            <div key={cIdx} className="space-y-2">
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{cat.category}</div>
                              <ul className="space-y-1">
                                {cat.items.slice(0, 2).map((item, iIdx) => (
                                  <li key={iIdx} className="text-xs text-slate-300 flex items-start gap-2">
                                    <ArrowRight className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{item}</span>
                                  </li>
                                ))}
                                {cat.items.length > 2 && (
                                  <li className="text-[10px] text-blue-400 font-bold italic">+{cat.items.length - 2} more items</li>
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'poster' && (
            <motion.div 
              key="poster"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-4xl mx-auto bg-white text-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200"
            >
              {/* Poster Header */}
              <div className="p-12 bg-slate-900 text-white text-center space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50" />
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 inline-block px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4"
                >
                  Daily Operational Report
                </motion.div>
                <h1 className="relative z-10 text-6xl font-black tracking-tighter leading-none">
                  APRIL <span className="text-emerald-400">01</span> <br />
                  <span className="text-slate-400">2026</span>
                </h1>
                <div className="relative z-10 flex justify-center gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white">24</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Updates</div>
                  </div>
                  <div className="text-center border-x border-white/10 px-8">
                    <div className="text-3xl font-black text-emerald-400">OK</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-400">06</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Projects</div>
                  </div>
                </div>
              </div>

              {/* Poster Content */}
              <div className="p-12 space-y-16">
                
                {/* Visual Data Section */}
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                      <Activity className="w-5 h-5 text-blue-500" />
                      Project Progress
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CHART_DATA} layout="vertical" margin={{ left: 20, right: 30 }}>
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            width={80}
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                          />
                          <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={12}>
                            {CHART_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      System Health
                    </h3>
                    <div className="h-64 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={PIE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {PIE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black">9/9</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Modules</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {PROJECTS.slice(0, 4).map((project, idx) => (
                    <div key={idx} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${project.color} flex items-center justify-center text-white shadow-lg`}>
                          {project.icon}
                        </div>
                        <h4 className="text-xl font-black tracking-tight">{project.title}</h4>
                      </div>
                      <div className="space-y-3">
                        {project.content.map((cat, cIdx) => (
                          <div key={cIdx} className="space-y-1">
                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{cat.category}</div>
                            <div className="text-xs text-slate-600 font-medium line-clamp-1">
                              {cat.items[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Risks & Next Steps */}
                <div className="p-12 rounded-[3rem] bg-rose-50 border border-rose-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <AlertCircle className="w-32 h-32 text-rose-500" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black text-rose-600 flex items-center gap-3 uppercase tracking-tight">
                      <Flag className="w-6 h-6" />
                      Risks & Next Steps
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {SUMMARY.risks.map((risk, i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-rose-100 space-y-2">
                          <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {i + 1}
                          </div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">
                            {risk}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Poster Footer */}
                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-tight">Operational Intelligence</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Internal Use Only</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                    <Download className="w-4 h-4" /> Download Report
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className={`pt-8 border-t ${viewMode === 'dashboard' ? 'border-slate-200 text-slate-400' : 'border-white/10 text-slate-500'} flex flex-col md:flex-row justify-between items-center gap-4 text-sm`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {REPORT_DATE} 23:59</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Issues</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
