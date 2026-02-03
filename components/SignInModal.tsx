'use client';
import React, { useState } from 'react';
import DotGrid from './DotGrid';
import { restoreWalletFromPrivateKey, WalletData } from '../utils/solanaWallet';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: (wallet: WalletData) => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignIn }) => {
    const [privateKey, setPrivateKey] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState('');
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    const handleSignIn = async () => {
        if (!privateKey.trim()) {
            setError('Please enter your private key');
            return;
        }

        setIsSigningIn(true);
        setError('');

        try {
            // Add a small delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 1000));

            const wallet = restoreWalletFromPrivateKey(privateKey.trim());
            onSignIn(wallet);
            onClose();
        } catch (err) {
            setError('Invalid private key. Please check and try again.');
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSigningIn) {
            handleSignIn();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-300">
                <div className="bg-emerald-950/40 backdrop-blur-2xl rounded-3xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden">
                    {/* Decorative PEPE Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="p-8 border-b border-emerald-500/10 relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-emerald-400 mb-2 uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    Sign <span className="text-white">In</span>
                                </h2>
                                <p className="text-emerald-300/60 text-xs font-medium uppercase tracking-wider">Access your PEPE runner account</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition-all duration-300 group"
                                title="Close"
                            >
                                <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8 relative z-10">
                        {/* Private Key Input */}
                        <div className="mb-8 group">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mb-3 ml-1">
                                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Private Key
                            </label>
                            <div className="relative">
                                <textarea
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter your private key (Base58 format)"
                                    className="w-full px-5 py-4 bg-black/40 backdrop-blur-md border border-emerald-500/10 rounded-2xl text-emerald-300 font-mono text-sm leading-relaxed placeholder:text-emerald-900/40 focus:border-emerald-500/40 focus:outline-none resize-none transition-all duration-300"
                                    rows={3}
                                />
                                <button
                                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                                    className="absolute bottom-4 right-4 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-300"
                                    title={showPrivateKey ? 'Hide private key' : 'Show private key'}
                                >
                                    {showPrivateKey ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-red-900/50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-red-400 font-bold text-xs uppercase tracking-tight mb-1">Error</p>
                                        <p className="text-red-300/70 text-sm leading-relaxed">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Notice */}
                        {!error && (
                            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-8">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-tight mb-1">Security Notice</p>
                                        <p className="text-emerald-300/60 leading-relaxed">
                                            Only enter your key on official PEPE links. Stay safe, little frog.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                disabled={isSigningIn}
                                className="flex-1 h-14 rounded-2xl bg-emerald-900/20 border border-emerald-500/10 text-emerald-400 font-bold uppercase tracking-widest hover:bg-emerald-800/30 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSignIn}
                                disabled={isSigningIn || !privateKey.trim()}
                                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 border border-emerald-400 text-white font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSigningIn ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Logging In...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign In</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
