
import React, { useState } from 'react';
import { WalletData } from '../utils/solanaWallet';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: WalletData | null;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, wallet }) => {
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    if (!isOpen || !wallet) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-emerald-950/40 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(16,185,129,0.1)] animate-in zoom-in-95 duration-300 overflow-hidden">
                {/* Decorative PEPE Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-tight flex items-center gap-3">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            Account <span className="text-white">Settings</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition-all duration-300 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Public Key */}
                        <div className="group">
                            <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mb-3 block ml-1">
                                Wallet Address (Public Key)
                            </label>
                            <div className="bg-black/40 backdrop-blur-md border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4 group-hover:border-emerald-500/30 transition-all duration-300">
                                <code className="flex-1 text-sm text-emerald-300 font-mono break-all leading-relaxed">
                                    {wallet.publicKey}
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(wallet.publicKey)}
                                    className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-300 shadow-sm"
                                    title="Copy Address"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Private Key */}
                        <div className="group">
                            <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mb-3 block ml-1">
                                Private Key <span className="text-red-500/80">(KEEP SECRET)</span>
                            </label>
                            <div className="bg-black/40 backdrop-blur-md border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4 relative group-hover:border-emerald-500/30 transition-all duration-300">
                                <code className={`flex-1 text-sm font-mono break-all leading-relaxed ${showPrivateKey ? 'text-emerald-400' : 'text-emerald-900/40 blur-md select-none'}`}>
                                    {showPrivateKey ? wallet.privateKey : 'x'.repeat(48)}
                                </code>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                                        className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-300"
                                        title={showPrivateKey ? "Hide Private Key" : "Show Private Key"}
                                    >
                                        {showPrivateKey ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(wallet.privateKey)}
                                        className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-300"
                                        title="Copy Private Key"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 ml-1">
                                <div className="w-1 h-1 bg-red-500/40 rounded-full animate-pulse" />
                                <p className="text-[10px] text-emerald-500/50 leading-relaxed">
                                    Never share your private key. This key grants full access to your funds. PEPE stays safe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
