"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserRound, Phone, MapPin, Package,
  Clock, CheckCircle2, Truck, ChefHat,
  LogOut, ArrowLeft, LoaderCircle, Pizza
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

const money = (value) =>
  `${Number(value || 0).toLocaleString("uz-UZ")} so'm`;

const statusInfo = {
  "Yangi": {
    label: "Yangi buyurtma",
    color: "text-blue-400",
    icon: Clock,
  },
  "Tayyorlanmoqda": {
    label: "Tayyorlanmoqda",
    color: "text-orange-400",
    icon: ChefHat,
  },
  "Yo'lda": {
    label: "Yo'lda",
    color: "text-purple-400",
    icon: Truck,
  },
  "Yetkazildi": {
    label: "Yetkazildi",
    color: "text-green-400",
    icon: CheckCircle2,
  },
};

export default function ProfilePage() {
  const { user, token, logout, setIsAuthOpen, authLoading } = useStore();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Profilni yuklab bo'lmadi.");
        }

        setProfile(data.user);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#0c0c0c]">
        <LoaderCircle className="animate-spin text-orange-500" size={38} />
      </main>
    );
  }

  if (!user || !token) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#0c0c0c] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141414] p-8 text-center">
          <UserRound className="mx-auto mb-5 text-orange-500" size={48} />
          <h1 className="text-2xl font-black text-white">Profilingizga kiring</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Shaxsiy profilingiz va buyurtmalar tarixini ko'rish uchun akkauntingizga kiring.
          </p>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="mt-7 w-full rounded-xl bg-orange-600 py-4 font-bold text-white transition hover:bg-orange-500"
          >
            Kirish
          </button>
          <Link href="/" className="mt-5 inline-block text-sm text-zinc-500 hover:text-white">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    );
  }

  const currentUser = profile || user;
  const orders = [...(profile?.orders || [])].reverse();

  return (
    <main className="min-h-screen bg-[#0c0c0c] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-orange-400"
        >
          <ArrowLeft size={17} /> Bosh sahifa
        </Link>

        <div className="mb-9">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">
            TURBOPIZZA ACCOUNT
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Shaxsiy kabinet
          </h1>
          <p className="mt-3 text-zinc-500">
            Akkauntingiz va buyurtmalaringizni boshqaring.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
          <section className="h-fit rounded-3xl border border-white/10 bg-[#141414] p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-orange-700">
              <UserRound size={38} />
            </div>

            <h2 className="mt-5 text-2xl font-black">
              {currentUser.name}
            </h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-orange-500">
              TurboPizza mijoz
            </p>

            <div className="mt-7 space-y-5 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <Phone className="text-orange-500" size={19} />
                <div>
                  <p className="text-xs text-zinc-500">Telefon raqam</p>
                  <p className="mt-1 text-sm font-semibold">{currentUser.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-orange-500" size={19} />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">Oxirgi manzil</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {currentUser.lastAddress || "Hali manzil saqlanmagan"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={17} /> Akkauntdan chiqish
            </button>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Buyurtmalarim</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Barcha oldingi buyurtmalaringiz.
                </p>
              </div>
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
                {orders.length} ta
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#141414] px-6 py-16 text-center">
                <Pizza className="mx-auto mb-5 text-orange-500" size={48} />
                <h3 className="text-xl font-black">Hozircha buyurtmalar yo'q</h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Mazali pizzalardan birini tanlab, birinchi buyurtmangizni bering.
                </p>
                <Link
                  href="/#menu"
                  className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-500"
                >
                  Menyuni ko'rish
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => {
                  const info = statusInfo[order.status] || statusInfo["Yangi"];
                  const StatusIcon = info.icon;

                  return (
                    <article
                      key={order.orderId || index}
                      className="rounded-3xl border border-white/10 bg-[#141414] p-5 md:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <p className="text-xs text-zinc-500">Buyurtma raqami</p>
                          <p className="mt-1 font-bold">
                            #{String(order.orderId).slice(-8)}
                          </p>
                        </div>

                        <div className={`flex items-center gap-2 text-sm font-bold ${info.color}`}>
                          <StatusIcon size={17} />
                          {info.label}
                        </div>
                      </div>

                      <div className="my-5 space-y-3">
                        {(order.items || []).map((item, itemIndex) => (
                          <div key={item.productId || itemIndex} className="flex justify-between gap-3 text-sm">
                            <span className="text-zinc-300">
                              {item.name} <span className="text-zinc-500">× {item.quantity}</span>
                            </span>
                            <span className="shrink-0 font-semibold">
                              {money(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
                        <div>
                          <p className="text-xs text-zinc-500">Buyurtma sanasi</p>
                          <p className="mt-1 text-sm text-zinc-300">
                            {order.date
                              ? new Date(order.date).toLocaleString("uz-UZ")
                              : "—"}
                          </p>
                          <p className="mt-2 text-xs text-zinc-500">
                            {order.address || "Manzil ko'rsatilmagan"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Jami</p>
                          <p className="mt-1 text-xl font-black text-orange-400">
                            {money(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
