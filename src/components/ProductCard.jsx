"use client";

import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;

export default function ProductCard({ product }) {
  const { addToCart } = useStore();

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#151515] product-card transition duration-500 hover:-translate-y-3 hover:scale-[1.015] hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-950/30">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-zinc-800">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          {product.category && (
            <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-semibold text-orange-400 backdrop-blur">
              {product.category}
            </span>
          )}
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 shadow-lg transition group-hover:opacity-100">
            <ArrowUpRight size={19} />
          </span>
        </div>

        <div className="px-5 pt-5">
          <h3 className="text-lg font-bold transition group-hover:text-orange-400">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-500">
            {product.description}
          </p>

          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <p className="text-xs text-zinc-500">Boshlang'ich narxi</p>
            <p className="mt-1 text-lg font-black text-orange-400">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-3">
        <button
          onClick={() => addToCart(product)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-95"
        >
          <Plus size={18} />
          Savatchaga qo'shish
        </button>
      </div>
    </article>
  );
}
