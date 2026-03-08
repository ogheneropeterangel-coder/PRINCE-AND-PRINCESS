import React, { useState, useEffect, useMemo } from 'react';
import { db, calculatePositions } from '../db';
import { useAuth } from '../App';
import { Score, Student, Subject, SchoolClass, FormTeacherRemark, User, SchoolSettings } from '../types';
import { getGrade, getOrdinal, getAutoRemark } from '../constants';
import { StatsSkeleton, TableSkeleton } from '../components/Skeleton';
import { 
  Award, Printer, User as UserIcon, Users, TrendingUp, BookOpen, Eye, X, 
  AlertCircle, Clock, ShieldAlert, CheckCircle2, FileText, Fingerprint, Building2, Crown, Sparkles, LayoutDashboard, ShieldCheck, Contact, MapPin, Phone
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'results'>('overview');
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cls, setCls] = useState<SchoolClass | null>(null);
  const [formTeacher, setFormTeacher] = useState<User | null>(null);
  const [remark, setFormTeacherRemark] = useState<FormTeacherRemark | null>(null);
  const [classSize, setClassSize] = useState(0);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  const [settings, setSettings] = useState<SchoolSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await db.settings.get();
      setSettings(s);
      if (s) setSelectedTerm(s.current_term);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!user || !settings) return;
      setLoading(true);
      try {
        const allStudents = await db.students.getAll();
        const normalizedAuthUsername = user.username.toLowerCase().replace(/\//g, '_');
        
        const student = allStudents.find(stu => {
          const isIdMatch = stu.profile_id === user.id || stu.id === user.id;
          const stuAdmNormalized = stu.admission_number.toLowerCase().replace(/\//g, '_');
          const isUsernameMatch = stuAdmNormalized === normalizedAuthUsername;
          return isIdMatch || isUsernameMatch;
        });

        if (student) {
          setStudentInfo(student);
          const allScores = await db.scores.getAll();
          
          const currentScores = allScores.filter(sc => 
            sc.student_id === student.id && 
            sc.term === selectedTerm && 
            sc.session === settings.current_session
          );
          setScores(currentScores);
          
          const allClasses = await db.classes.getAll();
          const studentCls = allClasses.find(c => c.id === student.class_id);
          if (studentCls) {
            setCls(studentCls);
            const allUsers = await db.users.getAll();
            const teacher = allUsers.find(u => u.id === studentCls.form_teacher_id);
            setFormTeacher(teacher || null);
            
            const classFiltered = allStudents.filter(stu => stu.class_id === studentCls.id);
            setClassSize(classFiltered.length);
            
            const scoresFiltered = allScores.filter(sc => 
              sc.class_id === studentCls.id && 
              sc.term === selectedTerm && 
              sc.session === settings.current_session
            );
            const ranks = calculatePositions(classFiltered, scoresFiltered, selectedTerm, settings.current_session);
            setPosition(ranks[student.id] || 0);
          }
          
          const allSubjects = await db.subjects.getAll();
          setSubjects(allSubjects);
          
          const allRemarks = await db.remarks.getAll();
          const r = allRemarks.find(rem => 
            rem.student_id === student.id && 
            rem.term === selectedTerm && 
            rem.session === settings.current_session
          );
          setFormTeacherRemark(r || null);
        } else {
          setHasError(true);
        }
      } catch (err) {
        console.error("Dashboard Init Error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, settings, selectedTerm]);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const totalScore = scores.reduce((acc, s) => acc + (s.first_ca + s.second_ca + s.exam), 0);
  const average = scores.length ? totalScore / scores.length : 0;

  if (loading) return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-[2rem]" />
          <div className="space-y-2">
            <div className="w-48 h-6 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="w-32 h-3 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md" />
          </div>
        </div>
      </div>
      <StatsSkeleton />
      <TableSkeleton />
    </div>
  );

  if (hasError || !studentInfo || !settings) return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center p-10 max-w-md mx-auto">
      <div className="p-8 bg-rose-50 border border-rose-100 dark:bg-rose-900/20 dark:border-rose-800 rounded-[3rem] mb-8">
        <AlertCircle size={64} className="text-rose-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Registry Mismatch</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium leading-relaxed">
        We couldn't locate an active student profile linked to your account.
      </p>
    </div>
  );

  const ModernReportCard = () => {
    if (!studentInfo || !settings) return null;

    const RatingDots = ({ value }: { value: number }) => (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div 
            key={dot} 
            className={`w-1.5 h-1.5 rounded-full ${dot <= value ? 'bg-blue-800' : 'bg-slate-200'}`} 
          />
        ))}
      </div>
    );

    const AFFECTIVE_TRAITS = [
      { key: 'punctuality', label: 'Punctuality' },
      { key: 'neatness', label: 'Neatness' },
      { key: 'honesty', label: 'Honesty' },
      { key: 'cooperation', label: 'Cooperation' },
      { key: 'self_control', label: 'Self Control' },
    ];

    const PSYCHOMOTOR_SKILLS = [
      { key: 'handwriting', label: 'Handwriting' },
      { key: 'sports', label: 'Sports' },
      { key: 'crafts', label: 'Crafts' },
      { key: 'fluency', label: 'Fluency' },
      { key: 'musical_skills', label: 'Musical Skills' },
    ];

    return (
      <div className="bg-white p-8 md:p-12 font-sans text-black w-full max-w-5xl min-h-[1100px] flex flex-col relative overflow-hidden border-[6px] border-double border-blue-900 print:shadow-none print:border-[6px] print:m-0 print:p-8 text-black">
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-900 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-900 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-900 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-900 rounded-br-lg" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          {settings.logo ? <img src={settings.logo} className="w-[500px] h-[500px] object-contain" alt="Watermark" /> : <Building2 size={500} />}
        </div>

        <div className="flex flex-col items-center text-center mb-6 relative z-10">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-900 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                 {settings.logo ? <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 className="text-blue-900" size={48} />}
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold uppercase tracking-tight text-blue-900 mb-1 leading-none font-serif">{settings.name}</h1>
                <p className="text-sm font-serif italic text-slate-600 tracking-wide">{settings.motto}</p>
                <div className="h-1 w-full bg-blue-900 mt-2" />
              </div>
            </div>
            <div className="bg-blue-900 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Official Academic Terminal Record</div>
            <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest mt-2">{settings.current_session} Session • Term {selectedTerm}</p>
        </div>

        <div className="grid grid-cols-4 gap-0 mb-6 bg-slate-50 border-y-2 border-blue-900 relative z-10 text-black">
            <div className="p-3 border-r border-slate-200"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Full Name</p><p className="text-[11px] font-bold text-black uppercase truncate">{studentInfo.surname}, {studentInfo.first_name} {studentInfo.middle_name || ''}</p></div>
            <div className="p-3 border-r border-slate-200"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Adm Number</p><p className="text-[11px] font-bold text-black uppercase font-mono">{studentInfo.admission_number}</p></div>
            <div className="p-3 border-r border-slate-200"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Class Level</p><p className="text-[11px] font-bold text-black uppercase">{cls?.name || '---'}</p></div>
            <div className="p-3 text-right"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Gender</p><p className="text-[11px] font-bold text-black uppercase">{studentInfo.gender}</p></div>
        </div>

        <div className="flex gap-6 flex-1 relative z-10 mb-6">
          {/* Left Column: Domains */}
          <div className="w-56 space-y-4">
            <div className="border border-blue-900 rounded-lg overflow-hidden">
              <div className="bg-blue-900 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest">Affective Domain</div>
              <div className="p-3 space-y-2 bg-white">
                {AFFECTIVE_TRAITS.map(trait => (
                  <div key={trait.key} className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-700 uppercase">{trait.label}</span>
                    <RatingDots value={remark?.affective_domain?.[trait.key] || 4} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-blue-900 rounded-lg overflow-hidden">
              <div className="bg-blue-900 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest">Psychomotor Domain</div>
              <div className="p-3 space-y-2 bg-white">
                {PSYCHOMOTOR_SKILLS.map(skill => (
                  <div key={skill.key} className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-700 uppercase">{skill.label}</span>
                    <RatingDots value={remark?.psychomotor_domain?.[skill.key] || 4} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-blue-900 rounded-lg p-3 bg-blue-50/50">
              <p className="text-[8px] font-black text-blue-900 uppercase tracking-widest mb-1">Grading Key</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] font-bold text-slate-600">
                <span>70-100: A (Ex)</span>
                <span>60-69: B (VG)</span>
                <span>50-59: C (Cr)</span>
                <span>45-49: D (Pa)</span>
                <span>40-44: E (Fa)</span>
                <span>0-39: F (Fl)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Results Table */}
          <div className="flex-1 overflow-hidden rounded-lg border border-blue-900 bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4 text-[9px] font-black uppercase tracking-widest">Subject Discipline</th>
                    <th className="py-2 px-2 text-[9px] font-black uppercase tracking-widest text-center w-12">CA 1</th>
                    <th className="py-2 px-2 text-[9px] font-black uppercase tracking-widest text-center w-12">CA 2</th>
                    <th className="py-2 px-2 text-[9px] font-black uppercase tracking-widest text-center w-12">Exam</th>
                    <th className="py-2 px-2 text-[9px] font-black uppercase tracking-widest text-center w-12 bg-blue-800">Total</th>
                    <th className="py-2 px-3 text-[9px] font-black uppercase tracking-widest text-center w-16">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-black">
                  {subjects.filter(sub => sub.category === cls?.level).map((sub) => {
                    const s = scores.find(score => score.subject_id === sub.id);
                    const total = (s?.first_ca || 0) + (s?.second_ca || 0) + (s?.exam || 0);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-1.5 px-4 font-bold text-[10px] uppercase tracking-tight text-black">{sub.name}</td>
                        <td className="py-1.5 px-2 text-center text-[10px] font-medium text-slate-600">{s?.first_ca ?? '0'}</td>
                        <td className="py-1.5 px-2 text-center text-[10px] font-medium text-slate-600">{s?.second_ca ?? '0'}</td>
                        <td className="py-1.5 px-2 text-center text-[10px] font-medium text-slate-600">{s?.exam ?? '0'}</td>
                        <td className="py-1.5 px-2 text-center font-black text-blue-900 bg-slate-50/30 text-[11px]">{total || '0'}</td>
                        <td className="py-1.5 px-3 text-center">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded font-black text-[9px] uppercase border ${total >= 70 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : total >= 60 ? 'bg-blue-50 border-blue-200 text-blue-700' : total >= 50 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>{getGrade(total)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 relative z-10 text-black">
            <div className="bg-blue-900 p-4 rounded-xl text-white shadow-md flex flex-col justify-center"><p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-0.5">Aggregate</p><p className="text-xl font-bold tracking-tighter leading-none">{totalScore.toFixed(0)}</p></div>
            <div className="bg-white p-4 rounded-xl border border-blue-900 shadow-sm flex flex-col justify-center"><p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5">Average Score</p><p className="text-xl font-bold text-blue-900 tracking-tighter leading-none">{average.toFixed(1)}%</p></div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm flex items-center justify-between"><div><p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mb-0.5">Class Position</p><p className="text-xl font-bold text-blue-900 tracking-tighter leading-none">{getOrdinal(position)}</p></div><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-inner"><Crown size={16} fill="currentColor" /></div></div>
        </div>

        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-blue-900 relative z-10 text-black">
          <p className="text-[8px] font-black text-blue-900 uppercase tracking-[0.5em] mb-1.5 flex items-center gap-2"><Sparkles size={10} /> Faculty Remark</p>
          <p className="text-[11px] font-medium italic text-black leading-relaxed">"{remark?.remark || getAutoRemark(average)}"</p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-12 pt-8 border-t border-blue-900 relative z-10">
          <div className="text-center space-y-2">
            <div className="h-[1px] bg-slate-300 w-full mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Class Teacher's Signature</p>
          </div>
          <div className="text-center space-y-2">
            <div className="mb-1">
              <span style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '2rem', color: '#1e1b4b' }}>Principal</span>
            </div>
            <div className="h-[1px] bg-slate-300 w-full mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Principal's Attestation</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl">
             {studentInfo.first_name[0]}
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Student Portal</h1>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Institutional Registry • Verified Identity</p>
           </div>
        </div>
        <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 dark:text-slate-400'}`}
          >
            <LayoutDashboard size={14} /> My Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('results')} 
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'results' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 dark:text-slate-400'}`}
          >
            <FileText size={14} /> My Report Card
          </button>
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-8 no-print animate-in slide-in-from-bottom-4 duration-500">
          {/* Identity & Registry Particulars Card */}
          <div className="grid md:grid-cols-3 gap-8">
             <div className="md:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                    <Contact size={24} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Student Identity Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">First Legal Name</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white uppercase">{studentInfo.first_name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Legal Surname</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white uppercase">{studentInfo.surname}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Middle Identity</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white uppercase">{studentInfo.middle_name || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Classification</p>
                        <p className="text-lg font-bold text-blue-600 uppercase">{cls?.name || '---'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Admission ID</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{studentInfo.admission_number}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registry Gender</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white uppercase">{studentInfo.gender}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 text-white rounded-2xl">
                    <Contact size={24} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Guardian Link</h2>
                </div>

                <div className="space-y-8">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Parent / Sponsor Name</p>
                      <p className="text-lg font-bold uppercase">{studentInfo.parent_name || 'Not Recorded'}</p>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/5 rounded-lg text-blue-400"><Phone size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Verified Contact</p>
                        <p className="text-lg font-bold font-mono">{studentInfo.parent_phone || '---'}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/5 rounded-lg text-emerald-400"><MapPin size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Residence</p>
                        <p className="text-sm font-medium leading-relaxed opacity-80">{studentInfo.parent_address || 'Address information not currently finalized in registry.'}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <Award className="text-blue-600 mb-4" size={28} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Performance Rank</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{getOrdinal(position)}</h3>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <TrendingUp className="text-emerald-500 mb-4" size={28} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Cycle Average</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{average.toFixed(1)}%</h3>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <BookOpen className="text-purple-500 mb-4" size={28} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Subjects</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{scores.length}</h3>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                {/* Added Users icon which was previously missing its import */}
                <Users className="text-amber-500 mb-4" size={28} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Class Population</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{classSize}</h3>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-8 no-print animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
           <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                 <ShieldCheck size={20} />
               </div>
               <div>
                 <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Official Transcript Portal</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verified Academic Record</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <select 
                 className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
                 value={selectedTerm}
                 onChange={(e) => setSelectedTerm(Number(e.target.value))}
               >
                 <option value={1}>First Term</option>
                 <option value={2}>Second Term</option>
                 <option value={3}>Third Term</option>
               </select>
               <button 
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2"
                >
                  <Printer size={16} /> Print
                </button>
             </div>
           </div>
           
           <div className="scale-90 md:scale-100 origin-top">
             <ModernReportCard />
           </div>
        </div>
      )}

      <div className="hidden print:block fixed inset-0 bg-white z-[9999]">
        <ModernReportCard />
      </div>
    </div>
  );
};

export default StudentDashboard;