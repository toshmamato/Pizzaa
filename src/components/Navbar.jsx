"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag, Moon, Sun, Pizza,
  UserRound, LogOut, ChevronDown, Heart
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { categories } from "../lib/categories";

export default function Navbar() {
  const [categoryOpen, setCategoryOpen] = useState(false);

  const {
    totalItems,
    darkMode,
    setDarkMode,
    setIsCartOpen,
    setIsAuthOpen,
    user,
    logout,
    authLoading,
    favorites,
  } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0c0c0c]/95 backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-700">
            <Pizza size={23} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-black text-white">
              TURBO<span className="text-orange-500">PIZZA</span>
            </div>
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Premium taste experience
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="hidden text-sm font-semibold text-zinc-300 transition hover:text-orange-400 sm:block">
            Bosh sahifa
          </Link>

          <Link href="/#about" className="hidden text-sm font-semibold text-zinc-300 transition hover:text-orange-400 md:block">
            Biz haqimizda
          </Link>

          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                categoryOpen
                  ? "border-orange-500 bg-orange-500/10 text-orange-400"
                  : "border-white/10 text-white hover:border-orange-500/50"
              }`}
            >
              Kategoriyalar
              <ChevronDown
                size={16}
                className={`transition ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoryOpen && (
              <>
                <button
                  aria-label="Menyuni yopish"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setCategoryOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-white/10 bg-[#171717] p-3 shadow-2xl shadow-black/50">
                  <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-widest text-orange-500">
                    Asosiy kategoriyalar
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={() => setCategoryOpen(false)}
                        className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-sm font-semibold text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/favorites"
            aria-label="Sevimlilar"
            title="Sevimlilar"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:border-red-500/40 hover:text-red-400"
          >
            <Heart size={19} />
            {favorites.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0c0c0c] bg-red-500 px-1 text-[10px] font-black text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Mavzuni almashtirish"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:text-orange-400"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!authLoading && (
            user ? (
              <>
                <Link
                  href="/profile"
                  className="flex h-10 items-center gap-2 rounded-xl border border-white/10 px-2 transition hover:border-orange-500/50"
                >
                  <UserRound size={18} className="text-orange-400" />
                  <span className="hidden max-w-20 truncate text-sm font-bold text-white lg:block">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Akkauntdan chiqish"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-300 hover:text-red-400"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm font-bold text-white transition hover:border-orange-500 hover:text-orange-400"
              >
                <UserRound size={18} />
                <span className="hidden sm:inline">Kirish</span>
              </button>
            )
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-3 font-bold text-white shadow-lg shadow-orange-600/20"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Savatcha</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#0c0c0c] bg-white px-1 text-xs font-black text-orange-600">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
