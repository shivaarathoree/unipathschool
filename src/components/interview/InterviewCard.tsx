import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import DisplayTechIcons from "./DisplayTechIcons";
import { getRandomInterviewCover } from "@/lib/interview/utils";
import { getFeedbackByInterviewId } from "@/lib/interview/actions";

const InterviewCard = async ({
    interviewId,
    userId,
    role,
    type,
    techstack,
    createdAt,
}: {
    interviewId?: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt?: string;
}) => {
    const feedback =
        userId && interviewId
            ? await getFeedbackByInterviewId({ interviewId, userId })
            : null;

    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

    const badgeStyles: Record<string, string> = {
        Behavioral: "bg-blue-500/10 text-blue-500",
        Mixed: "bg-purple-500/10 text-purple-500",
        Technical: "bg-emerald-500/10 text-emerald-600",
    };

    const formattedDate = dayjs(feedback?.createdAt || createdAt).isValid() 
        ? dayjs(feedback?.createdAt || createdAt).format("MMM D, YYYY")
        : "N/A";

    const scoreColor = feedback?.totalScore
        ? feedback.totalScore >= 80
            ? "text-[#10B981]"
            : feedback.totalScore >= 60
                ? "text-primary"
                : "text-[#D97706]"
        : "text-slate-400";

    return (
        <div className="w-[340px] max-sm:w-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
            <div className="p-6 flex flex-col gap-4">
                {/* Top row: avatar + badge */}
                <div className="flex items-start justify-between">
                    <Image
                        src={getRandomInterviewCover()}
                        alt="cover"
                        width={56}
                        height={56}
                        className="rounded-xl object-cover w-14 h-14"
                    />
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyles[normalizedType] || "bg-slate-50 text-slate-500"}`}>
                        {normalizedType}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-slate-900 text-lg capitalize leading-tight">
                    {role} Interview
                </h3>

                {/* Date & Score row */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <Image src="/calendar.svg" width={14} height={14} alt="date" />
                        {formattedDate}
                    </span>
                    <span className={`flex items-center gap-1.5 font-bold ${scoreColor}`}>
                        <Image src="/star.svg" width={14} height={14} alt="score" />
                        {feedback?.totalScore || "---"}/100
                    </span>
                </div>

                {/* Assessment preview */}
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-light">
                    {feedback?.finalAssessment ||
                        "You haven\u0027t taken this interview yet. Take it now to improve your skills."}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <DisplayTechIcons techStack={techstack} />

                <Link
                    href={
                        feedback
                            ? `/ai-interview/${interviewId}/feedback`
                            : `/ai-interview/${interviewId}`
                    }
                    className="bg-slate-900 hover:bg-primary text-white text-[10px] px-5 py-2.5 rounded-full font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-lg"
                >
                    {feedback ? "Feedback" : "Start"}
                </Link>
            </div>
        </div>
    );
};

export default InterviewCard;
