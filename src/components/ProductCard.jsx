"use client";

import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;

export default function ProductCard({ product }) {
  const { addToCart } = useStore();

  return (
    <article className="group overflow-hidden min-w-0 rounded-2xl border border-white/10 bg-[#151515] product-card transition duration-300 sm:rounded-3xl md:duration-500 md:hover:-translate-y-2 md:hover:scale-[1.01] hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-950/30">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-40 overflow-hidden bg-zinc-800 min-[400px]:h-44 sm:h-52 md:h-56">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          {product.category && (
            <span className="absolute left-2 top-2 max-w-[85%] truncate rounded-full border border-white/10 bg-black/70 px-2 py-1 text-[10px] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs font-semibold text-orange-400 backdrop-blur">
              {product.category}
            </span>
          )}
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 shadow-lg transition group-hover:opacity-100">
            <ArrowUpRight size={19} />
          </span>
        </div>

        <div className="min-w-0 px-3 pt-3 sm:px-5 sm:pt-5">
          <h3 className="break-words text-sm font-bold transition group-hover:text-orange-400 sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 sm:text-sm text-zinc-500">
            {product.description}
          </p>

          <div className="mt-3 border-t border-white/[0.06] pt-3 sm:mt-5 sm:pt-4">
            <p className="text-xs text-zinc-500">Boshlang&apos;ich narxi</p>
            <p className="mt-1 text-base font-black text-orange-400 sm:text-lg">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-5 sm:pt-3">
        <button
          onClick={() => addToCart(product)}
          className="flex h-10 w-full min-w-0 items-center justify-center gap-1 rounded-xl bg-orange-500 px-2 text-xs sm:h-11 sm:gap-2 sm:px-4 sm:text-sm font-bold text-white transition hover:bg-orange-600 active:scale-95"
        >
          <Plus size={18} />
          Savatchaga qo&apos;shish
        </button>
      </div>
    </article>
  );
}


