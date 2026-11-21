"use client";

import { useState } from "react";
import {
  X, Plus, Minus, ShoppingBag, Trash2,
  CheckCircle2, MapPin, Phone, User,
  CreditCard, MessageSquare, Truck, Pizza,
  LoaderCircle
} from "lucide-react";
import { useStore } from "../context/StoreContext";

const money = (value) => `${Number(value || 0).toLocaleString("uz-UZ")} so'm`;

export default function CartDrawer() {
  const {
    cart, updateQuantity, clearCart, totalPrice,
    isCartOpen, setIsCartOpen
  } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "Naqd pul",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isCartOpen) return null;

  const closeCart = () => {
    if (!loading) setIsCartOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          totalPrice,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Buyurtmani yuborib bo'lmadi");
      }

      setSuccess(true);
      clearCart();

      setTimeout(() => {
        setSuccess(false);
        setIsCartOpen(false);
        setFormData({
          name: "",
          phone: "",
          address: "",
          paymentMethod: "Naqd pul",
          comment: "",
        });
      }, 2500);
    } catch (err) {
      setError(err.message || "Server bilan bog'lanishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/70 focus:bg-white/[0.07]";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <aside className="flex h-full w-full max-w-lg flex-col border-l border-white/10 bg-[#111111] text-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-orange-500" size={21} />
              <h2 className="text-xl font-black">Savatcha</h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {cart.length} xil mahsulot · {cart.reduce((s, i) => s + i.quantity, 0)} dona
            </p>
          </div>
          <button
            onClick={closeCart}
            disabled={loading}
            aria-label="Savatchani yopish"
            className="rounded-xl border border-white/10 p-2.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={21} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 size={55} className="text-green-400" />
            </div>
            <h3 className="text-3xl font-black">Buyurtma qabul qilindi!</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-400">
              Rahmat! TurboPizza jamoasi buyurtmangizni tayyorlashni boshlaydi.
            </p>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10">
              <Pizza size={48} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-black">Savatcha bo'sh</h3>
            <p className="mt-3 text-sm text-zinc-500">
              Hali mazali pizza tanlamadingiz. Menyudan sevimli pitsangizni tanlang!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-7 rounded-xl bg-orange-500 px-7 py-3 font-bold transition hover:bg-orange-600"
            >
              Menyuga qaytish
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-bold">Tanlangan mahsulotlar</h3>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition hover:text-red-400"
                >
                  <Trash2 size={14} /> Tozalash
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <h4 className="truncate font-bold">{item.name}</h4>
                      <p className="mt-1 text-sm font-bold text-orange-400">
                        {money(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Kamaytirish"
                        className="rounded-lg border border-white/10 p-1.5 transition hover:border-orange-500 hover:text-orange-400"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-5 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Ko'paytirish"
                        className="rounded-lg border border-white/10 p-1.5 transition hover:border-orange-500 hover:text-orange-400"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="self-center text-right text-sm font-black">
                    {money(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                <div className="mb-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Checkout</p>
                  <h3 className="mt-1 text-xl font-black">Yetkazib berish</h3>
                </div>

                <label className="relative block">
                  <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    required
                    minLength={2}
                    placeholder="Ism va familiya"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`${fieldClass} pl-11`}
                  />
                </label>

                <label className="relative block">
                  <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    required
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${fieldClass} pl-11`}
                  />
                </label>

                <label className="relative block">
                  <MapPin size={17} className="absolute left-4 top-4 text-zinc-500" />
                  <textarea
                    required
                    minLength={5}
                    rows={2}
                    placeholder="To'liq manzil: ko'cha, uy, xonadon"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`${fieldClass} resize-none pl-11`}
                  />
                </label>

                <label className="relative block">
                  <CreditCard size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className={`${fieldClass} appearance-none pl-11`}
                  >
                    <option className="bg-[#111111]" value="Naqd pul">Naqd pul orqali</option>
                    <option className="bg-[#111111]" value="Click / Payme">Click / Payme</option>
                    <option className="bg-[#111111]" value="Terminal">Kuryer terminaliga</option>
                  </select>
                </label>

                <label className="relative block">
                  <MessageSquare size={17} className="absolute left-4 top-4 text-zinc-500" />
                  <textarea
                    rows={2}
                    placeholder="Kuryer uchun izoh (ixtiyoriy)"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className={`${fieldClass} resize-none pl-11`}
                  />
                </label>

                {error && (
                  <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Mahsulotlar</span>
                    <span>{money(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span className="flex items-center gap-2"><Truck size={15}/> Yetkazib berish</span>
                    <span>Keyin hisoblanadi</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="font-bold">Jami</span>
                    <span className="text-xl font-black text-orange-400">{money(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 py-4 font-black shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <><LoaderCircle size={20} className="animate-spin"/> Yuborilmoqda...</>
                  ) : (
                    <><ShoppingBag size={19}/> Buyurtmani tasdiqlash</>
                  )}
                </button>
                <p className="pb-3 text-center text-[11px] text-zinc-600">
                  Buyurtma berish orqali ma'lumotlaringizni yuborishga rozilik bildirasiz.
                </p>
              </form>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
