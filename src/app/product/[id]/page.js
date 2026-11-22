"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Minus, Plus, ShoppingBag, Check,
  Clock3, ShieldCheck, Truck, Pizza
} from "lucide-react";
import { useStore } from "../../../context/StoreContext";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;

const sizes = [
  { label: "25 sm", difference: -10000 },
  { label: "30 sm", difference: 0 },
  { label: "35 sm", difference: 15000 },
];

const extrasList = [
  { id: "cheese", name: "Qo'shimcha pishloq", price: 10000 },
  { id: "mushroom", name: "Qo'ziqorin", price: 7000 },
  { id: "olive", name: "Zaytun", price: 5000 },
];

export default function ProductDetailsPage() {
  const params = useParams();
  const { addToCart, setIsCartOpen } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [size, setSize] = useState("30 sm");
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);

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

  const product = products.find(
    (item) => String(item.id) === String(params.id)
  );

  const isPizza = product?.mainCategory === "Pizzalar";

  const selectedSize = sizes.find((item) => item.label === size);

  const extrasPrice = useMemo(
    () =>
      selectedExtras.reduce((sum, id) => {
        const extra = extrasList.find((item) => item.id === id);
        return sum + (extra?.price || 0);
      }, 0),
    [selectedExtras]
  );

  const unitPrice = product
    ? Number(product.price) +
      (isPizza ? selectedSize?.difference || 0 : 0) +
      extrasPrice
    : 0;

  const relatedProducts = product
    ? products
        .filter(
          (item) =>
            item.mainCategory === product.mainCategory &&
            String(item.id) !== String(product.id)
        )
        .slice(0, 4)
    : [];

  const toggleExtra = (id) => {
    setSelectedExtras((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleAddToCart = () => {
    if (!product) return;

    const extraNames = selectedExtras
      .map((id) => extrasList.find((item) => item.id === id)?.name)
      .filter(Boolean);

    const cartProduct = {
      ...product,
      id: `${product.id}-${isPizza ? size : "standard"}-${selectedExtras.slice().sort().join("-") || "no-extra"}`,
      productId: product.id,
      name: `${product.name}${isPizza ? ` (${size})` : ""}`,
      price: unitPrice,
      size: isPizza ? size : null,
      extras: extraNames,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0c0c] px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-8 w-40 rounded-lg bg-zinc-800" />
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div className="aspect-square rounded-3xl bg-zinc-800" />
            <div className="space-y-5">
              <div className="h-10 w-2/3 rounded-lg bg-zinc-800" />
              <div className="h-5 w-full rounded-lg bg-zinc-800" />
              <div className="h-5 w-1/2 rounded-lg bg-zinc-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0c0c0c] px-4 text-center text-white">
        <Pizza size={48} className="text-orange-500" />
        <h1 className="mt-5 text-2xl font-black">
          {error || "Mahsulot topilmadi"}
        </h1>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
        >
          Bosh sahifaga qaytish
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0c0c] px-3 pb-14 pt-6 text-white sm:px-4 sm:pb-20 sm:pt-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={18} />
          Menyuga qaytish
        </Link>

        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative">
            <div className="absolute inset-10 rounded-full bg-orange-500/15 blur-[90px]" />
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] border border-white/10 bg-[#171717]">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
              {product.category && (
                <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/75 px-4 py-2 text-sm font-bold text-orange-400 backdrop-blur">
                  {product.category}
                </span>
              )}
            </div>
          </div>

          <div className="py-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              {product.mainCategory}
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-8 text-zinc-400">
              {product.description}
            </p>

            <div className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-4 sm:mt-7 sm:p-5">
              <p className="text-sm text-zinc-400">Umumiy narx</p>
              <p className="mt-1 text-3xl font-black text-orange-400">
                {formatPrice(unitPrice * quantity)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                1 dona: {formatPrice(unitPrice)}
              </p>
            </div>

            {isPizza && (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold">Pizza o&apos;lchamini tanlang</h2>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {sizes.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setSize(item.label)}
                      className={`rounded-xl border px-1 py-3 text-center transition sm:px-3 sm:py-4 ${
                        size === item.label
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-white/10 bg-[#171717] text-zinc-300 hover:border-orange-500/50"
                      }`}
                    >
                      <span className="block text-base font-black sm:text-lg">{item.label}</span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {item.difference === 0
                          ? "Asosiy narx"
                          : item.difference > 0
                            ? `+${formatPrice(item.difference)}`
                            : `-${formatPrice(Math.abs(item.difference))}`}
                      </span>
                      {size === item.label && (
                        <Check size={16} className="mx-auto mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isPizza && (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold">Qo&apos;shimcha masalliqlar</h2>
                <div className="space-y-3">
                  {extrasList.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#171717] p-4 transition hover:border-orange-500/40"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                          className="h-5 w-5 accent-orange-500"
                        />
                        <span className="font-medium text-zinc-200">
                          {extra.name}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-orange-400">
                        +{formatPrice(extra.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center sm:gap-4">
              <div className="flex h-14 items-center gap-5 rounded-xl border border-white/10 bg-[#171717] px-4">
                <button
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Kamaytirish"
                  className="text-zinc-300 transition hover:text-orange-400"
                >
                  <Minus size={19} />
                </button>
                <span className="min-w-5 text-center text-lg font-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((value) => Math.min(20, value + 1))}
                  aria-label="Ko'paytirish"
                  className="text-zinc-300 transition hover:text-orange-400"
                >
                  <Plus size={19} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex h-14 w-full flex-1 items-center justify-center gap-3 min-[420px]:w-auto rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 font-black text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-1 hover:shadow-orange-600/30 active:scale-[0.98]"
              >
                <ShoppingBag size={20} />
                Savatchaga qo&apos;shish
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 border-t border-white/10 pt-6">
              <div className="text-center">
                <Truck className="mx-auto text-orange-400" size={22} />
                <p className="mt-2 text-xs text-zinc-500">Yetkazib berish</p>
              </div>
              <div className="text-center">
                <Clock3 className="mx-auto text-orange-400" size={22} />
                <p className="mt-2 text-xs text-zinc-500">Taxminan 30 daqiqa</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="mx-auto text-orange-400" size={22} />
                <p className="mt-2 text-xs text-zinc-500">Sifat kafolati</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="text-2xl font-black md:text-3xl">
              Yana <span className="text-orange-500">sizga yoqishi mumkin</span>
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151515] transition hover:-translate-y-2 hover:border-orange-500/40"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-32 w-full object-cover sm:h-44 transition duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="font-bold group-hover:text-orange-400">
                      {item.name}
                    </h3>
                    <p className="mt-2 font-black text-orange-400">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
