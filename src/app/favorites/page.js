"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, LoaderCircle } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { useStore } from "../../context/StoreContext";

export default function FavoritesPage() {
  const { favorites } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Mahsulotlarni yuklab bo'lmadi");
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const favoriteProducts = products.filter((product) =>
    favorites.includes(String(product.id))
  );

  return (
    <main className="min-h-screen bg-[#0c0c0c] px-4 py-12 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={18} />
          Bosh sahifa
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Heart size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black md:text-4xl">Sevimlilarim</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Siz saqlagan mahsulotlar: {favorites.length} ta
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle size={36} className="animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151515] px-6 py-20 text-center">
            <Heart size={54} className="mx-auto text-zinc-600" />
            <h2 className="mt-5 text-2xl font-black">
              Hozircha sevimlilar yo'q
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Yoqtirgan mahsulotlaringizdagi yurakchani bosing.
            </p>
            <Link
              href="/#menu"
              className="mt-7 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Menyani ko'rish
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
