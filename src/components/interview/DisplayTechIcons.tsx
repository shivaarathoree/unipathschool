import Image from "next/image";
import { getTechLogos } from "@/lib/interview/utils";

const DisplayTechIcons = async ({ techStack }: { techStack: string[] }) => {
    const techIcons = await getTechLogos(techStack);

    return (
        <div className="flex flex-row">
            {techIcons.slice(0, 3).map(({ tech, url }, index) => (
                <div
                    key={tech}
                    className={`relative group bg-white border border-slate-200 rounded-full p-2 flex items-center justify-center shadow-sm ${index >= 1 ? "-ml-3" : ""}`}
                >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {tech}
                    </span>
                    <Image
                        src={url}
                        alt={tech}
                        width={100}
                        height={100}
                        className="w-5 h-5"
                    />
                </div>
            ))}
        </div>
    );
};

export default DisplayTechIcons;
