"use client";

import { useState } from "react";
import { X, Phone, ShieldCheck, UserRound, ArrowRight, LoaderCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login } = useStore();

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthOpen) return null;

  const close = () => {
    if (loading) return;
    setIsAuthOpen(false);
    setStep("phone");
    setError("");
    setCode("");
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Xatolik yuz berdi.");

      setStep("verify");

      if (data.devCode) {
        alert("TurboPizza demo tasdiqlash kodi: " + data.devCode);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Kod noto'g'ri.");

      login(data);
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none sm:py-4 placeholder:text-zinc-600 focus:border-orange-500 transition";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 sm:p-4 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative my-auto w-full max-w-md max-h-[calc(100dvh-24px)] overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] p-4 sm:rounded-3xl sm:p-7 shadow-2xl shadow-orange-950/20">
        <button
          onClick={close}
          className="absolute right-3 top-3 rounded-xl sm:right-5 sm:top-5 border border-white/10 p-2 text-zinc-400 hover:text-white"
        >
          <X size={19} />
        </button>

        <div className="mb-5 flex flex-col items-center text-center sm:mb-7">
          <div className="mb-4 flex h-14 w-14 items-center sm:mb-5 sm:h-16 sm:w-16 justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-700 shadow-lg shadow-orange-600/20">
            {step === "phone" ? (
              <Phone size={29} className="text-white" />
            ) : (
              <ShieldCheck size={30} className="text-white" />
            )}
          </div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
            TURBOPIZZA ACCOUNT
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {step === "phone" ? "Xush kelibsiz!" : "Kodni tasdiqlang"}
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
            {step === "phone"
              ? "Telefon raqamingiz orqali akkauntingizga kiring yoki yangisini yarating."
              : `+${phone.replace(/\D/g, "")} raqamiga yuborilgan demo kodni kiriting.`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendCode} className="space-y-3 sm:space-y-4">
            <label className="block text-sm font-semibold text-zinc-300">
              Telefon raqam
            </label>

            <input
              type="tel"
              required
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className={inputClass}
            />

            <p className="text-xs text-zinc-600">
              O&apos;zbekiston telefon raqamini kiriting.
            </p>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 py-4 font-black text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <>Davom etish <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-3 sm:space-y-4">
            <label className="block text-sm font-semibold text-zinc-300">
              6 xonali tasdiqlash kodi
            </label>

            <input
              required
              autoFocus
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className={`${inputClass} text-center text-3xl font-black tracking-[0.5em]`}
            />

            <label className="block text-sm font-semibold text-zinc-300">
              Ismingiz <span className="font-normal text-zinc-600">(yangi akkaunt uchun)</span>
            </label>

            <div className="relative">
              <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={19} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ism va familiya"
                className={`${inputClass} pl-12`}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              disabled={loading || code.length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 py-4 font-black text-white disabled:opacity-50"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : "Tasdiqlash va kirish"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
              className="w-full py-2 text-sm font-semibold text-zinc-500 hover:text-white"
            >
              Telefon raqamni o&apos;zgartirish
            </button>
          </form>
        )}

        <div className="mt-5 border-t border-white/[0.07] pt-4 sm:mt-6 sm:pt-5 text-center text-xs text-zinc-600">
          Xavfsiz va qulay buyurtmalar — TurboPizza
        </div>
      </div>
    </div>
  );
}

