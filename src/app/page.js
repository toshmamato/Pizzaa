"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Clock3, Truck, Star, ArrowRight,
  Flame, Pizza, ChefHat, Sparkles, X
} from "lucide-react";
import { categories } from "../lib/categories";
import ProductCard from "../components/ProductCard";
import HomeExtraSections from "../components/HomeExtraSections";
import HomeFinalSections from "../components/HomeFinalSections";
import HomeVisuals from "../components/HomeVisuals";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Mahsulotlarni yuklab bo'lmadi");
        return res.json();
      })
      .then((data) => {
        if (active) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const searchedProducts = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return [];

    return products.filter((product) =>
      `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(value)
    );
  }, [products, search]);

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white">
      <section className="relative overflow-hidden px-4 pb-12 pt-8 sm:pb-16 md:pb-24 md:pt-16">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-orange-600/15 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-red-600/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
              <Sparkles size={16} />
              Har bir bo'lakda haqiqiy lazzat
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.12] tracking-tight min-[400px]:text-5xl sm:text-6xl lg:text-7xl">
              Mazali lahzalar
              <span className="block text-orange-500">TurboPizza</span>
              bilan boshlanadi!
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-zinc-400 md:text-lg">
              Yangi masalliqlar, haqiqiy mozzarella va maxsus retseptlar.
              Sevimli taomingizni tanlang, qolganini bizga qo'ying.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="flex items-center gap-3 rounded-2xl bg-orange-500 px-7 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
              >
                Menyuni ko'rish
                <ArrowRight size={19} />
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 px-5 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <Clock3 size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold">30 daqiqa</p>
                  <p className="text-xs text-zinc-500">Tezkor yetkazish</p>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-5 border-t sm:mt-12 sm:gap-8 border-white/10 pt-8">
              <div>
                <p className="text-2xl font-black text-orange-500">100%</p>
                <p className="mt-1 text-xs text-zinc-500">Yangi masalliqlar</p>
              </div>
              <div>
                <p className="text-2xl font-black text-orange-500">30 min</p>
                <p className="mt-1 text-xs text-zinc-500">Tez yetkazish</p>
              </div>
              <div>
                <p className="text-2xl font-black text-orange-500">Fresh</p>
                <p className="mt-1 text-xs text-zinc-500">Har kuni tayyorlanadi</p>
              </div>
            </div>
          </div>

          <div className="hero-visual relative mx-auto w-full max-w-xl">
            <div className="absolute inset-8 rounded-full bg-orange-500/20 blur-[80px]" />
            <div className="relative rounded-3xl border sm:rounded-[40px] border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 shadow-2xl md:p-7">
              <img
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1000&q=90"
                alt="TurboPizza"
                className="hero-pizza-image aspect-square w-full rounded-[30px] object-cover"
              />

              <div className="absolute -bottom-4 left-2 sm:-bottom-5 sm:-left-8 rounded-2xl border border-white/10 bg-[#191919] p-4 shadow-2xl md:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                    <Flame size={25} />
                  </div>
                  <div>
                    <p className="font-bold">Issiq va mazali!</p>
                    <p className="text-xs text-zinc-500">To'g'ridan-to'g'ri pechdan</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-2 top-4 sm:-right-6 sm:top-8 rounded-2xl border border-orange-500/30 bg-[#171717] px-4 py-3 shadow-xl md:-right-6">
                <div className="flex items-center gap-2 text-orange-400">
                  <Star size={17} fill="currentColor" />
                  <span className="font-bold">Premium sifat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-white/5 bg-[#121212] px-4 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3 md:gap-7">
          {[
            {
              icon: ChefHat,
              title: "Professional oshpazlar",
              desc: "Har bir taom alohida mehr bilan tayyorlanadi",
            },
            {
              icon: Truck,
              title: "Tezkor yetkazish",
              desc: "Buyurtmangizni issiq holatda yetkazamiz",
            },
            {
              icon: Pizza,
              title: "Yangi masalliqlar",
              desc: "Faqat sifatli va yangi mahsulotlar",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <item.icon size={26} />
              </div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-500">
              <Flame size={17} />
              Bizning menyu
            </div>
            <h2 className="text-3xl font-black md:text-5xl">
              Mazali taomlarimiz
            </h2>
            <p className="mt-3 text-zinc-500">
              8 ta asosiy kategoriya va yuzlab mazali tanlovlar.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mahsulot qidirish..."
              className="w-full rounded-2xl border border-white/10 bg-[#171717] py-4 pl-12 pr-10 text-sm outline-none transition focus:border-orange-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                aria-label="Qidiruvni tozalash"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 animate-pulse rounded-3xl bg-zinc-800/60" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <p className="font-bold text-red-400">{error}</p>
            <p className="mt-2 text-sm text-zinc-500">
              Backend va API sozlamalarini tekshiring.
            </p>
          </div>
        ) : search.trim() ? (
          searchedProducts.length ? (
            <>
              <p className="mb-6 text-sm text-zinc-500">
                Qidiruv natijalari: {searchedProducts.length} ta mahsulot
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                {searchedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-3xl border border-white/10 bg-[#171717] py-16 text-center text-zinc-400">
              Mahsulot topilmadi.
            </p>
          )
        ) : (
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryProducts = products
                .filter((product) => product.mainCategory === category.name)
                .slice(0, 5);

              if (!categoryProducts.length) return null;

              return (
                <section key={category.slug}>
                  <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-2xl font-black md:text-3xl">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-500">
                        {categoryProducts.length} ta mahsulot
                      </p>
                    </div>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/30 px-4 py-3 text-sm font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white sm:w-auto"
                    >
                      Barchasi
                      <ArrowRight size={17} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>

      <HomeVisuals products={products} />

      <HomeExtraSections products={products} />
      <HomeFinalSections products={products} />
      <section className="px-4 pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-r from-orange-700 via-orange-600 to-red-600 p-8 md:p-14">
          <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-100">
                TurboPizza bilan mazali hayot
              </p>
              <h2 className="max-w-2xl text-3xl font-black md:text-5xl">
                Bugun o'zingizni mazali taom bilan siylang!
              </h2>
              <p className="mt-4 text-orange-100">
                Sevimli taomingizni tanlang va buyurtma bering.
              </p>
            </div>
            <a
              href="#menu"
              className="flex shrink-0 items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-orange-600 transition hover:bg-zinc-100"
            >
              Buyurtma berish
              <ArrowRight size={19} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}





