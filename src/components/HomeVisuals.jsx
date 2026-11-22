"use client";

import { useEffect, useMemo } from "react";
import { BarChart3, Pizza, Layers3, Clock3, TrendingUp } from "lucide-react";
import { categories } from "../lib/categories";

export default function HomeVisuals({ products = [] }) {
  const stats = useMemo(() => {
    return categories.map((category) => ({
      name: category.name,
      count: products.filter(
        (product) => product.mainCategory === category.name
      ).length,
    }));
  }, [products]);

  const maxCount = Math.max(...stats.map((item) => item.count), 1);
  const totalProducts = products.length;

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [products]);

  return (
    <section className="visual-section px-4 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="scroll-reveal mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            <BarChart3 size={18} />
            TurboPizza statistikasi
          </div>
          <h2 className="text-3xl font-black md:text-5xl">
            Bizning menyu <span className="text-orange-500">raqamlarda</span>
          </h2>
          <p className="mt-3 text-zinc-500">
            Menyudagi mahsulotlar taqsimoti bilan tanishing.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="scroll-reveal stat-card">
            <div className="stat-icon"><Pizza size={23} /></div>
            <p className="mt-5 text-3xl font-black text-white">{totalProducts}</p>
            <p className="mt-1 text-sm text-zinc-500">Jami mahsulotlar</p>
          </div>

          <div className="scroll-reveal stat-card">
            <div className="stat-icon"><Layers3 size={23} /></div>
            <p className="mt-5 text-3xl font-black text-white">{categories.length}</p>
            <p className="mt-1 text-sm text-zinc-500">Asosiy kategoriyalar</p>
          </div>

          <div className="scroll-reveal stat-card">
            <div className="stat-icon"><Clock3 size={23} /></div>
            <p className="mt-5 text-3xl font-black text-white">30 min</p>
            <p className="mt-1 text-sm text-zinc-500">Tezkor yetkazish</p>
          </div>
        </div>

        <div className="scroll-reveal overflow-hidden rounded-[30px] border border-white/10 bg-[#151515] p-5 md:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-white md:text-2xl">
                Kategoriyalar diagrammasi
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Har bir kategoriyadagi mahsulotlar soni
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-400">
              <TrendingUp size={15} />
              Jonli ma&apos;lumot
            </div>
          </div>

          <div className="space-y-5">
            {stats.map((item, index) => (
              <div key={item.name} className="chart-row">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-zinc-300">
                    {item.name}
                  </span>
                  <span className="text-sm font-black tabular-nums text-orange-400">
                    {item.count} ta
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="chart-bar h-full rounded-full"
                    style={{
                      "--bar-width": `${(item.count / maxCount) * 100}%`,
                      "--bar-delay": `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

