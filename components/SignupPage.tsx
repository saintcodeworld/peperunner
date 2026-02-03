'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import LightRays from './LightRays';
import SignInModal from './SignInModal';
import { generateSolanaWallet, saveWalletToStorage, WalletData } from '../utils/solanaWallet';

const mainLogo = '/pepepe.png';

interface SignupPageProps {
    onWalletGenerated: (wallet: WalletData) => void;
}

const FloatingText: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const floatingItems: any[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Initialize floating items (text and PEPE frogs)
        for (let i = 0; i < 20; i++) {
            floatingItems.push({
                text: i % 3 === 0 ? '🐸' : '3gVTyxKHzeep1uszUp3xj6bY84V4ZcTdbtGioh9fpump',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 25 + 20,
                speedX: (Math.random() - 0.5) * 0.6,
                speedY: (Math.random() - 0.5) * 0.6,
                opacity: Math.random() * 0.4 + 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            floatingItems.forEach(item => {
                item.x += item.speedX;
                item.y += item.speedY;
                item.rotation += item.rotationSpeed;

                // Wrap around edges
                if (item.x < -100) item.x = canvas.width + 100;
                if (item.x > canvas.width + 100) item.x = -100;
                if (item.y < -50) item.y = canvas.height + 50;
                if (item.y > canvas.height + 50) item.y = -50;

                ctx.save();
                ctx.translate(item.x, item.y);
                ctx.rotate(item.rotation);
                ctx.globalAlpha = item.opacity;

                if (item.text === '🐸') {
                    ctx.font = `${item.size}px serif`;
                    ctx.fillStyle = '#4ade80';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(item.text, 0, 0);
                } else {
                    ctx.font = `${item.size * 0.6}px monospace`;
                    ctx.fillStyle = '#86efac';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Show truncated version of wallet address with better visibility
                    const shortText = '3gVTyxK...pump';
                    ctx.fillText(shortText, 0, 0);
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ filter: 'blur(0.5px)' }}
        />
    );
};

const FloatingMoltModels: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const models: any[] = [];
        const modelImage = new Image();
        modelImage.src = mainLogo;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Initialize models
        for (let i = 0; i < 40; i++) {
            models.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 40 + 20,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.2 + 0.1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            models.forEach(model => {
                model.x += model.speedX;
                model.y += model.speedY;
                model.rotation += model.rotationSpeed;

                // Wrap around edges
                if (model.x < -model.size) model.x = canvas.width + model.size;
                if (model.x > canvas.width + model.size) model.x = -model.size;
                if (model.y < -model.size) model.y = canvas.height + model.size;
                if (model.y > canvas.height + model.size) model.y = -model.size;

                ctx.save();
                ctx.translate(model.x, model.y);
                ctx.rotate(model.rotation);
                ctx.globalAlpha = model.opacity;

                if (modelImage.complete) {
                    ctx.drawImage(modelImage, -model.size / 2, -model.size / 2, model.size, model.size);
                } else {
                    ctx.fillStyle = '#166534';
                    ctx.beginPath();
                    ctx.arc(0, 0, model.size / 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ filter: 'blur(1px)' }}
        />
    );
};

const SignupPage: React.FC<SignupPageProps> = ({ onWalletGenerated }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedWallet, setGeneratedWallet] = useState<WalletData | null>(null);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [copied, setCopied] = useState<'public' | 'private' | null>(null);
    const [hasBackedUp, setHasBackedUp] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);


    const handleGenerateWallet = useCallback(async () => {
        setIsGenerating(true);

        // Add a small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const wallet = generateSolanaWallet();
            setGeneratedWallet(wallet);
            saveWalletToStorage(wallet);
        } catch (error) {
            console.error('Failed to generate wallet:', error);
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const handleCopy = useCallback(async (type: 'public' | 'private') => {
        if (!generatedWallet) return;

        const text = type === 'public' ? generatedWallet.publicKey : generatedWallet.privateKey;
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    }, [generatedWallet]);

    const handleContinue = useCallback(() => {
        if (generatedWallet) {
            onWalletGenerated(generatedWallet);
        }
    }, [generatedWallet, onWalletGenerated]);

    const handleSignIn = useCallback((wallet: WalletData) => {
        saveWalletToStorage(wallet);
        onWalletGenerated(wallet);
    }, [onWalletGenerated]);



    return (
        <div
            className="min-h-screen flex flex-col text-white selection:bg-emerald-500/30 relative overflow-hidden"
            style={{
                backgroundImage: 'url(/pepe_signup_bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Dark overlay for better readability */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* Background Floating Text and Models */}
            <FloatingText />
            <FloatingMoltModels />

            <div className="absolute inset-0 pointer-events-none z-[1] opacity-30">
                <LightRays raysColor="#166534" raysSpeed={0.5} />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                {!generatedWallet ? (
                    /* Initial State - Generate Wallet Button */
                    <div className="text-center max-w-lg w-full">
                        {/* Logo/Brand */}
                        <div className="mb-12">
                            <div className="mb-6 flex justify-center">
                                <img src={mainLogo} alt="$PRUN MADE BY $PFP DEV" className="w-24 h-24 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                            </div>
                            <h1 className="text-5xl font-black text-emerald-400 mb-3 tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                                $PRUN MADE BY $PFP DEV
                            </h1>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Generate Wallet Button */}
                            <button
                                onClick={handleGenerateWallet}
                                disabled={isGenerating}
                                className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 border-2 border-emerald-400 text-white font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:shadow-[0_6px_30px_rgba(34,197,94,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Initializing...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">🐸</span>
                                        SIGN UP
                                        <span className="ml-2">🐸</span>
                                    </>
                                )}
                            </button>

                            {/* Sign In Button */}
                            <button
                                onClick={() => setShowSignInModal(true)}
                                className="w-full h-14 text-lg rounded-xl bg-emerald-950/50 border-2 border-emerald-500/40 text-emerald-400 font-bold uppercase tracking-wider hover:bg-emerald-900/50 hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_4px_20px_rgba(34,197,94,0.2)] transition-all duration-300 flex items-center justify-center"
                            >
                                <span className="mr-2">🔑</span>
                                LOGIN
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Wallet Generated State */
                    <div className="w-full max-w-2xl">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-900/50 border border-emerald-500/30 shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-6 transform rotate-3">
                                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-black text-emerald-400 mb-2 uppercase tracking-tighter">Access Granted</h2>
                            <p className="text-emerald-300/70 font-medium italic">Your credentials have been generated</p>
                        </div>

                        {/* Wallet Card */}
                        <div className="bg-emerald-950/40 backdrop-blur-2xl rounded-[2.5rem] border border-emerald-500/20 p-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors duration-500" />

                            {/* Public Key */}
                            <div className="mb-8 relative z-10">
                                <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-4 ml-1">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    Public Key
                                </label>
                                <div className="flex items-center gap-4">
                                    <code className="flex-1 px-6 py-5 bg-black/40 backdrop-blur-md rounded-2xl text-emerald-300 font-mono text-sm break-all border border-emerald-500/10 leading-relaxed group-hover:border-emerald-500/20 transition-all duration-300">
                                        {generatedWallet.publicKey}
                                    </code>
                                    <button
                                        onClick={() => handleCopy('public')}
                                        className="h-14 w-14 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/10 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all duration-300 shadow-lg group/btn"
                                        title="Copy public key"
                                    >
                                        {copied === 'public' ? (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 transform group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Private Key */}
                            <div className="mb-10 relative z-10">
                                <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-4 ml-1">
                                    <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                                    Private Key <span className="text-red-500/80">(Keep Secret!)</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <code className={`flex-1 px-6 py-5 bg-black/40 backdrop-blur-md rounded-2xl font-mono text-sm break-all border border-emerald-500/10 transition-all duration-500 ${showPrivateKey ? 'text-emerald-400 border-emerald-500/30' : 'text-emerald-900/40 blur-md select-none'}`}>
                                        {showPrivateKey ? generatedWallet.privateKey : 'x'.repeat(48)}
                                    </code>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                                            className="h-14 w-14 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/10 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all duration-300 shadow-lg group/btn"
                                            title={showPrivateKey ? 'Hide' : 'Show'}
                                        >
                                            {showPrivateKey ? (
                                                <svg className="w-6 h-6 transform group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 transform group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleCopy('private')}
                                            className="h-14 w-14 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/10 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all duration-300 shadow-lg group/btn"
                                            title="Copy"
                                        >
                                            {copied === 'private' ? (
                                                <svg className="w-6 h-6 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 transform group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 mb-8 flex gap-6 relative z-10 transition-all duration-300 hover:bg-emerald-500/10 group/warn">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-900/50 flex items-center justify-center flex-shrink-0 group-hover/warn:bg-emerald-800/60 transition-colors">
                                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="text-sm">
                                    <p className="text-emerald-400 font-black mb-1.5 uppercase tracking-tight text-base">Security Alert</p>
                                    <p className="text-emerald-300/60 leading-relaxed font-medium italic">Save your private key now. If you lose it, your funds are gone forever. PEPE trusts no one.</p>
                                </div>
                            </div>

                            {/* Backup Confirmation */}
                            <label className="flex items-center gap-5 p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 cursor-pointer hover:bg-emerald-900/30 mb-8 transition-all group/check relative z-10">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={hasBackedUp}
                                        onChange={(e) => setHasBackedUp(e.target.checked)}
                                        className="w-7 h-7 rounded-xl border-2 border-emerald-500/30 bg-black/40 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 transition-all cursor-pointer appearance-none checked:bg-emerald-500/80"
                                    />
                                    {hasBackedUp && (
                                        <svg className="absolute left-1.5 w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-emerald-300/80 font-bold uppercase tracking-widest">
                                    I have saved my credentials safely 🐸
                                </span>
                            </label>

                            {/* Continue Button */}
                            <button
                                onClick={handleContinue}
                                disabled={!hasBackedUp}
                                className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 border border-emerald-400 text-white font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_10px_40px_rgba(34,197,94,0.6)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:scale-100 relative z-10"
                            >
                                Continue to Dashboard
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {/* Sign In Modal */}
            <SignInModal
                isOpen={showSignInModal}
                onClose={() => setShowSignInModal(false)}
                onSignIn={handleSignIn}
            />
        </div>
    );
};

export default SignupPage;
