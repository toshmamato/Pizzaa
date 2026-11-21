"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown, Banknote, CreditCard, Smartphone,
  MapPin, MessageCircle, ArrowUp, HelpCircle,
  Clock3, Package, ShieldCheck, Image as ImageIcon
} from "lucide-react";

const questions = [
  {
    q: "Yetkazib berish qancha turadi?",
    a: "Yetkazib berish narxi buyurtma manzili va shartlariga bog'liq. Buyurtmani rasmiylashtirishda aniqlashtiring."
  },
  {
    q: "Qanday to'lov qilish mumkin?",
    a: "Buyurtma berish vaqtida mavjud to'lov usullari bo'yicha ma'lumot olinadi."
  },
  {
    q: "Buyurtmani bekor qilish mumkinmi?",
    a: "Buyurtma tayyorlash jarayoni boshlanishidan oldin yordam xizmatiga murojaat qiling."
  },
  {
    q: "Buyurtmam qachon yetib keladi?",
    a: "Yetkazib berish vaqti manzil va buyurtma holatiga qarab farq qilishi mumkin."
  },
  {
    q: "Qanday buyurtma beraman?",
    a: "Menyudan mahsulot tanlang, savatchaga qo'shing va buyurtmani rasmiylashtiring."
  }
];

export default function HomeFinalSections({ products = [] }) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const gallery = products.filter((p) => p.image).slice(0, 6);

  return (
    <>
      {/* FAQ */}
      <section id="faq" className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="text-sm font-bold uppercase tracking-[.25em] text-orange-400">
              Savollaringiz bormi?
            </span>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Ko'p so'raladigan <span className="text-orange-500">savollar</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
              TurboPizza buyurtmalari, to'lov va yetkazib berish haqida kerakli javoblarni shu yerdan topishingiz mumkin.
            </p>
            <div className="mt-8 flex items-center gap-3 text-orange-400">
              <HelpCircle size={25} />
              <span className="text-sm font-bold">Sizga yordam berishga tayyormiz</span>
            </div>
          </div>

          <div className="space-y-3">
            {questions.map((item, index) => (
              <div key={item.q} className="overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-bold sm:text-base">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-orange-400 transition-transform ${activeFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="border-t border-white/5 px-5 pb-5 pt-4 text-sm leading-7 text-zinc-400">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      <section className="border-y border-white/5 bg-[#111] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-[.25em] text-orange-400">
              Qulay va tushunarli
            </span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              To'lov <span className="text-orange-500">haqida</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Buyurtma vaqtida mavjud to'lov usullari haqida ma'lumot olasiz.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Banknote, title: "Naqd pul", text: "Naqd to'lov imkoniyati mavjudligini buyurtma vaqtida aniqlashtiring." },
              { icon: CreditCard, title: "Bank kartasi", text: "Karta orqali to'lov imkoniyati haqida buyurtma rasmiylashtirishda bilib oling." },
              { icon: Smartphone, title: "Onlayn to'lov", text: "Onlayn to'lov mavjud bo'lsa, tegishli usul buyurtma jarayonida ko'rsatiladi." }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-[#191919] p-7 transition hover:-translate-y-1 hover:border-orange-500/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                  <Icon size={27} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY AREA */}
      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#20150e] to-[#111] p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-[.25em] text-orange-400">
              TurboPizza delivery
            </span>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Sizning manzilingizga <span className="text-orange-500">yetkazamiz</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Buyurtma berishda yetkazib berish manzilingizni aniq kiriting. Hududingizga yetkazib berish imkoniyati buyurtma jarayonida aniqlashtiriladi.
            </p>
            <a href="#menu" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600">
              Taom tanlash <MapPin size={18} />
            </a>
          </div>

          <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-3xl border border-orange-500/10 bg-[#0c0c0c]">
            <div className="absolute h-52 w-52 rounded-full border border-dashed border-orange-500/20" />
            <div className="absolute h-36 w-36 rounded-full border border-dashed border-orange-500/30" />
            <div className="absolute h-20 w-20 rounded-full bg-orange-500/10 blur-2xl" />
            <div className="relative flex flex-col items-center gap-3 text-orange-400">
              <MapPin size={54} />
              <span className="text-sm font-black tracking-widest">TURBOPIZZA</span>
              <span className="text-xs text-zinc-500">Sizga yaqinroq</span>
            </div>
            <div className="absolute left-[18%] top-[20%] text-orange-500/50"><MapPin size={20}/></div>
            <div className="absolute bottom-[20%] right-[18%] text-orange-500/50"><MapPin size={20}/></div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="border-y border-white/5 bg-[#111] px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-[.25em] text-orange-400">
                  Bizning ta'mlar olami
                </span>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  TurboPizza <span className="text-orange-500">galereyasi</span>
                </h2>
              </div>
              <ImageIcon className="text-orange-400" size={30}/>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {gallery.map((product, index) => (
                <a
                  href={`/product/${product.id}`}
                  key={product.id}
                  className={`group relative overflow-hidden rounded-2xl bg-[#222] ${index === 0 ? "col-span-2 row-span-2 min-h-64 md:min-h-96" : "min-h-40 md:min-h-48"}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="font-bold text-white">{product.name}</p>
                    <p className="mt-1 text-xs text-orange-300">Batafsil ko'rish</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* QUICK SUPPORT + BACK TO TOP */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-3">
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Tepaga qaytish"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#222] text-white shadow-xl transition hover:-translate-y-1 hover:bg-orange-500"
          >
            <ArrowUp size={21}/>
          </button>
        )}
        <a
          href="#faq"
          aria-label="Yordam va savollar"
          title="Yordam"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl shadow-orange-950/40 transition hover:scale-110 hover:bg-orange-600"
        >
          <MessageCircle size={25}/>
        </a>
      </div>
    </>
  );
}
