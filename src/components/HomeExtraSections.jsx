"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Award,
  Clock3,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  ChefHat,
  PackageCheck,
  Bike,
  House,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ProductCard from "./ProductCard";

export default function HomeExtraSections({ products = [] }) {
  const featured = useMemo(() => {
    const selected = products.filter(
      (p) => p.mainCategory === "Pizzalar" || p.mainCategory === "Burgerlar"
    );
    return selected.slice(0, 4);
  }, [products]);

  const combos = useMemo(
    () => products.filter((p) => p.mainCategory === "Kombo to'plamlar").slice(0, 3),
    [products]
  );

  const benefits = [
    {
      icon: ChefHat,
      title: "Mazali retseptlar",
      text: "Har bir taom o'ziga xos retsept va e'tibor bilan tayyorlanadi.",
    },
    {
      icon: Leaf,
      title: "Yangi masalliqlar",
      text: "Taomlarimiz uchun sifatli masalliqlardan foydalanamiz.",
    },
    {
      icon: ShieldCheck,
      title: "Sifat nazorati",
      text: "Buyurtma tayyorlash jarayonida sifatga alohida e'tibor beramiz.",
    },
    {
      icon: Clock3,
      title: "Qulay buyurtma",
      text: "Sevimli taomingizni bir necha bosqichda buyurtma qiling.",
    },
  ];

  return (
    <>
      {/* Tavsiya etilgan mahsulotlar */}
      {featured.length > 0 && (
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
                  Bizning tanlov
                </span>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  Sizga <span className="text-orange-500">tavsiya qilamiz</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm text-zinc-400">
                  Menyudan tanlangan mazali taomlarimizni sinab ko'ring.
                </p>
              </div>
              <Link href="#menu" className="flex items-center gap-2 text-sm font-bold text-orange-400 transition hover:gap-3">
                Barcha taomlar <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Kombo takliflar */}
      {combos.length > 0 && (
        <section className="relative overflow-hidden border-y border-orange-500/10 bg-gradient-to-br from-[#241208] via-[#17100c] to-[#0c0c0c] px-4 py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
                  Birgalikda yanada mazali
                </span>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  Maxsus <span className="text-orange-500">kombo</span> takliflar
                </h2>
                <p className="mt-3 text-sm text-zinc-400">
                  Pizza, ichimlik va gazaklar — barchasi bir to'plamda.
                </p>
              </div>
              <Link href="#menu" className="flex items-center gap-2 text-sm font-bold text-orange-400 transition hover:gap-3">
                Menyuni ko'rish <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {combos.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nega TurboPizza */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Bizning ustunliklarimiz
            </span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Nega aynan <span className="text-orange-500">TurboPizza?</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Siz uchun mazali taom va qulay buyurtma tajribasini yaratamiz.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group rounded-3xl border border-white/10 bg-[#151515] p-7 transition duration-300 hover:-translate-y-2 hover:border-orange-500/40 hover:bg-[#1c1713]">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 transition group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={27} />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animatsiyali yetkazib berish */}
      <section className="overflow-hidden border-y border-white/5 bg-[#111] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Buyurtmangiz yo'lda
            </span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Eshigingizgacha <span className="text-orange-500">yetkazamiz</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Buyurtmadan dasturxoningizgacha — uchta oddiy bosqich.
            </p>
          </div>

          <div className="delivery-scene relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#20170f] to-[#121212] px-5 pb-8 pt-10 sm:px-12">
            <div className="absolute left-0 right-0 top-1/2 h-px border-t border-dashed border-orange-500/30" />

            <div className="relative z-10 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 sm:h-20 sm:w-20">
                  <ShoppingBag size={30} />
                </div>
                <span className="mt-4 text-xs font-bold text-orange-400 sm:text-sm">01</span>
                <h3 className="mt-1 text-xs font-bold sm:text-base">Buyurtma</h3>
                <p className="mt-1 hidden text-xs text-zinc-500 sm:block">Taomni tanlaysiz</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 sm:h-20 sm:w-20">
                  <ChefHat size={30} />
                </div>
                <span className="mt-4 text-xs font-bold text-orange-400 sm:text-sm">02</span>
                <h3 className="mt-1 text-xs font-bold sm:text-base">Tayyorlanadi</h3>
                <p className="mt-1 hidden text-xs text-zinc-500 sm:block">Oshxonada pishadi</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 sm:h-20 sm:w-20">
                  <House size={30} />
                </div>
                <span className="mt-4 text-xs font-bold text-orange-400 sm:text-sm">03</span>
                <h3 className="mt-1 text-xs font-bold sm:text-base">Uyingizda</h3>
                <p className="mt-1 hidden text-xs text-zinc-500 sm:block">Buyurtma yetib keladi</p>
              </div>
            </div>

            <div className="delivery-road relative mt-10 h-24 overflow-hidden rounded-2xl border-y border-dashed border-white/10 bg-black/20">
              <div className="delivery-bike absolute top-1/2 -translate-y-1/2 text-orange-400">
                <Bike size={54} strokeWidth={1.7} />
              </div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-400">
                <House size={34} />
              </div>
              <div className="absolute bottom-2 left-5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                TurboPizza delivery
              </div>
            </div>

            <div className="mt-7 text-center">
              <div className="delivery-arrived inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-5 py-3 text-sm font-bold text-green-400">
                <PackageCheck size={19} />
                Buyurtmangiz yetib keldi!
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Bu yetkazib berish jarayonining animatsion namoyishi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mijozlar fikri uchun taklif */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#21150e] to-[#151515] p-8 sm:p-12">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <MessageCircle size={32} />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Sizning fikringiz muhim</span>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Taassurotingizni biz bilan bo'lishing</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Buyurtmangizdan keyin fikr va takliflaringizni qoldiring. Haqiqiy mijozlar izohlari shu yerda namoyish etiladi.
              </p>
            </div>
            <Link href="#menu" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600">
              <Sparkles size={17} /> Menyuga o'tish
            </Link>
          </div>
        </div>
      </section>

      {/* Kombo va takliflar banneri */}
      <section className="px-4 pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70">TurboPizza maxsus takliflari</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              Yaqinlaringiz bilan mazali lahzalarni baham ko'ring!
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">
              Kombo to'plamlarimizni ko'ring va o'zingizga mos taomlarni tanlang.
            </p>
            <Link href="#menu" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-orange-700 transition hover:-translate-y-1 hover:shadow-xl">
              Takliflarni ko'rish <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
