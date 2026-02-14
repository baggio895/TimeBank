
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Glasses, 
  MapPin, 
  User, 
  ArrowRightLeft, 
  Info,
  ChevronRight,
  Camera,
  CheckCircle,
  Sparkles,
  Plane,
  History,
  Clock,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Star,
  Quote
} from 'lucide-react';
import { UserProfile, ExchangeStatus, GlassDonation, JapanStay, Review } from './types';
import { evaluateGlasses, generateTravelAdvice, summarizeFeedback } from './services/geminiService';

// Mock Data
const INITIAL_STAYS: JapanStay[] = [
  {
    id: 's1',
    hostId: 'h1',
    location: '京都 (傳統町屋)',
    description: '在修復後的百年老宅中體驗禪意生活。',
    creditCost: 150,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    availableDates: ['2024-06-01', '2024-06-15'],
    reviews: [
      { id: 'r1', userName: '小明', rating: 5, comment: '非常有味道的老屋，主人還親自教我們茶道，真的感受到了時間銀行的溫暖。', date: '2024-03-12', tags: ['文化體驗', '房東熱情'] },
      { id: 'r2', userName: '阿強', rating: 4, comment: '環境清幽，雖然稍微偏遠了一點點，但這種寧靜是用點數換不到的價值。', date: '2024-02-28', tags: ['寧靜', '禪意'] }
    ]
  },
  {
    id: 's2',
    hostId: 'h2',
    location: '北海道 (農場寄宿)',
    description: '加入我們位於美瑛美麗丘陵的有機農場社區。',
    creditCost: 100,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop',
    availableDates: ['2024-07-10', '2024-07-20'],
    reviews: [
      { id: 'r3', userName: '亮亮', rating: 5, comment: '現摘的蔬菜真的太甜了！參與農事勞動讓我重新思考了生產者的價值。', date: '2023-11-05', tags: ['有機生活', '勞動體驗'] }
    ]
  },
  {
    id: 's3',
    hostId: 'h3',
    location: '東京 (中野當地生活)',
    description: '像當地人一樣生活在東京西部的安靜住宅區。',
    creditCost: 200,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop',
    availableDates: ['2024-08-05', '2024-08-12'],
    reviews: []
  }
];

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <section className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Japan Temple"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-12">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl font-bold mb-6 leading-tight">您的舊眼鏡，<br/>他的新視界，<br/>您的下一段旅程。</h1>
            <p className="text-xl mb-8 opacity-90">透過禪時匯交換社區價值。捐贈二手眼鏡，換取日本各地的道地住宿體驗。</p>
            <div className="flex gap-4">
              <Link to="/exchange" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 w-fit transition-all hover:scale-105">
                開始交換 <ArrowRightLeft size={20} />
              </Link>
              <Link to="/market" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 w-fit transition-all">
                瀏覽住宿 <MapPin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
            <Glasses size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">1. 捐贈眼鏡</h3>
          <p className="text-gray-600">上傳您的舊眼鏡照片並填寫描述。我們的 AI 會評估其品質並決定其「時間價值」。</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center text-emerald-600 mb-6">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">2. 獲得時間幣</h3>
          <p className="text-gray-600">一旦您的眼鏡進入我們的分類中心，相應的禪時幣 (ZT) 將解鎖至您的數位錢包。</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center text-amber-600 mb-6">
            <Plane size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">3. 探索日本</h3>
          <p className="text-gray-600">使用您的點數預約由社群成員提供的獨特住宿，從京都古寺到北海道農場應有盡有。</p>
        </div>
      </section>
    </div>
  );
};

const ExchangeFlow = ({ onCreditsEarned }: { onCreditsEarned: (c: number) => void }) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [isCurrentVerified, setIsCurrentVerified] = useState(false);

  useEffect(() => {
    const storedDonations = localStorage.getItem('donations');
    if (storedDonations) {
      try {
        setDonations(JSON.parse(storedDonations));
      } catch (error) {
        console.error("無法解析捐贈記錄", error);
      }
    }
  }, []);

  useEffect(() => {
    if (step === 2) {
      handleEvaluate();
    }
  }, [step]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluate = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const res = await evaluateGlasses(description, image || undefined);
      setEvaluation(res);
      setIsCurrentVerified(false);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("AI 評估失敗，請重試。");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const confirmDonation = () => {
    const newDonation = {
      id: Date.now().toString(),
      description,
      credits: evaluation.credits,
      verificationChecklist: evaluation.verificationChecklist,
      verified: isCurrentVerified,
      date: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updatedDonations = [newDonation, ...donations];
    setDonations(updatedDonations);
    localStorage.setItem('donations', JSON.stringify(updatedDonations));

    onCreditsEarned(evaluation.credits);
    setStep(4);
  };

  const toggleHistoryVerification = (id: string) => {
    const updated = donations.map(d => d.id === id ? { ...d, verified: !d.verified } : d);
    setDonations(updated);
    localStorage.setItem('donations', JSON.stringify(updated));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg min-h-[400px] flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">捐贈您的眼鏡</h2>
              <p className="text-gray-500">每一副鏡框都能改變一個人生。請告訴我們它們的狀況。</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">物品描述</label>
              <textarea 
                className="w-full border rounded-xl p-4 h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="例如：黑色雷朋鏡框，-2.50 度數，輕微使用痕跡但保存良好。"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
              {image ? (
                <img src={image} className="max-h-48 mx-auto rounded-lg" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="text-gray-400 mb-2" size={48} />
                  <p className="text-sm text-gray-500 font-medium">點擊上傳或拍攝照片</p>
                  <p className="text-xs text-gray-400 mt-1">支援 PNG, JPG 最大 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
              />
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!description}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              開始價值評估
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-indigo-600">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold">AI 正在評估價值...</h2>
            <p className="text-gray-500">我們的模型正在分析鏡框與社會影響力潛力。</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-2/3 animate-[progress_2s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {step === 3 && evaluation && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                AI 評估完成
              </div>
              <h2 className="text-4xl font-bold text-gray-900">{evaluation.credits} 禪時幣 (ZT)</h2>
              <p className="text-gray-500 mt-2">您的捐贈所預估的社會價值</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">影響力摘要</h4>
                <p className="text-gray-600 italic">"{evaluation.impactSummary}"</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3">驗證進度</h4>
                <div className="grid grid-cols-1 gap-2">
                  {evaluation.verificationChecklist.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setIsCurrentVerified(!isCurrentVerified)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${
                    isCurrentVerified 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {isCurrentVerified ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                  {isCurrentVerified ? '已手動標記為驗證' : '手動標記為已驗證'}
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 py-4 rounded-xl font-bold hover:bg-gray-50"
              >
                修改內容
              </button>
              <button 
                onClick={confirmDonation}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700"
              >
                確認捐贈
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-8 py-12">
            <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle size={56} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">捐贈成功！</h2>
              <p className="text-gray-500">您的禪時幣已存入您的數位錢包中。</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 max-w-sm mx-auto">
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">本次獲得</p>
              <p className="text-4xl font-bold text-indigo-700">+{evaluation?.credits} ZT</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link to="/market" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all">
                立即探索日本住宿 <ChevronRight size={20} />
              </Link>
              <button onClick={() => setStep(1)} className="text-gray-500 font-medium hover:text-indigo-600">再捐贈一副眼鏡</button>
            </div>
          </div>
        )}
      </div>

      {donations.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-800">
              <History size={20} className="text-indigo-600" />
              <h3 className="text-xl font-bold">您的捐贈歷史</h3>
            </div>
          </div>
          <div className="space-y-4">
            {donations.map((item) => (
              <div key={item.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <Clock size={12} />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleHistoryVerification(item.id)}
                      className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                        item.verified 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {item.verified ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                      {item.verified ? '已驗證' : '標記驗證'}
                    </button>
                    <div className="text-emerald-600 font-bold text-sm">+{item.credits} ZT</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm font-medium mb-2">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.verificationChecklist?.slice(0, 2).map((check: string, idx: number) => (
                    <span key={idx} className="bg-gray-50 text-[10px] text-gray-500 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                      <CheckCircle size={8} /> {check}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MarketPage = () => {
  const [selectedStay, setSelectedStay] = useState<JapanStay | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [currentStays, setCurrentStays] = useState<JapanStay[]>(INITIAL_STAYS);

  const fetchAdvice = async (location: string) => {
    setLoadingAdvice(true);
    try {
      const res = await generateTravelAdvice(location);
      setAdvice(res);
    } catch (e) {
      setAdvice("暫時無法讀取 AI 旅行建議。");
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handlePostFeedback = async () => {
    if (!feedbackInput || !selectedStay) return;
    setIsSubmittingFeedback(true);
    try {
      const tags = await summarizeFeedback(feedbackInput);
      const newReview: Review = {
        id: Date.now().toString(),
        userName: '您',
        rating: 5,
        comment: feedbackInput,
        date: new Date().toISOString().split('T')[0],
        tags: tags
      };

      const updatedStays = currentStays.map(s => 
        s.id === selectedStay.id 
        ? { ...s, reviews: [newReview, ...s.reviews] } 
        : s
      );
      setCurrentStays(updatedStays);
      setFeedbackInput('');
      alert("感謝您的反饋！點數託管已正式解除。");
    } catch (e) {
      alert("提交反饋時出錯，請重試。");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">探索日本</h1>
          <p className="text-gray-500 mt-1">使用您獲得的點數，體驗道地的文化寄宿。</p>
        </div>
        <div className="flex gap-2">
          {['全部', '寺廟', '農場', '城市', '自然'].map(cat => (
            <button key={cat} className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentStays.map((stay) => (
          <div 
            key={stay.id} 
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
            onClick={() => {
              setSelectedStay(stay);
              fetchAdvice(stay.location);
            }}
          >
            <div className="h-56 overflow-hidden relative">
              <img src={stay.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={stay.location} />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-bold text-indigo-600 flex items-center gap-1 shadow-sm">
                {stay.creditCost} ZT
              </div>
              {stay.reviews.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" /> {stay.reviews.length} 則反饋
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin size={12} /> {stay.location}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stay.description}</h3>
                {stay.reviews.length > 0 && (
                  <p className="text-gray-500 text-sm italic line-clamp-2">「{stay.reviews[0].comment}」</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                <span className="text-sm text-gray-500">尚有 {stay.availableDates.length} 個名額</span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">立即預約 →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 relative min-h-[300px]">
                <img src={selectedStay.imageUrl} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedStay(null)}
                  className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  ✕
                </button>
              </div>
              <div className="md:w-1/2 p-8 space-y-8 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedStay.location}</h2>
                    <p className="text-gray-500 mt-2">{selectedStay.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{selectedStay.creditCost} ZT</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">預估費用</p>
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  <h4 className="flex items-center gap-2 font-bold text-amber-800 mb-3">
                    <Sparkles size={18} /> AI 在地見解
                  </h4>
                  {loadingAdvice ? (
                    <div className="flex gap-2 items-center text-amber-600 text-sm">
                      <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      正在生成建議...
                    </div>
                  ) : (
                    <p className="text-sm text-amber-700 leading-relaxed whitespace-pre-line">{advice}</p>
                  )}
                </div>

                {/* 旅客反饋區塊 */}
                <div>
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-gray-800">
                    <MessageSquare size={18} className="text-indigo-600" /> 旅客真實反饋
                  </h4>
                  {selectedStay.reviews.length > 0 ? (
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedStay.reviews.map(review => (
                        <div key={review.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-700">{review.userName}</span>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">「{review.comment}」</p>
                          <div className="flex flex-wrap gap-1">
                            {review.tags.map((tag, idx) => (
                              <span key={idx} className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full border border-indigo-100 font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                      <p className="text-sm text-gray-400">目前尚無評價，您將是第一位體驗者！</p>
                    </div>
                  )}
                </div>

                {/* 提交模擬反饋 */}
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h4 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
                    <Quote size={14} /> 住宿完成？分享您的體驗
                  </h4>
                  <textarea 
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="分享您的住宿感受...（提交後 AI 將提取社群價值標籤）"
                    className="w-full h-24 rounded-xl border-none p-4 text-sm focus:ring-2 focus:ring-indigo-300 outline-none mb-3"
                  />
                  <button 
                    onClick={handlePostFeedback}
                    disabled={!feedbackInput || isSubmittingFeedback}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmittingFeedback ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles size={16} />}
                    送出反饋並完成託管
                  </button>
                </div>

                <div className="mt-auto">
                  <h4 className="font-bold mb-3 text-gray-800">選擇預約日期</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedStay.availableDates.map(date => (
                      <button key={date} className="px-4 py-2 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors text-sm">
                        {new Date(date).toLocaleDateString()}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                       alert("預約成功！點數已進入託管（Escrow）狀態。");
                       setSelectedStay(null);
                    }}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  >
                    使用點數確認預約
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ credits }: { credits: number }) => (
  <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform">
          <Sparkles size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">禪時匯 <span className="text-indigo-600">Exchange</span></span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">我們的使命</Link>
        <Link to="/market" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">日本住宿市場</Link>
        <Link to="/how-it-works" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">交換機制</Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-gray-700">{credits} ZT</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 cursor-pointer hover:scale-105 transition-transform border border-indigo-200">
          <User size={20} />
        </div>
      </div>
    </div>
  </nav>
);

const App = () => {
  const [credits, setCredits] = useState(50);

  useEffect(() => {
    const storedDonations = localStorage.getItem('donations');
    if (storedDonations) {
      try {
        const parsed = JSON.parse(storedDonations);
        const bonusCredits = parsed.reduce((acc: number, item: any) => acc + item.credits, 0);
        setCredits(50 + bonusCredits);
      } catch (e) {}
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar credits={credits} />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/exchange" element={<ExchangeFlow onCreditsEarned={(c) => setCredits(prev => prev + c)} />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/how-it-works" element={
              <div className="max-w-3xl mx-auto space-y-12">
                <h1 className="text-4xl font-bold text-center">信任機制</h1>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">1</div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">物品驗證</h3>
                      <p className="text-gray-600 leading-relaxed">我們利用 Gemini 驅動的 AI 來驗證眼鏡的描述與狀況。我們專注於特定的度數標記與鏡框耐用度，確保每一件捐贈物都能真正幫助到需要的人。</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">2</div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">時間幣發行</h3>
                      <p className="text-gray-600 leading-relaxed">時間幣不僅僅是虛擬貨幣，它們代表了社會影響力。1 ZT 約等於 1 小時的社會價值。一副普通的眼鏡可提供 50-100 ZT，反映了重獲視力對一個人生活的重大改變。</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">3</div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">託管預約與反饋</h3>
                      <p className="text-gray-600 leading-relaxed">當您預約日本住宿時，點數會被暫時託管（Escrow）。完成住宿後，旅客必須提供反饋，系統會利用 AI 分析其真實性與社區價值標籤。確認無誤後，託管點數才會撥付給房東，並正式寫入房東的社區信用紀錄中。</p>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <footer className="border-t border-gray-100 py-12 bg-white mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-50">
              <Sparkles size={20} />
              <span className="font-bold">禪時匯 (ZenTime Exchange) © 2024</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500 font-medium">
              <a href="#" className="hover:text-indigo-600">隱私政策</a>
              <a href="#" className="hover:text-indigo-600">服務條款</a>
              <a href="#" className="hover:text-indigo-600">慈善合作夥伴</a>
              <a href="#" className="hover:text-indigo-600">日本房東網絡</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
