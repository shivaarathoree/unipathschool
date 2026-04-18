"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";

const team = [
  {
    name: "Shiva Rathore",
    role: "Founder & CEO",
    college: "RGIPT · CS · Pre-Final Year",
    image: "/IMG_20240528_085831_289.jpg",
    linkedin: "https://in.linkedin.com/in/shiva-rathore-2027cse",
    email: "23cs3050@rgipt.ac.in",
  },
  {
    name: "D Tejas",
    role: "CTO",
    college: "RGIPT · CS",
    image: "/IMG_6634.jpg",
    linkedin: "",
    email: "23cs3023@rgipt.ac.in",
  },
];

const contactReasons = [
  "General Inquiry",
  "Feedback / Suggestion",
  "Report an Issue",
  "Partnership / Collaboration",
  "School / Institution Inquiry",
  "Other",
];

export default function TeamPage() {
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const subject = encodeURIComponent(`[UNIPATH] ${form.reason || "Inquiry"} from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nReason: ${form.reason}\n\n${form.message}`);
      window.location.href = `mailto:23cs3050@rgipt.ac.in?subject=${subject}&body=${body}`;
      setStatus("sent");
      setForm({ name: "", email: "", reason: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* ── Page Title ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-3">Unipath School</p>
            <h1 className="text-4xl md:text-5xl font-medium font-heading text-slate-900 tracking-tighter mb-4">
              Get in touch.
            </h1>
            <p className="text-slate-500 font-light text-base max-w-xl leading-relaxed">
              We're two students building something we wished existed. If you have feedback, a bug to report, or just want to say hi — we actually read every message.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

            {/* ── Left: Team + Info ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Team */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">The Team</p>
                <div className="space-y-3">
                  {team.map((m) => (
                    <div key={m.name} className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <Image src={m.image} alt={m.name} fill className="object-cover object-top" sizes="44px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{m.role} · {m.college}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {m.linkedin && (
                          <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
                            <IconifyIcon icon="mdi:linkedin" className="text-base" />
                          </a>
                        )}
                        <a href={`mailto:${m.email}`} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
                          <IconifyIcon icon="solar:letter-linear" className="text-base" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Direct Contact</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <IconifyIcon icon="solar:letter-linear" className="text-slate-400 text-base shrink-0" />
                    <a href="mailto:23cs3050@rgipt.ac.in" className="hover:text-primary transition-colors font-medium">23cs3050@rgipt.ac.in</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <IconifyIcon icon="solar:map-point-linear" className="text-slate-400 text-base shrink-0" />
                    <span className="font-medium">RGIPT, Jais, Amethi, UP</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <IconifyIcon icon="solar:global-linear" className="text-slate-400 text-base shrink-0" />
                    <a href="https://unipathschool.com" className="hover:text-primary transition-colors font-medium">unipathschool.com</a>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  We reply within 24–48 hours. No auto-replies, no support tickets — just us.
                </p>
              </div>
            </motion.div>

            {/* ── Right: Contact Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="border border-slate-200 rounded-[2rem] p-8 md:p-10 bg-white">
                {status === "sent" ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-3xl">
                      <IconifyIcon icon="solar:check-circle-bold-duotone" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">Message sent!</h3>
                      <p className="text-slate-500 text-sm font-light">Your mail client opened. We'll get back to you soon.</p>
                    </div>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-2 px-8 py-3 rounded-full border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Name</label>
                        <input
                          id="name" name="name" type="text" placeholder="Rajan Mehta"
                          value={form.name} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                        <input
                          id="email" name="email" type="email" placeholder="you@example.com"
                          value={form.email} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="reason" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What's it about?</label>
                      <select
                        id="reason" name="reason" value={form.reason} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-primary/40 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="">Select a reason…</option>
                        {contactReasons.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</label>
                      <textarea
                        id="message" name="message" rows={5}
                        placeholder="Share your thoughts, feedback, or questions…"
                        value={form.message} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:bg-white transition-all font-medium resize-none leading-relaxed"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-xs text-red-500 font-medium">Something went wrong. Email us directly at 23cs3050@rgipt.ac.in</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-3.5 px-8 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {status === "sending" ? (
                        <><IconifyIcon icon="solar:spinner-bold" className="animate-spin" /> Sending…</>
                      ) : (
                        <>Send Message <IconifyIcon icon="solar:arrow-right-linear" /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
