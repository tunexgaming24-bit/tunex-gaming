import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, PlusCircle, ArrowUpRight, Clock, Shield, Check, X, CreditCard, Smartphone } from 'lucide-react';
import { GlassCard, GradientButton } from '../components/SharedUI';
import { motion, AnimatePresence } from 'motion/react';

const Wallet: React.FC = () => {
  const { user, setPage, transactions, paymentConfig, addTransaction } = useApp();
  const [view, setView] = useState<'main' | 'deposit' | 'withdraw'>('main');
  const [depositStep, setDepositStep] = useState(0); // 0: Amount, 1: Selection, 2: Details
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET'>('BKASH');
  const [isAgent, setIsAgent] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [receiverNumber, setReceiverNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myTransactions = transactions.filter(t => t.userId === user?.id);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) < paymentConfig.minDeposit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      addTransaction({
        userId: user!.id,
        type: 'DEPOSIT',
        amount: Number(amount),
        method,
        transactionId,
        senderNumber: senderNumber + (isAgent ? ' (Agent)' : '')
      });
      setIsSubmitting(false);
      setView('main');
      setDepositStep(0);
      setAmount('');
      setTransactionId('');
      setSenderNumber('');
    }, 1000);
  };

  const depositMethods = [
    { 
      id: 'BKASH', 
      name: paymentConfig.bkashLabel || 'বিকাশ', 
      logo: paymentConfig.bkashLogo, 
      color: '#E2136E',
      agent: false
    },
    { 
      id: 'BKASH_AGENT', 
      name: (paymentConfig.bkashLabel || 'বিকাশ') + ' এজেন্ট', 
      logo: paymentConfig.bkashLogo, 
      color: '#E2136E',
      tag: '1.8% Cashback',
      min: 'Min: 300 BDT',
      agent: true
    },
    { 
      id: 'NAGAD', 
      name: paymentConfig.nagadLabel || 'নগদ', 
      logo: paymentConfig.nagadLogo, 
      color: '#F04923',
      agent: false
    },
    { 
      id: 'NAGAD_AGENT', 
      name: (paymentConfig.nagadLabel || 'নগদ') + ' এজেন্ট', 
      logo: paymentConfig.nagadLogo, 
      color: '#F04923',
      tag: '1.3% Cashback',
      min: 'Min: 300 BDT',
      agent: true
    },
    { 
      id: 'ROCKET', 
      name: paymentConfig.rocketLabel || 'রকেট', 
      logo: paymentConfig.rocketLogo, 
      color: '#8C338A',
      agent: false
    },
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) < paymentConfig.minWithdraw) return;
    if (user!.coins < Number(amount)) return;
    setIsSubmitting(true);
    setTimeout(() => {
      addTransaction({
        userId: user!.id,
        type: 'WITHDRAW',
        amount: Number(amount),
        method,
        receiverNumber
      });
      setIsSubmitting(false);
      setView('main');
      setAmount('');
      setReceiverNumber('');
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
      {/* Header */}
      <div className={`flex items-center gap-4 mb-8 px-1 transition-all ${view === 'deposit' ? 'bg-[#1a1c1e] -mx-4 -mt-4 p-4 sticky top-0 z-50 shadow-lg' : ''}`}>
        <button 
          onClick={() => {
            if (view === 'deposit' && depositStep > 0) {
              setDepositStep(depositStep - 1);
            } else if (view === 'main') {
              setPage('profile');
            } else {
              setView('main');
              setDepositStep(0);
            }
          }} 
          className={`p-3 rounded-2xl text-white active:scale-90 ${view === 'deposit' ? '' : 'bg-white/5 border border-white/5'}`}
        >
           <ArrowLeft size={20} />
        </button>
        <h2 className={`text-xl font-bold text-white tracking-tight ${view === 'deposit' ? '' : 'italic font-black text-2xl uppercase tracking-tighter leading-none'}`}>
          {view === 'deposit' ? 'Deposit' : (
            <>My<br /><span className="text-green-500">Wallet</span></>
          )}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {view === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Balance Card */}
            <GlassCard className="p-8 border-green-500/30 bg-green-500/[0.03] text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CreditCard size={80} />
               </div>
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">Available Balance</p>
               <h3 className="text-5xl font-black text-white italic tracking-tighter mb-8 leading-none">৳{user.coins.toFixed(2)}</h3>
               <div className="grid grid-cols-2 gap-4">
                  <GradientButton onClick={() => setView('deposit')} className="h-14 font-black italic tracking-widest gap-2">
                     <PlusCircle size={18} /> DEPOSIT
                  </GradientButton>
                  <button onClick={() => setView('withdraw')} className="h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-white font-black italic tracking-widest hover:bg-white/10 transition-all">
                     <ArrowUpRight size={18} className="text-green-500" /> WITHDRAW
                  </button>
               </div>
            </GlassCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
               <GlassCard className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                     <Check size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Tokens</p>
                     <p className="text-sm font-black text-white italic">{user.tokens}</p>
                  </div>
               </GlassCard>
               <GlassCard className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                     <Shield size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Status</p>
                     <p className="text-sm font-black text-blue-500 italic uppercase">Verified</p>
                  </div>
               </GlassCard>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
               <div className="flex justify-between items-center px-2">
                  <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">Recent Transactions</h3>
                  <Clock size={16} className="text-gray-700" />
               </div>
               
               <div className="space-y-3">
                  {myTransactions.length > 0 ? myTransactions.map(t => (
                    <GlassCard key={t.id} className="p-4 flex justify-between items-center bg-white/[0.01]">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                             t.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 
                             t.type === 'WITHDRAW' ? 'bg-orange-500/10 text-orange-500' :
                             'bg-blue-500/10 text-blue-500'
                          }`}>
                             {t.type === 'DEPOSIT' ? <PlusCircle size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <div>
                             <h4 className="text-[11px] font-black text-white uppercase italic tracking-tighter leading-none mb-1">{t.type}</h4>
                             <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{new Date(t.time).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-sm font-black italic tracking-tighter ${
                             t.type === 'DEPOSIT' || t.type === 'EARNING' ? 'text-green-500' : 'text-orange-500'
                          }`}>
                             {t.type === 'DEPOSIT' || t.type === 'EARNING' ? '+' : '-'}৳{t.amount}
                          </p>
                          <p className={`text-[7px] font-black uppercase tracking-widest mt-0.5 ${
                             t.status === 'COMPLETED' ? 'text-green-500' : 
                             t.status === 'PENDING' ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                             {t.status}
                          </p>
                       </div>
                    </GlassCard>
                  )) : (
                    <div className="py-12 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/5 text-center">
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic">No history found</p>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        )}

        {view === 'deposit' && (
          <motion.div key="deposit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pt-2">
            {depositStep === 0 ? (
              <GlassCard className="p-6 bg-blue-500/[0.03] border-blue-500/30">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Deposit Funds</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6 px-1">Minimum deposit ৳{paymentConfig.minDeposit}</p>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest px-1">Enter Amount (৳)</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-white font-black focus:outline-none focus:border-blue-500/50"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <GradientButton 
                    fullWidth 
                    className="h-14 font-black italic tracking-widest"
                    disabled={!amount || Number(amount) < paymentConfig.minDeposit}
                    onClick={() => setDepositStep(1)}
                  >
                    CONTINUE
                  </GradientButton>
                </div>
              </GlassCard>
            ) : depositStep === 1 ? (
              <div className="space-y-6 -mx-4 -mt-4 p-4 min-h-screen bg-slate-50 text-slate-900 rounded-t-[3rem]">
                <div className="flex justify-center mb-6">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
                    <X size={20} />
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
                  <p className="text-sm font-semibold text-slate-400 mb-1">{user.name}</p>
                  <h3 className="text-3xl font-black text-cyan-600 tracking-tight leading-none mb-2">{Number(amount).toFixed(2)} BDT</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Invoice: INV{(Math.random() * 10000000000000).toFixed(0)}</p>
                </div>

                <div className="space-y-4">
                  <div className="border-b-2 border-cyan-500 inline-block pb-2 px-1">
                    <span className="text-sm font-bold text-cyan-600 tracking-tight">Mobile Banking</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {depositMethods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setMethod(m.id.replace('_AGENT', '') as any);
                          setIsAgent(m.agent || false);
                          setDepositStep(2);
                        }}
                        className="bg-white p-3 py-5 rounded-2xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-2 aspect-[4/3] group active:scale-95 transition-all relative overflow-visible"
                      >
                        {m.tag && (
                          <div className="absolute -top-2 -right-1 bg-rose-100 text-[#E2136E] text-[7px] font-black px-2 py-0.5 rounded-lg border border-rose-200 z-10">
                             🎁 {m.tag}
                          </div>
                        )}
                        {m.logo && m.logo.length > 0 ? (
                          <img src={m.logo} alt={m.name} className="h-8 w-auto object-contain mb-1" />
                        ) : (
                          <Smartphone size={24} className="text-slate-300" />
                        )}
                        <span className="text-[11px] font-bold text-slate-600 tracking-tight">{m.name}</span>
                        {m.min && <span className="text-[7px] text-rose-500 font-bold uppercase tracking-tighter">{m.min}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-center gap-2 text-slate-400">
                  <Shield size={14} className="text-yellow-500" />
                  <span className="text-[10px] font-medium tracking-tight">Your payment is secured with 256-bit encryption</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6 -mx-4 -mt-4 p-4 min-h-screen bg-slate-50 text-slate-900 rounded-t-[3rem]">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 flex justify-between items-start">
                   <div>
                      <p className="text-sm font-semibold text-slate-400 mb-1">{user.name}</p>
                      <h3 className="text-2xl font-black text-cyan-600 tracking-tight leading-none mb-2">{Number(amount).toFixed(2)} BDT</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Invoice: INV{(Math.random() * 10000000000000).toFixed(0)}</p>
                   </div>
                   {depositMethods.find(m => m.id === (isAgent ? method + '_AGENT' : method))?.logo ? (
                     <img 
                      src={depositMethods.find(m => m.id === (isAgent ? method + '_AGENT' : method))?.logo} 
                      className="h-10 w-auto object-contain" 
                     />
                   ) : (
                     <Smartphone size={32} className="text-slate-300" />
                   )}
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 px-1">Transaction ID</label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500"
                        placeholder="Enter your transaction ID"
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 px-1">Sender Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500"
                        placeholder="Enter sender phone number (01XXXXXXXXX)"
                        value={senderNumber}
                        onChange={e => setSenderNumber(e.target.value)}
                      />
                   </div>

                   <button 
                     onClick={handleDeposit}
                     disabled={!transactionId || !senderNumber || isSubmitting}
                     className="w-full h-14 bg-cyan-500 rounded-2xl text-white font-bold text-lg shadow-[0_4px_12px_rgba(6,182,212,0.3)] active:scale-95 transition-all disabled:opacity-50"
                   >
                      {isSubmitting ? 'Verifying...' : 'Verify Payment'}
                   </button>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                   <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 text-xs font-bold shrink-0 mt-0.5">1</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">Dial *247# or open the <span className="text-cyan-600 font-bold">{((method === 'BKASH' ? paymentConfig.bkashLabel : method === 'NAGAD' ? paymentConfig.nagadLabel : paymentConfig.rocketLabel) || method).toLowerCase()}</span> app.</p>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 text-xs font-bold shrink-0 mt-0.5">2</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">Choose: <span className="text-cyan-600 font-bold">Send Money</span></p>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 text-xs font-bold shrink-0 mt-0.5">3</div>
                      <div className="flex-1 flex items-center justify-between">
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">Enter the Number: <span className="text-cyan-600 font-bold">{(paymentConfig as any)[method.toLowerCase()]}</span></p>
                        <button 
                          onClick={() => navigator.clipboard.writeText((paymentConfig as any)[method.toLowerCase()])}
                          className="px-2 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-lg border border-cyan-100"
                        >
                          Copy
                        </button>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 text-xs font-bold shrink-0 mt-0.5">4</div>
                      <div className="flex-1 flex items-center justify-between">
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">Enter the Amount: <span className="text-cyan-600 font-bold">{Number(amount).toFixed(2)} BDT</span></p>
                        <button 
                          onClick={() => navigator.clipboard.writeText(Number(amount).toFixed(2))}
                          className="px-2 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-lg border border-cyan-100"
                        >
                          Copy
                        </button>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 text-xs font-bold shrink-0 mt-0.5">5</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">Now enter your <span className="text-cyan-600 font-bold">{((method === 'BKASH' ? paymentConfig.bkashLabel : method === 'NAGAD' ? paymentConfig.nagadLabel : paymentConfig.rocketLabel) || method).toLowerCase()}</span> PIN to confirm.</p>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 text-xs font-bold shrink-0 mt-0.5">6</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">Put the Transaction ID in the box above and press Verify</p>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {view === 'withdraw' && (
          <motion.div key="withdraw" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
             <GlassCard className="p-6 bg-orange-500/[0.03] border-orange-500/30">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Withdraw Earnings</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">Minimum withdraw ৳{paymentConfig.minWithdraw}</p>
                
                <form onSubmit={handleWithdraw} className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] px-1">Withdraw Method</label>
                       <div className="grid grid-cols-3 gap-2">
                          {(['BKASH', 'NAGAD', 'ROCKET'] as const).map(m => (
                             <button
                               key={m}
                               type="button"
                               onClick={() => setMethod(m)}
                               className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                 method === m ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'
                               }`}
                             >
                                <Smartphone size={16} />
                                <span className="text-[8px] font-black uppercase text-center px-1">
                                  {m === 'BKASH' ? paymentConfig.bkashLabel : m === 'NAGAD' ? paymentConfig.nagadLabel : paymentConfig.rocketLabel}
                                </span>
                             </button>
                          ))}
                       </div>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-1">
                         <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest px-1">Amount to Withdraw (৳)</label>
                         <input 
                           required
                           type="number" 
                           min={paymentConfig.minWithdraw}
                           max={user?.coins}
                           className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-white font-black"
                           placeholder="Enter Amount"
                           value={amount}
                           onChange={e => setAmount(e.target.value)}
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest px-1">Receiver Mobile Number</label>
                         <input 
                           required
                           type="tel" 
                           className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-white font-black"
                           placeholder="01XXXXXXXXX"
                           value={receiverNumber}
                           onChange={e => setReceiverNumber(e.target.value)}
                         />
                      </div>
                   </div>

                   <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <p className="text-[9px] text-orange-400 font-medium italic leading-relaxed">
                         * You can withdraw 2-3 times daily. All requests are processed by midnight (12:00 AM).
                      </p>
                   </div>

                   <GradientButton fullWidth variant="ghost" className="h-14 font-black italic tracking-widest border-orange-500/30 text-orange-500 bg-orange-500/5" disabled={isSubmitting}>
                      {isSubmitting ? 'PROCESSING...' : 'REQUEST WITHDRAW'}
                   </GradientButton>
                </form>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
