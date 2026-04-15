"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const team = [
  {
    name: "Shiva Rathore",
    role: "Founder & CEO",
    branch: "Pre-Final-Year CS",
    college: "RGIPT",
    tag: "Visionary",
    quote:
      "We built Unipath to guide others — but in the process, it shaped who we are.",
    image: "/IMG_20240528_085831_289.jpg",
    linkedin: "https://in.linkedin.com/in/shiva-rathore-2027cse",
    email: "23cs3050@rgipt.ac.in",
  },
  {
    name: "D Tejas",
    role: "Lead Developer",
    branch: "Computer Science",
    college: "RGIPT",
    tag: "Builder",
    quote:
      "Unipath isn't just a project — it's a proof that small ideas can spark change.",
    image: "/IMG_6634.jpg",
    linkedin: "",
    email: "23cs3023@rgipt.ac.in",
  },
  {
    name: "Parth Pandey",
    role: "Operations Manager",
    branch: "Information Technology",
    college: "RGIPT",
    tag: "Operator",
    quote:
      "Unipath taught me that impact begins the moment you decide to do.",
    image: "/parth.jpg",
    linkedin: "https://www.linkedin.com/in/parth-pandey-309748290",
    email: "23it3030@rgipt.ac.in",
  },
];

const stats = [
  { value: "3", label: "Founders" },
  { value: "1", label: "Mission" },
  { value: "∞", label: "Ambition" },
  { value: "0", label: "Excuses" },
];

const contactReasons = [
  "General Inquiry",
  "Feedback / Suggestion",
  "Report an Issue",
  "Partnership / Collaboration",
  "School/Institution Inquiry",
  "Other",
];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function TeamPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    /* Gracefully open the default mail client as a lightweight fallback
       — swap this for a real API call (Resend / Nodemailer) when ready. */
    try {
      const subject = encodeURIComponent(
        `[UNIPATH] ${form.reason || "Inquiry"} from ${form.name}`
      );
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nReason: ${form.reason}\n\n${form.message}`
      );
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

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="relative pt-40 pb-24 overflow-hidden bg-white border-b border-slate-100">
          {/* grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          {/* glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[18rem] bg-primary/6 blur-[120px] rounded-full pointer-events-none"
          />

          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-10 h-px bg-primary" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
                The People Behind It
              </span>
              <span className="w-10 h-px bg-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="text-5xl md:text-7xl font-medium font-heading text-slate-900 tracking-tighter leading-[1.05] mb-6"
            >
              Built by{" "}
              <span className="text-gradient relative inline-block">
                Students.
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-primary/30"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,10 Q50,20 100,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              For Students.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto"
            >
              Three engineers from RGIPT who got tired of the noise and built
              something signal. No funding. No shortcuts. Just conviction.
            </motion.p>
          </div>
        </section>

        {/* ── Team Cards ── */}
        <section className="py-28 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  variants={fadeUp}
                  className="group relative flex flex-col bg-slate-50 border border-slate-200 rounded-[3rem] overflow-hidden hover:border-primary/30 hover:shadow-[0_20px_60px_rgba(194,65,12,0.08)] transition-all duration-500 hover:-translate-y-1"
                >
                  {/* ambient hover glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/12 transition-colors duration-700" />

                  {/* Photo */}
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                    {/* tag */}
                    <div className="absolute top-5 left-5">
                      <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-white/90 backdrop-blur-sm border border-primary/20 rounded-full shadow-sm">
                        {member.tag}
                      </span>
                    </div>

                    {/* Name overlay */}
                    <div className="absolute bottom-5 left-6 right-6">
                      <p className="font-heading text-xl font-semibold text-white tracking-tight">
                        {member.name}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-primary mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-8 relative z-10">
                    {/* college */}
                    <div className="flex items-center gap-2 mb-6">
                      <IconifyIcon
                        icon="solar:buildings-2-linear"
                        className="text-slate-400 text-base shrink-0"
                      />
                      <span className="text-xs text-slate-500 font-medium">
                        {member.branch} · {member.college}
                      </span>
                    </div>

                    {/* quote */}
                    <div className="flex-grow mb-8">
                      <IconifyIcon
                        icon="solar:quote-left-linear"
                        className="text-primary/30 text-3xl mb-3"
                      />
                      <p className="text-sm text-slate-600 font-light leading-relaxed italic">
                        &ldquo;{member.quote}&rdquo;
                      </p>
                    </div>

                    <div className="h-px bg-slate-200 mb-6" />

                    {/* socials */}
                    <div className="flex items-center gap-3">
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                        >
                          <IconifyIcon icon="mdi:linkedin" className="text-lg" />
                        </a>
                      ) : (
                        <span className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-100 text-slate-300 cursor-not-allowed">
                          <IconifyIcon icon="mdi:linkedin" className="text-lg" />
                        </span>
                      )}
                      <a
                        href={`mailto:${member.email}`}
                        aria-label={`Email ${member.name}`}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                      >
                        <IconifyIcon
                          icon="solar:letter-linear"
                          className="text-lg"
                        />
                      </a>

                      <span className="ml-auto text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                        RGIPT · 2026
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Origin Story ── */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-10 md:p-14 bg-slate-900 rounded-[3rem] border border-slate-800 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/15 transition-all duration-700" />

              <div className="relative z-10 flex flex-col md:flex-row items-start gap-12">
                {/* Story */}
                <div className="flex-1">
                  <span className="inline-block px-4 py-1.5 text-[10px] font-semibold text-primary border border-primary/20 rounded-full bg-primary/5 tracking-[0.2em] uppercase mb-6">
                    Our Origin
                  </span>
                  <h2 className="text-3xl md:text-4xl font-medium font-heading text-white mb-4 tracking-tight leading-snug">
                    We weren&apos;t{" "}
                    <span className="text-primary">backed by capital.</span>
                    <br className="hidden md:block" />
                    We were backed by a problem.
                  </h2>
                  <p className="text-base text-slate-400 font-light leading-relaxed max-w-xl">
                    As students at RGIPT, we watched peers navigate directionless
                    job hunts with outdated guidance and zero personalisation.
                    Unipath was born from that frustration — a platform built by
                    the people who lived the problem, for the ones still living
                    it.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="w-32 h-28 flex flex-col items-center justify-center bg-slate-800/50 border border-slate-700/50 rounded-3xl hover:border-primary/30 transition-colors duration-300"
                    >
                      <span className="text-3xl font-semibold font-heading text-white tracking-tight">
                        {s.value}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="py-28 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
          {/* grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            {/* heading */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-5 flex items-center justify-center gap-4"
              >
                <span className="w-10 h-px bg-primary" />
                Contact Us
                <span className="w-10 h-px bg-primary" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-medium font-heading text-slate-900 tracking-tighter mb-4"
              >
                We&apos;d love to{" "}
                <span className="text-primary">hear from you.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 font-light max-w-xl mx-auto leading-relaxed"
              >
                Share your thoughts, suggestions, or inquiries — your feedback
                helps us build something truly worth using.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
              {/* Left: info */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 space-y-6"
              >
                {[
                  {
                    icon: "solar:map-point-bold-duotone",
                    label: "Location",
                    value: "RGIPT, Jais, Amethi, UP — India",
                  },
                  {
                    icon: "solar:letter-bold-duotone",
                    label: "Email",
                    value: "23cs3050@rgipt.ac.in",
                    href: "mailto:23cs3050@rgipt.ac.in",
                  },
                  {
                    icon: "solar:global-bold-duotone",
                    label: "Platform",
                    value: "unipath-school.vercel.app",
                    href: "/",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-5 p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-primary/25 hover:shadow-[0_8px_30px_rgba(194,65,12,0.06)] transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary text-2xl shrink-0">
                      <IconifyIcon icon={item.icon} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-700">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Team quick links */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">
                    Reach the team directly
                  </p>
                  <div className="space-y-3">
                    {team.map((m) => (
                      <a
                        key={m.name}
                        href={`mailto:${m.email}`}
                        className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary/25 hover:bg-primary/3 transition-all duration-300 group/member"
                      >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 shrink-0">
                          <Image
                            src={m.image}
                            alt={m.name}
                            fill
                            className="object-cover object-top"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 group-hover/member:text-primary transition-colors truncate">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            {m.role}
                          </p>
                        </div>
                        <IconifyIcon
                          icon="solar:arrow-right-linear"
                          className="text-slate-300 group-hover/member:text-primary group-hover/member:translate-x-1 transition-all text-base ml-auto shrink-0"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right: form */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-3"
              >
                <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
                  {/* subtle corner accent */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/4 blur-3xl rounded-full pointer-events-none" />

                  {status === "sent" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center gap-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-4xl">
                        <IconifyIcon icon="solar:check-circle-bold-duotone" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold font-heading text-slate-900 tracking-tight mb-2">
                          Message sent!
                        </h3>
                        <p className="text-slate-500 font-light text-sm">
                          Your mail client opened. We&apos;ll get back to you as
                          soon as we can.
                        </p>
                      </div>
                      <button
                        onClick={() => setStatus("idle")}
                        className="mt-2 px-8 py-3 rounded-full border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500"
                      >
                        Send Another
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="relative z-10 space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="name"
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                          >
                            Your Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Rajan Mehta"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-300 font-medium"
                          />
                        </div>
                        {/* Email */}
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="email"
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                          >
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-300 font-medium"
                          />
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="reason"
                          className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                        >
                          Reason for Contact
                        </label>
                        <select
                          id="reason"
                          name="reason"
                          value={form.reason}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-300 font-medium appearance-none cursor-pointer"
                        >
                          <option value="">Select a reason…</option>
                          {contactReasons.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="message"
                          className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          placeholder="Share your thoughts, feedback, or questions…"
                          value={form.message}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-300 font-medium resize-none leading-relaxed"
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-xs text-red-500 font-medium">
                          Something went wrong. Please try again or email us
                          directly.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="relative w-full py-4 px-8 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500 shadow-lg hover:shadow-primary/20 disabled:opacity-60 overflow-hidden group/btn flex items-center justify-center gap-3"
                      >
                        <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover/btn:w-full z-0 rounded-full" />
                        <span className="relative z-10 flex items-center gap-3">
                          {status === "sending" ? (
                            <>
                              <IconifyIcon
                                icon="solar:spinner-bold"
                                className="animate-spin text-base"
                              />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send Message
                              <IconifyIcon
                                icon="solar:arrow-right-linear"
                                className="text-sm group-hover/btn:translate-x-1 transition-transform"
                              />
                            </>
                          )}
                        </span>
                      </button>

                      <p className="text-[10px] text-center text-slate-400 font-medium">
                        We reply within 24–48 hours. No spam, ever.
                      </p>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA strip ── */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-slate-400 text-sm font-light uppercase tracking-widest mb-6"
            >
              Ready to start?
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-medium font-heading text-slate-900 tracking-tighter mb-8"
            >
              Your career path{" "}
              <span className="text-primary">starts here.</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/career-discovery"
                className="relative overflow-hidden flex items-center gap-2 px-10 py-4 text-sm font-medium text-white bg-slate-900 rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300 group/cta"
              >
                <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover/cta:w-full z-0" />
                <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase">
                  Initialize Path
                  <IconifyIcon
                    icon="solar:rocket-linear"
                    className="group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform"
                  />
                </span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 px-10 py-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-primary/30 hover:bg-slate-50 rounded-full transition-all duration-300 tracking-widest uppercase"
              >
                Back to Home
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
