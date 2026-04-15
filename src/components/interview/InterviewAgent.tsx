"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { vapi } from "@/lib/vapi.sdk";
import { interviewerConfig } from "@/lib/interview/constants";
import IconifyIcon from "@/components/IconifyIcon";
import { createInterviewFeedback } from "@/lib/interview/actions";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const InterviewAgent = ({
    userName,
    userId,
    interviewId,
    feedbackId,
    type,
    questions,
    interviewTitle,
}: {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
    interviewTitle?: string;
}) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [generating, setGenerating] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const lastAssistantMsg = messages.filter(m => m.role === "assistant").slice(-1)[0]?.content || "";
    const lastUserMsg = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";

    // Timer
    useEffect(() => {
        if (callStatus === CallStatus.ACTIVE) {
            timerRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callStatus]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: { type: string, transcriptType?: string, role: "user" | "assistant", transcript: string }) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: Error) => console.log("VAPI Error:", error);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    // Track last messages by role
    useEffect(() => {
        const handleGenerateFeedback = async (msgs: SavedMessage[]) => {
            setGenerating(true);
            try {
                const response = await createInterviewFeedback({
                    interviewId: interviewId!,
                    userId: userId!,
                    transcript: msgs,
                    feedbackId: feedbackId
                });
                
                if (response.success && response.feedbackId) {
                    router.push(`/ai-interview/${interviewId}/feedback`);
                } else {
                    console.error("Error from feedback API:", response.error);
                    router.push("/ai-interview");
                }
            } catch (err) {
                console.error("Error saving feedback:", err);
                router.push("/ai-interview");
            }
        };

        if (callStatus === CallStatus.FINISHED) {
            // If the call dropped instantly or no conversation happened, let the user try again
            if (messages.length === 0 && !generating) {
                console.warn("Call finished without any conversation. Resetting state so you can try again.");
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCallStatus(CallStatus.INACTIVE);
                return;
            }

            if (type === "generate") {
                router.push("/ai-interview");
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [callStatus, feedbackId, interviewId, messages, router, type, userId, generating]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === "generate") {
            await vapi.start(
                undefined, undefined, undefined,
                process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
                {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    },
                }
            );
        } else {
            let formattedQuestions = "";
            if (questions) {
                formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
            }
            await vapi.start(interviewerConfig, {
                variableValues: { questions: formattedQuestions },
            });
        }
    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    // ─── PRE-CALL STATE ───
    if (callStatus === CallStatus.INACTIVE) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 gap-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                        <IconifyIcon icon="solar:microphone-3-linear" className="text-5xl text-white" />
                    </div>
                </div>
                <div className="text-center max-w-sm">
                    <h2 className="text-3xl font-heading font-medium text-slate-900 tracking-tighter mb-4">
                        {type === "generate" ? "Start Interview" : "Ready to Begin"}
                    </h2>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">
                        {type === "generate"
                            ? "Share your preferences and our AI will create a custom interview for you."
                            : "Make sure you're in a quiet space with a working microphone before starting."}
                    </p>
                </div>
                <button
                    onClick={handleCall}
                    className="group relative flex items-center gap-3 px-12 py-5 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 skew-x-12"></div>
                    <IconifyIcon icon="solar:phone-calling-linear" className="text-xl relative z-10" />
                    <span className="relative z-10">{type === "generate" ? "Start Now" : "Begin Session"}</span>
                </button>
            </div>
        );
    }

    // ─── CONNECTING STATE ───
    if (callStatus === CallStatus.CONNECTING) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-8">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <IconifyIcon icon="solar:link-linear" className="text-2xl text-slate-400" />
                    </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                    Connecting...
                </p>
            </div>
        );
    }

    // ─── GENERATING FEEDBACK STATE ───
    if (generating) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-8">
                <div className="relative">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center">
                        <IconifyIcon icon="solar:chart-square-linear" className="text-3xl text-primary" />
                    </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Generating Feedback...
                </p>
            </div>
        );
    }

    // ─── ACTIVE / FINISHED INTERVIEW (FoloUp-style split view) ───
    return (
        <div className="w-full">
            {/* Top bar */}
            <div className="bg-white border-b border-slate-100 rounded-t-[2.5rem] overflow-hidden">
                {/* Progress bar */}
                <div className="h-1 bg-slate-50 relative">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((elapsedTime / 600) * 100, 100)}%` }}
                        className="absolute left-0 top-0 h-full bg-primary"
                    />
                </div>

                {/* Title bar */}
                <div className="flex items-center justify-between py-6 px-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                            <IconifyIcon icon="solar:videocamera-record-linear" />
                        </div>
                        <div>
                            <h3 className="font-heading font-medium text-slate-900 text-sm tracking-tight">
                                {interviewTitle || "Interview Session"}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                <IconifyIcon icon="solar:clock-circle-linear" />
                                <span>{formatTime(elapsedTime)}</span>
                            </div>
                        </div>
                    </div>
                    {callStatus === CallStatus.ACTIVE && (
                        <div className="px-4 py-2 rounded-full bg-red-50 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Live Recording</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Split transcript view */}
            <div className="bg-white grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                {/* LEFT: AI Interviewer */}
                <div className="p-10 border-r border-slate-50 flex flex-col">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <IconifyIcon icon="solar:bot-linear" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interviewer</span>
                    </div>
                    <div className="flex-1 flex items-start">
                        <p className="text-slate-900 font-medium text-lg leading-relaxed tracking-tight">
                            {lastAssistantMsg || (
                                <span className="text-slate-200 italic font-light">Synthesizing query...</span>
                            )}
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className={`relative w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center transition-all duration-500 ${isSpeaking ? "ring-2 ring-primary ring-offset-4" : ""}`}>
                            <Image
                                src="/ai-avatar.png"
                                alt="Interviewer"
                                width={48}
                                height={40}
                                className="object-cover"
                            />
                            {isSpeaking && (
                                <div className="absolute -top-1 -right-1 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: You */}
                <div className="p-10 flex flex-col bg-slate-50/30">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <IconifyIcon icon="solar:user-linear" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate</span>
                    </div>
                    <div className="flex-1 flex items-start">
                        <p className="text-slate-900 font-medium text-lg leading-relaxed tracking-tight">
                            {lastUserMsg || (
                                <span className="text-slate-200 italic font-light">Awaiting response...</span>
                            )}
                        </p>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <div className={`w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center transition-all duration-500 ${!isSpeaking && lastUserMsg ? "ring-2 ring-primary ring-offset-4" : ""}`}>
                            <IconifyIcon icon="solar:user-bold" className="text-2xl text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="bg-white border-t border-slate-100 rounded-b-[2.5rem] flex justify-between items-center py-8 px-10">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                    Unipath School
                </div>
                {callStatus === CallStatus.ACTIVE ? (
                    <button
                        onClick={handleDisconnect}
                        className="group flex items-center gap-3 px-8 py-4 bg-slate-50 hover:bg-red-50 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                    >
                        End Session
                        <IconifyIcon icon="solar:stop-circle-linear" className="text-lg group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <IconifyIcon icon="solar:check-read-linear" className="text-lg text-[#10B981]" />
                        Session Complete
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewAgent;
