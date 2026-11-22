"use client";

import Link from "next/link";
import {
  Pizza, ArrowUpRight, Heart, ShoppingBag,
  Clock3, CreditCard, ChevronRight
} from "lucide-react";
import { categories } from "../lib/categories";

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/10 bg-[#080808] text-white">
      <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-orange-600/[0.08] blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-red-600/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-600 to-red-600 shadow-lg shadow-orange-600/20">
                <Pizza size={30} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight">
                  TURBO<span className="text-orange-500">PIZZA</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-zinc-500">
                  Premium taste experience
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
              Sevimli taomlaringiz, mazali lahzalar va qulay buyurtma —
              barchasi TurboPizza’da. Menyudan tanlang va buyurtmangizni
              rasmiylashtiring.
            </p>

            <Link
              href="/#menu"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/15 transition hover:-translate-y-1 hover:shadow-orange-500/25"
            >
              Menyuni ko&apos;rish
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Kategoriyalar
            </h3>
            <div className="mt-6 space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group flex items-center gap-2 text-sm text-zinc-500 transition hover:translate-x-1 hover:text-orange-400"
                >
                  <ChevronRight size={14} className="text-orange-600 transition group-hover:translate-x-1" />
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Tezkor havolalar
            </h3>
            <div className="mt-6 space-y-4">
              <Link href="/" className="flex items-center gap-3 text-sm text-zinc-500 transition hover:text-orange-400">
                <Pizza size={17} className="text-orange-500" />
                Bosh sahifa
              </Link>
              <Link href="/#about" className="flex items-center gap-3 text-sm text-zinc-500 transition hover:text-orange-400">
                <ArrowUpRight size={17} className="text-orange-500" />
                Biz haqimizda
              </Link>
              <Link href="/favorites" className="flex items-center gap-3 text-sm text-zinc-500 transition hover:text-orange-400">
                <Heart size={17} className="text-orange-500" />
                Sevimlilar
              </Link>
              <Link href="/profile" className="flex items-center gap-3 text-sm text-zinc-500 transition hover:text-orange-400">
                <ShoppingBag size={17} className="text-orange-500" />
                Shaxsiy kabinet
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Buyurtma haqida
            </h3>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <ShoppingBag size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">Qulay buyurtma</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Mahsulotlarni tanlang va savatcha orqali buyurtma bering.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <CreditCard size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">To&apos;lov usullari</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Naqd pul, Click / Payme yoki kuryer terminali.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <Clock3 size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">Buyurtma holati</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Shaxsiy kabinetingizda buyurtmalaringiz holatini ko&apos;ring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} <span className="font-bold text-zinc-400">TurboPizza</span>. Barcha huquqlar himoyalangan.
          </p>

          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-semibold text-zinc-500 transition hover:text-orange-400"
          >
            Mazali tanlovingiz uchun rahmat!
            <Pizza size={15} className="text-orange-500 transition group-hover:rotate-12" />
          </Link>
        </div>
      </div>
    </footer>
  );
}


