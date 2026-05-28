import React, { useState } from 'react';
import { 
  ShieldAlert, Plus, Camera, Activity, FileText, 
  ChevronLeft, MapPin, Calendar, ShieldCheck, 
  AlertTriangle, CheckCircle2, Factory, Loader2,
  HardHat, UserCheck, TrendingUp, Clock, Filter, Printer, BarChart3, LineChart as LineChartIcon, Zap,
  ListChecks, ArrowRightCircle, Bell, LayoutDashboard, Globe
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

type Role = 'inspector' | 'manager' | null;
type ImprovementStatus = 'pending' | 'resolved';

interface FollowUp {
  id: string;
  task: string;
  done: boolean;
}

interface Inspection {
  id: string;
  siteName: string;
  location?: string;
  date: string;
  defect: string;
  imageUrl?: string;
  status: 'analyzed';
  improvementStatus: ImprovementStatus;
  aiResult: {
    type: string;
    level: 'High' | 'Medium' | 'Low';
    priority: 'P1-緊急' | 'P2-優先' | 'P3-例行';
    summary: string;
    suggestions: string[];
    followUps: FollowUp[];
  };
}

const mockData: Inspection[] = [
  {
    id: '1',
    siteName: '台北信義A1建案',
    date: '2026-05-18',
    defect: '施工人員未依規定配戴安全帽，且於高處作業未確實勾掛安全帶。',
    status: 'analyzed',
    improvementStatus: 'pending',
    aiResult: {
      type: '墜落與防護缺失',
      level: 'High',
      priority: 'P1-緊急',
      summary: '現場查獲人員於高空環境作業時，缺乏基本個人安全防護裝備，具有極高墜落與重傷風險。',
      suggestions: ['立即勒令該名人員停止作業並離開高空區域。', '針對違規包商開立缺失改善單。'],
      followUps: [{ id: 'f1', task: '拍攝人員正確穿戴裝備復工照片', done: false }]
    }
  },
  {
    id: '2',
    siteName: '台中烏日廠房工程',
    date: '2026-05-17',
    defect: 'B區南側鷹架二樓處，交叉拉桿鬆脫未固定。',
    status: 'analyzed',
    improvementStatus: 'resolved',
    aiResult: {
      type: '倒塌危害',
      level: 'High',
      priority: 'P1-緊急',
      summary: '鷹架交叉拉桿鬆脫，影響結構穩定性，恐有倒塌疑慮。',
      suggestions: ['拉起封鎖線禁止進入。', '通知鷹架廠商加固。'],
      followUps: [{ id: 'f4', task: '完成交叉拉桿鎖緊固定', done: true }]
    }
  },
  {
    id: '3',
    siteName: '高雄左營住宅專案',
    date: '2026-05-17',
    defect: '一樓材料堆放區動線受阻，有絆倒風險。',
    status: 'analyzed',
    improvementStatus: 'pending',
    aiResult: {
      type: '環境與動線受阻',
      level: 'Low',
      priority: 'P3-例行',
      summary: '建材隨意堆放侵占走道，可能導致絆倒或阻礙逃生。',
      suggestions: ['通知現場人員將材料移至暫存區。'],
      followUps: [{ id: 'f6', task: '材料移置並清空走道拍照存證', done: true }, { id: 'f7', task: '劃設黃色警戒線', done: false }]
    }
  },
  {
    id: '4',
    siteName: '桃園青埔商辦大樓',
    date: '2026-05-16',
    defect: '地下室發電機房旁電箱未關閉，且周圍無絕緣防護墊，現場積水。',
    status: 'analyzed',
    improvementStatus: 'pending',
    aiResult: {
      type: '感電危害',
      level: 'High',
      priority: 'P1-緊急',
      summary: '電氣設備未關閉且周邊積水，嚴重違反用電安全規範。',
      suggestions: ['切斷該區域總電源。', '排除積水並鋪設絕緣墊。'],
      followUps: [{ id: 'f8', task: '完成積水排除', done: false }]
    }
  },
  {
    id: '5',
    siteName: '台北信義A1建案',
    date: '2026-05-15',
    defect: '電梯井開口處之防墜網破損，未及時修補。',
    status: 'analyzed',
    improvementStatus: 'resolved',
    aiResult: {
      type: '墜落與防護缺失',
      level: 'High',
      priority: 'P1-緊急',
      summary: '電梯井防墜網破洞失去防護功能。',
      suggestions: ['設置硬質護欄。', '更換安全網。'],
      followUps: [{ id: 'f10', task: '設置臨時硬質護欄', done: true }]
    }
  },
  {
    id: '6',
    siteName: '新竹科學園區三期',
    date: '2026-05-14',
    defect: '焊接作業未配置滅火器，且作業人員未戴護目鏡。',
    status: 'analyzed',
    improvementStatus: 'pending',
    aiResult: {
      type: '火災與防護缺失',
      level: 'Medium',
      priority: 'P2-優先',
      summary: '動火作業未配置消防設備，且作業人員缺乏眼部防護。',
      suggestions: ['暫停動火作業，配置滅火器。'],
      followUps: [{ id: 'f12', task: '配置兩具滅火器', done: false }]
    }
  }
];

// Soft pastel palette for charts
const COLORS = ['#d17b7b', '#cda26f', '#75a38b']; 

const trendData = [
  { name: '5/12', 實際發生: 4, AI預測: 4 },
  { name: '5/13', 實際發生: 3, AI預測: 3 },
  { name: '5/14', 實際發生: 5, AI預測: 4 },
  { name: '5/15', 實際發生: 2, AI預測: 3 },
  { name: '5/16', 實際發生: 1, AI預測: 2 },
  { name: '5/17', 實際發生: 3, AI預測: 2 },
  { name: '5/18', 實際發生: 1, AI預測: 2 },
  { name: '5/19 (預測)', AI預測: 3 },
  { name: '5/20 (預測)', AI預測: 2 },
];

export default function App() {
  const [role, setRole] = useState<Role>(null);
  const [view, setView] = useState<'login' | 'dashboard' | 'form' | 'report' | 'analysis' | 'warroom'>('login');
  const [inspections, setInspections] = useState<Inspection[]>(mockData);
  const [currentReport, setCurrentReport] = useState<Inspection | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [showNotifications, setShowNotifications] = useState(false);

  const [siteName, setSiteName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [defect, setDefect] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setView(selectedRole === 'manager' ? 'dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setView('login');
  };

  const handleToggleFollowUp = (inspectionId: string, followUpId: string) => {
    const updateFn = (item: Inspection) => {
      if (item.id === inspectionId) {
        return { ...item, aiResult: { ...item.aiResult, followUps: item.aiResult.followUps.map(f => f.id === followUpId ? { ...f, done: !f.done } : f) } };
      }
      return item;
    };
    setInspections(inspections.map(updateFn));
    if (currentReport && currentReport.id === inspectionId) setCurrentReport(updateFn(currentReport));
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !location || !date) return;
    if (!defect && !imageUrl) {
      alert('請至少上傳一張現場照片，或輸入狀況描述，才能進行 AI 分析。');
      return;
    }
    setIsAnalyzing(true);
    
    setTimeout(() => {
      let level: 'High' | 'Medium' | 'Low' = 'Medium';
      let type = '一般違規';
      let priority: 'P1-緊急' | 'P2-優先' | 'P3-例行' = 'P2-優先';
      let summary = '';
      let suggestions: string[] = [];
      let followUps: {id: string, task: string, done: boolean}[] = [];
      let finalDefect = defect;

      if (!defect && imageUrl) {
        // Simulate AI Vision analysis randomly
        const rand = Math.random();
        if (rand < 0.33) {
          finalDefect = 'AI影像辨識：畫面中人員於開口處作業，未配戴安全帽與安全帶。';
          level = 'High'; priority = 'P1-緊急'; type = '墜落與防護缺失';
          summary = '系統透過影像辨識發現高空作業未具備防護裝備，屬極高墜落風險。';
          suggestions = ['立即要求該名人員撤離。', '補足防護裝備並設置護欄。'];
          followUps = [{ id: Date.now() + '1', task: '拍攝人員正確穿戴裝備復工照片', done: false }];
        } else if (rand < 0.66) {
          finalDefect = 'AI影像辨識：現場有動火作業，但周圍3公尺內未見滅火器。';
          level = 'Medium'; priority = 'P2-優先'; type = '火災與防護缺失';
          summary = '影像判定動火作業周邊缺乏消防設施，易引起火災。';
          suggestions = ['立即暫停動火作業。', '配置滅火器於作業區。'];
          followUps = [{ id: Date.now() + '1', task: '現場補齊滅火器並拍照', done: false }];
        } else {
          finalDefect = 'AI影像辨識：走道上堆放大量建材與雜物，阻礙通行。';
          level = 'Low'; priority = 'P3-例行'; type = '環境與動線受阻';
          summary = '影像辨識出物料堆放不當，侵占逃生與施工動線。';
          suggestions = ['通知包商清除走道雜物。', '劃設物料暫存區。'];
          followUps = [{ id: Date.now() + '1', task: '走道清空拍照存證', done: false }];
        }
      } else {
        // Fallback to text analysis
        summary = `現場發現：「${defect.substring(0, 20)}...」等問題，潛藏安全疑慮。`;
        suggestions = ['提醒現場人員注意安全。', '加強工地環境巡視。'];
        followUps = [{ id: Date.now() + '1', task: '主管覆查現場確認', done: false }];

        if (defect.includes('安全帽') || defect.includes('高空') || defect.includes('墜落') || defect.includes('開口')) {
          level = 'High'; priority = 'P1-緊急'; type = '墜落與防護缺失';
          summary = `現場存在高度墜落風險行為：「${defect}」，極易造成人員傷亡。`;
          suggestions = ['立即勒令停工，排除危險因素後方可復工。'];
          followUps = [{ id: Date.now() + '1', task: '拍攝改善後照片上傳', done: false }];
        } else if (defect.includes('鷹架') || defect.includes('倒塌') || defect.includes('支撐')) {
          level = 'High'; priority = 'P1-緊急'; type = '倒塌危害';
          summary = `結構支撐或設備出現異常：「${defect}」，有立即倒塌之虞。`;
          suggestions = ['淨空該區域下方所有人員。', '緊急通知專業架設人員加固。'];
          followUps = [{ id: Date.now() + '1', task: '完成加固並簽署', done: false }];
        } else if (defect.includes('火') || defect.includes('焊接') || defect.includes('易燃')) {
          level = 'Medium'; priority = 'P2-優先'; type = '火災與防護缺失';
          summary = `動火作業防護措施不足：「${defect}」，容易引起火災。`;
          suggestions = ['暫停動火作業，補齊滅火設備。'];
          followUps = [{ id: Date.now() + '1', task: '現場補齊滅火器', done: false }];
        } else if (defect.includes('電') || defect.includes('積水')) {
          level = 'High'; priority = 'P1-緊急'; type = '感電危害';
          summary = `用電環境惡劣：「${defect}」，隨時可能發生致命感電。`;
          suggestions = ['切斷電源，排除環境積水。'];
          followUps = [{ id: Date.now() + '1', task: '機電人員完成積水排除', done: false }];
        } else if (defect.includes('動線') || defect.includes('堆放')) {
          level = 'Low'; priority = 'P3-例行'; type = '環境與動線受阻';
          summary = `現場環境雜亂：「${defect}」，可能造成人員絆倒。`;
          suggestions = ['要求承包商於下班前完成整理。'];
          followUps = [{ id: Date.now() + '1', task: '走道清空拍照', done: false }];
        }
      }

      const newInspection: Inspection = {
        id: Date.now().toString(), siteName, location, date, defect: finalDefect, imageUrl: imageUrl || undefined, status: 'analyzed', improvementStatus: 'pending',
        aiResult: { type, level, priority, summary, suggestions, followUps }
      };

      setInspections([newInspection, ...inspections]);
      setCurrentReport(newInspection);
      setIsAnalyzing(false);
      setView('report');
      setSiteName(''); setLocation(''); setDefect(''); setImageUrl(null);
    }, 2500);
  };

  const handleResolveIssue = () => {
    if (currentReport) {
      const allDone = currentReport.aiResult.followUps.every(f => f.done);
      if (!allDone && !window.confirm('尚有追蹤事項未完成，確定要強制結案嗎？')) return;
      setInspections(inspections.map(item => item.id === currentReport.id ? { ...item, improvementStatus: 'resolved' } : item));
      setCurrentReport({ ...currentReport, improvementStatus: 'resolved' });
    }
  };

  const getLevelBadge = (level: string) => {
    switch(level) {
      case 'High': return <span className="badge badge-high">高危險</span>;
      case 'Medium': return <span className="badge badge-medium">中危險</span>;
      case 'Low': return <span className="badge badge-low">低危險</span>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'P1-緊急': return <span style={{ background: '#d17b7b', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{priority}</span>;
      case 'P2-優先': return <span style={{ background: '#cda26f', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{priority}</span>;
      case 'P3-例行': return <span style={{ background: '#75a38b', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{priority}</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: ImprovementStatus) => {
    if (status === 'resolved') return <span className="badge" style={{ background: 'rgba(117, 163, 139, 0.1)', color: '#5c8b73', border: '1px solid rgba(117, 163, 139, 0.3)' }}>已結案</span>;
    return <span className="badge" style={{ background: 'rgba(205, 162, 111, 0.1)', color: '#b5884d', border: '1px solid rgba(205, 162, 111, 0.3)' }}>待改善</span>;
  };

  if (view === 'login') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '420px', width: '100%', textAlign: 'center', background: '#fff' }}>
          <ShieldAlert size={56} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
          <h1 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#374151' }}>AI 智慧工地</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>安全巡檢與戰情管理系統</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ padding: '1rem', fontSize: '1rem', justifyContent: 'center' }} onClick={() => handleLogin('inspector')}><HardHat size={20} /> 巡檢人員登入</button>
            <button className="btn" style={{ padding: '1rem', fontSize: '1rem', justifyContent: 'center', background: '#f9fafb', color: 'var(--text-main)', border: '1px solid #e5e7eb' }} onClick={() => handleLogin('manager')}><UserCheck size={20} /> 高階主管登入</button>
          </div>
        </div>
      </div>
    );
  }

  // DYNAMIC CHART DATA GENERATION
  const totalIssues = inspections.length;
  const pendingIssues = inspections.filter(i => i.improvementStatus === 'pending').length;
  const highRiskIssues = inspections.filter(i => i.aiResult.level === 'High' && i.improvementStatus === 'pending').length;

  let filteredInspections = inspections.filter(i => {
    if (filter === 'all') return true;
    return i.improvementStatus === filter;
  });

  filteredInspections = filteredInspections.sort((a, b) => {
    const pMap: Record<string, number> = { 'P1-緊急': 3, 'P2-優先': 2, 'P3-例行': 1 };
    if (a.improvementStatus === 'pending' && b.improvementStatus === 'resolved') return -1;
    if (a.improvementStatus === 'resolved' && b.improvementStatus === 'pending') return 1;
    if (pMap[a.aiResult.priority] > pMap[b.aiResult.priority]) return -1;
    if (pMap[a.aiResult.priority] < pMap[b.aiResult.priority]) return 1;
    return 0;
  });

  const riskData = [
    { name: '高危險 (High)', value: inspections.filter(i => i.aiResult.level === 'High').length },
    { name: '中危險 (Medium)', value: inspections.filter(i => i.aiResult.level === 'Medium').length },
    { name: '低危險 (Low)', value: inspections.filter(i => i.aiResult.level === 'Low').length },
  ].filter(d => d.value > 0);

  const typeMap = new Map<string, number>();
  inspections.forEach(i => {
    typeMap.set(i.aiResult.type, (typeMap.get(i.aiResult.type) || 0) + 1);
  });
  const typeData = Array.from(typeMap.entries()).map(([name, count]) => ({ name, 發生次數: count })).sort((a,b) => b.發生次數 - a.發生次數);

  const siteProgressMap = new Map<string, { site: string; 待改善: number; 已結案: number }>();
  inspections.forEach(i => {
    const s = siteProgressMap.get(i.siteName) || { site: i.siteName, 待改善: 0, 已結案: 0 };
    if (i.improvementStatus === 'pending') s.待改善++;
    else s.已結案++;
    siteProgressMap.set(i.siteName, s);
  });
  const siteProgressData = Array.from(siteProgressMap.values());

  const siteMap = new Map<string, { total: number; pendingHigh: number; pendingOther: number }>();
  inspections.forEach(i => {
    const s = siteMap.get(i.siteName) || { total: 0, pendingHigh: 0, pendingOther: 0 };
    s.total++;
    if (i.improvementStatus === 'pending') {
      if (i.aiResult.level === 'High') s.pendingHigh++;
      else s.pendingOther++;
    }
    siteMap.set(i.siteName, s);
  });

  // Recharts styling configs (Soft)
  const chartAxisColor = '#9ca3af';
  const chartGridColor = '#f3f4f6';
  const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#4b5563', fontSize: '0.9rem', padding: '8px' };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header className="no-print" style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', 
        paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ color: 'var(--primary)' }}><ShieldAlert size={28} /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#374151' }}>AI 智慧工安戰情網</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem', marginTop: '0.2rem' }}>{role === 'manager' ? '高階主管管理系統' : '第一線巡檢人員系統'}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative' }}>
          {role === 'manager' && (
            <div style={{ display: 'flex', background: '#f9fafb', borderRadius: '6px', padding: '0.2rem', border: '1px solid #e5e7eb', marginRight: '0.5rem' }}>
              <button onClick={() => setView('dashboard')} style={{ padding: '0.4rem 0.8rem', background: view === 'dashboard' ? '#fff' : 'transparent', color: view === 'dashboard' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: view === 'dashboard' ? 500 : 400, boxShadow: view === 'dashboard' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}><LayoutDashboard size={15}/> 統計</button>
              <button onClick={() => setView('warroom')} style={{ padding: '0.4rem 0.8rem', background: view === 'warroom' ? '#fff' : 'transparent', color: view === 'warroom' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: view === 'warroom' ? 500 : 400, boxShadow: view === 'warroom' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}><Globe size={15}/> 戰情室</button>
              <button onClick={() => setView('analysis')} style={{ padding: '0.4rem 0.8rem', background: view === 'analysis' ? '#fff' : 'transparent', color: view === 'analysis' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: view === 'analysis' ? 500 : 400, boxShadow: view === 'analysis' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}><Zap size={15}/> 分析</button>
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <button className="btn" style={{ background: 'transparent', padding: '0.5rem', color: 'var(--text-muted)' }} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              {highRiskIssues > 0 && <span style={{ position: 'absolute', top: 4, right: 4, background: '#d17b7b', width: 8, height: 8, borderRadius: '50%' }}></span>}
            </button>
            {showNotifications && (
              <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '120%', right: 0, width: '300px', zIndex: 50, padding: '1rem', background: '#fff' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '0.9rem' }}>系統通知</h4>
                {inspections.filter(i => i.improvementStatus === 'pending' && i.aiResult.priority === 'P1-緊急').length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>目前沒有緊急通知。</p>}
                {inspections.filter(i => i.improvementStatus === 'pending' && i.aiResult.priority === 'P1-緊急').slice(0,3).map(i => (
                  <div key={i.id} style={{ padding: '0.75rem', background: '#fefcfc', borderRadius: '6px', marginBottom: '0.5rem', borderLeft: `3px solid #d17b7b`, cursor: 'pointer', border: '1px solid #f3f4f6', borderLeftWidth: '3px' }} onClick={() => { setCurrentReport(i); setView('report'); setShowNotifications(false); }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{i.siteName} 有緊急缺失</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>{i.aiResult.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem 0' }} onClick={handleLogout}>登出</button>
        </div>
      </header>

      <main>
        {view === 'warroom' && role === 'manager' && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <Globe color="var(--text-muted)" size={20} /> 全區工地戰情室
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {Array.from(siteMap.entries()).map(([site, data]) => {
                const isCritical = data.pendingHigh > 0;
                const isWarning = data.pendingOther > 0;
                let bgLight = isCritical ? '#fdf8f8' : (isWarning ? '#fdfaf5' : '#f6f9f7');
                let borderColor = isCritical ? '#d17b7b' : (isWarning ? '#cda26f' : '#75a38b');
                
                return (
                  <div key={site} className="glass-panel" style={{ padding: '1.25rem', borderTop: `3px solid ${borderColor}`, position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', color: 'var(--text-main)' }}>
                      <MapPin size={16} color={borderColor} /> {site}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ flex: 1, background: '#f9fafb', border: '1px solid #f3f4f6', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>累計通報</p>
                        <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 500 }}>{data.total}</h4>
                      </div>
                      <div style={{ flex: 1, background: bgLight, padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: borderColor }}>未處理高危</p>
                        <h4 style={{ margin: 0, fontSize: '1.25rem', color: borderColor, fontWeight: 500 }}>{data.pendingHigh}</h4>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === 'analysis' && role === 'manager' && (
          <div className="animate-fade-in">
             <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}><Zap color="var(--text-muted)" size={20} /> 趨勢預測分析</h2>
            <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>違規趨勢模型</h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                      <XAxis dataKey="name" stroke={chartAxisColor} tick={{fill: chartAxisColor, fontSize: 11}} />
                      <YAxis stroke={chartAxisColor} tick={{fill: chartAxisColor, fontSize: 11}} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend verticalAlign="top" height={30} wrapperStyle={{ color: chartAxisColor, fontSize: '12px' }} />
                      <Line type="monotone" dataKey="實際發生" stroke="#d17b7b" strokeWidth={2} dot={{r:3}} />
                      <Line type="monotone" dataKey="AI預測" stroke="var(--primary)" strokeWidth={2} strokeDasharray="4 4" dot={{r:3}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>安全指標雷達</h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={
                      [
                        { subject: '防護具配戴', A: 85, fullMark: 100 },
                        { subject: '鷹架設備', A: 65, fullMark: 100 },
                        { subject: '用電安全', A: 70, fullMark: 100 },
                        { subject: '動線規劃', A: 90, fullMark: 100 },
                        { subject: '高空防護', A: 60, fullMark: 100 },
                        { subject: '教育訓練', A: 75, fullMark: 100 },
                      ]
                    }>
                      <PolarGrid stroke={chartGridColor} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: chartAxisColor, fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: chartAxisColor, fontSize: 10}} />
                      <Radar name="健康度" dataKey="A" stroke="var(--primary)" strokeWidth={1} fill="var(--primary)" fillOpacity={0.15} />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="animate-fade-in">
            {role === 'manager' && (
              <>
                <h2 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}><BarChart3 color="var(--text-muted)" size={20} /> 統計概覽</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>缺失類別分佈</h3>
                    <div style={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} horizontal={false} />
                          <XAxis type="number" stroke={chartAxisColor} allowDecimals={false} tick={{fontSize: 11}} />
                          <YAxis dataKey="name" type="category" stroke={chartAxisColor} tick={{fontSize: 11, fill: chartAxisColor}} />
                          <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={tooltipStyle} />
                          <Bar dataKey="發生次數" fill="var(--primary)" radius={[0, 3, 3, 0]} barSize={16} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>危險等級佔比</h3>
                    <div style={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={riskData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                            {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '11px', color: chartAxisColor }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>各區改善進度</h3>
                    <div style={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={siteProgressData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                          <XAxis dataKey="site" stroke={chartAxisColor} tick={{fontSize: 10, fill: chartAxisColor}} />
                          <YAxis stroke={chartAxisColor} tick={{fontSize: 10}} allowDecimals={false} />
                          <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={tooltipStyle} />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                          <Bar dataKey="已結案" stackId="a" fill="#75a38b" barSize={24} />
                          <Bar dataKey="待改善" stackId="a" fill="#cda26f" barSize={24} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} color="var(--text-muted)" /> {role === 'manager' ? '巡檢歷史紀錄' : '歷史巡檢紀錄'}</h2>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.2rem' }}>
                  <button onClick={() => setFilter('all')} style={{ padding: '0.3rem 0.8rem', background: filter === 'all' ? '#f3f4f6' : 'transparent', color: filter === 'all' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>全部</button>
                  <button onClick={() => setFilter('pending')} style={{ padding: '0.3rem 0.8rem', background: filter === 'pending' ? '#f3f4f6' : 'transparent', color: filter === 'pending' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>待改善</button>
                  <button onClick={() => setFilter('resolved')} style={{ padding: '0.3rem 0.8rem', background: filter === 'resolved' ? '#f3f4f6' : 'transparent', color: filter === 'resolved' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>已結案</button>
                </div>
                {role === 'inspector' && (
                  <button className="btn btn-primary" onClick={() => setView('form')}><Plus size={16} /> 新增</button>
                )}
              </div>
            </div>

            <div className="grid-cols-2">
              {filteredInspections.map((item, i) => (
                <div key={item.id} className={`glass-panel delay-${(i % 3) + 1}`} style={{ padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', border: item.improvementStatus === 'pending' ? '1px solid #e5e7eb' : '1px solid rgba(117, 163, 139, 0.4)' }} onClick={() => { setCurrentReport(item); setView('report'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}><Factory size={16} /><h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>{item.siteName}</h3>{item.location && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>- {item.location}</span>}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      {getPriorityBadge(item.aiResult.priority)}
                      {getStatusBadge(item.improvementStatus)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}><Calendar size={14} /> {item.date}</div>
                  <div style={{ display: 'flex', gap: '1rem', background: '#f9fafb', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
                    {item.imageUrl && (
                      <div style={{ flex: '0 0 60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <img src={item.imageUrl} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>{item.defect ? (item.defect.length > 50 ? item.defect.substring(0, 50) + '...' : item.defect) : '由 AI 自動進行視覺特徵辨識'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem' }}><Activity size={14} /> 分類: {item.aiResult.type}</div>
                    {item.improvementStatus === 'resolved' && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#75a38b', fontSize: '0.85rem' }}><CheckCircle2 size={14} /> 已結案</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'form' && role === 'inspector' && (
          <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.25rem' }}>新增巡檢紀錄</h2>
            <form onSubmit={handleAnalyze} className="glass-panel" style={{ padding: '2rem' }}>
              <div className="grid-cols-2" style={{ marginBottom: '1.25rem' }}>
                <div className="input-group"><label><Factory size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/>工地名稱</label><input type="text" className="input-control" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="例：台北信義A1建案" required /></div>
                <div className="input-group"><label><MapPin size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/>發生地點</label><input type="text" className="input-control" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例：B區3樓電梯井" required /></div>
              </div>
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label><Calendar size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/>日期</label><input type="date" className="input-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label><Camera size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/>現場照片</label>
                <div style={{ position: 'relative', border: imageUrl ? '1px solid var(--primary)' : '1px dashed #d1d5db', borderRadius: '8px', padding: imageUrl ? '1rem' : '2.5rem 1rem', textAlign: 'center', background: imageUrl ? '#f5f8fa' : '#f9fafb', transition: 'all 0.2s ease', overflow: 'hidden' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                  {imageUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={imageUrl} alt="preview" style={{ maxHeight: '160px', borderRadius: '4px', objectFit: 'contain', zIndex: 1 }} />
                      <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', position: 'relative', zIndex: 1 }}><CheckCircle2 size={18} /><p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>點擊或拖曳即可更換照片</p></div>
                    </div>
                  ) : (
                    <div><Camera size={28} style={{ color: '#9ca3af', margin: '0 auto 0.5rem' }} /><p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>點擊或拖曳選擇現場照片</p></div>
                  )}
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label><AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/>狀況描述 (可選)</label>
                <textarea className="input-control" rows={3} value={defect} onChange={(e) => setDefect(e.target.value)} placeholder="若未輸入，系統將自動透過照片進行 AI 影像辨識分析..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={isAnalyzing}>
                {isAnalyzing ? <><Loader2 className="animate-spin" size={18} /> 分析中...</> : <><Activity size={18} /> 執行 AI 分析</>}
              </button>
            </form>
          </div>
        )}

        {view === 'report' && currentReport && (
          <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ background: '#fdfdfd', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><FileText size={20} color="var(--primary)" /><h2 style={{ margin: 0, fontSize: '1.15rem' }}>AI 診斷報告</h2></div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>#{currentReport.id}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {getPriorityBadge(currentReport.aiResult.priority)}
                  {getStatusBadge(currentReport.improvementStatus)}
                </div>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>工地 / 地點</p><p style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{currentReport.siteName} {currentReport.location && <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>- {currentReport.location}</span>}</p></div>
                  <div><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>日期</p><p style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{currentReport.date}</p></div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                  {currentReport.imageUrl && (
                    <div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.95rem' }}><Camera size={16} color="var(--text-muted)" /> 現場影像</h3>
                      <img src={currentReport.imageUrl} alt="現場照片" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: '2 1 300px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.95rem' }}><AlertTriangle size={16} color="var(--secondary)" /> AI 診斷摘要</h3>
                    <div style={{ background: '#fafafa', padding: '1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--secondary)', borderTop: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', height: 'calc(100% - 32px)' }}>
                      <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-main)', fontSize: '0.95rem' }}>{currentReport.aiResult.summary}</p>
                      <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>原始紀錄: {currentReport.defect || '由 AI 進行視覺特徵辨識'}</p>
                    </div>
                  </div>
                </div>
                <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', color: 'var(--primary)', fontSize: '0.95rem' }}><Activity size={16} /> 診斷結果</h3>
                    <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>判定類型</span>
                        <p style={{ fontSize: '1rem', marginTop: '0.2rem', color: 'var(--text-main)' }}>{currentReport.aiResult.type}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>危險等級</span>
                        <div style={{ marginTop: '0.2rem' }}>{getLevelBadge(currentReport.aiResult.level)}</div>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>處置建議</span>
                      <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: 1.6, fontSize: '0.9rem' }}>{currentReport.aiResult.suggestions.map((sug, idx) => <li key={idx} style={{ marginBottom: '0.4rem' }}>{sug}</li>)}</ul>
                    </div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '0.95rem' }}><ListChecks size={16} color="#75a38b" /> 追蹤事項</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {currentReport.aiResult.followUps.map(item => (
                        <div key={item.id} onClick={() => currentReport.improvementStatus === 'pending' && handleToggleFollowUp(currentReport.id, item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px', cursor: currentReport.improvementStatus === 'pending' ? 'pointer' : 'default', opacity: item.done ? 0.6 : 1, transition: 'all 0.2s', border: '1px solid #f3f4f6' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `1px solid ${item.done ? '#75a38b' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.done ? '#75a38b' : '#fff' }}>{item.done && <CheckCircle2 size={12} color="#fff" strokeWidth={3} />}</div>
                          <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-muted)' : 'var(--text-main)', fontSize: '0.9rem' }}>{item.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="no-print" style={{ padding: '1.25rem 2rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#faf9f8' }}>
                <button className="btn" style={{ background: '#fff', border: '1px solid #d1d5db', color: 'var(--text-main)' }} onClick={() => setView('dashboard')}>返回列表</button>
                {role === 'manager' && currentReport.improvementStatus === 'pending' && <button className="btn" style={{ background: '#75a38b', color: '#fff', border: 'none' }} onClick={handleResolveIssue}><CheckCircle2 size={16} /> 標記已改善</button>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
