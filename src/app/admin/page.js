
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Pizza,
  Users,
  Settings,
  LogOut,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

const money = (value) =>
  `${Number(value || 0).toLocaleString("uz-UZ")} so'm`;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Buyurtmalar", icon: ShoppingBag },
  { id: "products", label: "Mahsulotlar", icon: Pizza },
  { id: "customers", label: "Mijozlar", icon: Users },
  { id: "settings", label: "Sozlamalar", icon: Settings },
];

const statuses = [
  "Yangi",
  "Tayyorlanmoqda",
  "Yo'lda",
  "Yetkazildi",
  "Bekor qilindi",
];

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Go'shtli",
};

export default function AdminPage() {
  const { user, authLoading, setIsAuthOpen, logout } = useStore();

  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);

  const headers = useCallback(
    (json = false) => ({
      Authorization: `Bearer ${token}`,
      ...(json ? { "Content-Type": "application/json" } : {}),
    }),
    [token]
  );

  const request = useCallback(
    async (url, options = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers(Boolean(options.body)),
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "So'rov bajarilmadi.");
      }

      return data;
    },
    [headers]
  );

  const loadAll = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [admin, dashboard, orderData, customerData, productData] =
        await Promise.all([
          request("/api/admin/me"),
          request("/api/admin/stats"),
          request("/api/admin/orders"),
          request("/api/admin/customers"),
          request("/api/products"),
        ]);

      if (!admin.isAdmin) {
        throw new Error("Admin ruxsati mavjud emas.");
      }

      setAuthorized(true);
      setStats(dashboard);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setCustomers(Array.isArray(customerData) ? customerData : []);
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      setError(err.message);
      setAuthorized(false);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, [token, request]);

  useEffect(() => {
    if (authLoading) return;

    const savedToken = localStorage.getItem("turbo_token");

    if (!savedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecking(false);
      setToken("");
      setAuthorized(false);
      return;
    }

    setToken(savedToken);
  }, [authLoading, user]);

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecking(true);
      loadAll();
    }
  }, [token, loadAll]);

  const notify = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  };

  const updateOrder = async (orderId, status) => {
    try {
      await request(
        `/api/admin/orders/${encodeURIComponent(orderId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      await loadAll();
      notify("Buyurtma holati yangilandi.");
    } catch (err) {
      setError(err.message);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price || ""),
      image: product.image || "",
      category: product.category || "Go'shtli",
    });
    setModalOpen(true);
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    const body = {
      ...productForm,
      price: Number(productForm.price),
    };

    try {
      if (editingProduct) {
        await request(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        notify("Mahsulot yangilandi.");
      } else {
        await request("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(body),
        });
        notify("Yangi pizza qo'shildi.");
      }

      setModalOpen(false);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProduct = async (product) => {
    if (!confirm(`${product.name} mahsulotini o'chirmoqchimisiz?`)) {
      return;
    }

    try {
      await request(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      await loadAll();
      notify("Mahsulot o'chirildi.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthorized(false);
    setToken("");
  };

  const filteredOrders = orders.filter((order) =>
    `${order.orderId} ${order.customerName} ${order.customerPhone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center text-white">
        <RefreshCw className="animate-spin text-orange-500" size={30} />
      </div>
    );
  }

  if (!token || !authorized) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151515] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <ShieldCheck size={34} />
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            Bu sahifaga faqat TurboPizza administratorlari kira oladi.
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          <button
            onClick={() => setIsAuthOpen(true)}
            className="mt-7 w-full rounded-xl bg-orange-500 py-3.5 font-bold text-black transition hover:bg-orange-400"
          >
            Akkauntga kirish
          </button>
          <Link
            href="/"
            className="mt-5 inline-block text-sm text-gray-400 hover:text-white"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Jami buyurtmalar",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Mijozlar",
      value: stats.totalCustomers || 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Mahsulotlar",
      value: stats.totalProducts || 0,
      icon: Pizza,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      label: "Daromad",
      value: money(stats.totalRevenue),
      icon: Wallet,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {notice && (
        <div className="fixed right-5 top-5 z-[100] rounded-xl border border-green-500/20 bg-[#17251b] px-5 py-3 text-sm text-green-400 shadow-xl">
          {notice}
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#101010] p-5 md:flex md:flex-col">
          <Link href="/" className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-xl font-black text-black">
              T
            </div>
            <div>
              <div className="text-lg font-black tracking-wide">
                TURBO<span className="text-orange-500">PIZZA</span>
              </div>
              <div className="text-[10px] uppercase tracking-[3px] text-gray-500">
                Administration
              </div>
            </div>
          </Link>

          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-600">
            Asosiy menyu
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-orange-500 text-black"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold">
              {user?.name || "Administrator"}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {user?.phone || "Admin akkaunti"}
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 text-xs text-red-400 hover:text-red-300"
            >
              <LogOut size={15} />
              Chiqish
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0b0b0b]/90 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-4 md:px-9">
            <div>
              <div className="text-xs text-gray-500">TurboPizza / Admin</div>
              <h1 className="mt-1 text-xl font-bold">
                {navItems.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAll}
                disabled={loading}
                className="rounded-xl border border-white/10 p-2.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
                title="Yangilash"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
              <div className="hidden rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 sm:block">
                <ShieldCheck size={14} className="mr-2 inline" />
                Admin
              </div>
            </div>

            <div className="flex w-full gap-2 overflow-x-auto pb-1 md:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSearch("");
                    }}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs ${
                      activeTab === item.id
                        ? "bg-orange-500 text-black"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="p-3 sm:p-5 md:p-9">
            {error && (
              <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                <span>
                  <AlertCircle size={17} className="mr-2 inline" />
                  {error}
                </span>
                <button onClick={() => setError("")}>
                  <X size={17} />
                </button>
              </div>
            )}

            {activeTab === "dashboard" && (
              <section>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Xush kelibsiz!</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    TurboPizza biznesingiz holati va statistikasi.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.label}
                        className="rounded-2xl border border-white/10 bg-[#141414] p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {card.label}
                          </span>
                          <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                            <Icon size={20} />
                          </div>
                        </div>
                        <div className="mt-5 break-words text-2xl font-bold">
                          {card.value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold">So&apos;nggi buyurtmalar</h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs font-semibold text-orange-400"
                      >
                        Barchasi
                      </button>
                    </div>

                    {orders.slice(0, 5).length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500">
                        Hozircha buyurtmalar yo&apos;q.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order, index) => (
                          <div
                            key={`${order.orderId}-${index}`}
                            className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 last:border-0"
                          >
                            <div>
                              <div className="text-sm font-semibold">
                                #{order.orderId}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {order.customerName || "Mijoz"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold">
                                {money(order.totalAmount)}
                              </div>
                              <div className="mt-1 text-xs text-orange-400">
                                {order.status || "Yangi"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
                    <h3 className="font-bold">Buyurtmalar holati</h3>
                    <div className="mt-6 space-y-5">
                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-gray-400">Yangi</span>
                          <span>{stats.pendingOrders || 0}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-orange-500"
                            style={{
                              width: `${
                                orders.length
                                  ? Math.min(
                                      100,
                                      (Number(stats.pendingOrders || 0) /
                                        orders.length) *
                                        100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <TrendingUp size={17} className="text-green-400" />
                          Yetkazilgan buyurtmalar
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                          {
                            orders.filter(
                              (order) => order.status === "Yetkazildi"
                            ).length
                          }
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock size={17} className="text-orange-400" />
                          Jarayondagi buyurtmalar
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                          {
                            orders.filter((order) =>
                              ["Yangi", "Tayyorlanmoqda", "Yo'lda"].includes(
                                order.status || "Yangi"
                              )
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "orders" && (
              <section>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Buyurtmalar</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Barcha mijozlar buyurtmalarini boshqaring.
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Jami: {orders.length}
                  </div>
                </div>

                <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#141414] px-4">
                  <Search size={18} className="text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buyurtma, ism yoki telefon..."
                    className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-600"
                  />
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#141414]">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="border-b border-white/10 text-xs text-gray-500">
                      <tr>
                        <th className="p-4">Buyurtma</th>
                        <th className="p-4">Mijoz</th>
                        <th className="p-4">Manzil</th>
                        <th className="p-4">Summa</th>
                        <th className="p-4">To&apos;lov</th>
                        <th className="p-4">Holati</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr
                          key={`${order.orderId}-${index}`}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="p-4 font-bold">
                            #{order.orderId}
                            <div className="mt-1 text-xs font-normal text-gray-500">
                              {order.date
                                ? new Date(order.date).toLocaleDateString("uz-UZ")
                                : ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <div>{order.customerName || "Mijoz"}</div>
                            <div className="mt-1 text-xs text-gray-500">
                              {order.customerPhone}
                            </div>
                          </td>
                          <td className="max-w-48 p-4 text-gray-400">
                            {order.address || "—"}
                          </td>
                          <td className="p-4 font-semibold">
                            {money(order.totalAmount)}
                          </td>
                          <td className="p-4 text-gray-400">
                            {order.paymentMethod || "—"}
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status || "Yangi"}
                              onChange={(e) =>
                                updateOrder(order.orderId, e.target.value)
                              }
                              className="max-w-44 rounded-lg border border-white/10 bg-[#202020] px-3 py-2 text-xs outline-none focus:border-orange-500"
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <p className="p-10 text-center text-sm text-gray-500">
                      Buyurtmalar topilmadi.
                    </p>
                  )}
                </div>
              </section>
            )}

            {activeTab === "products" && (
              <section>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Mahsulotlar</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Pizzalarni qo&apos;shing, tahrirlang yoki o&apos;chiring.
                    </p>
                  </div>
                  <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                  >
                    <Plus size={18} />
                    Pizza qo&apos;shish
                  </button>
                </div>

                <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#141414] px-4">
                  <Search size={18} className="text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pizza nomi yoki kategoriya..."
                    className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]"
                    >
                      <div className="h-40 overflow-hidden bg-white/5 sm:h-48">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="mt-1 text-xs text-gray-500">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-sm font-bold text-orange-400">
                            {money(product.price)}
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-gray-500">
                          {product.description}
                        </p>
                        <div className="mt-5 flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-xs text-gray-300 hover:bg-white/5"
                          >
                            <Pencil size={14} />
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => deleteProduct(product)}
                            className="flex items-center justify-center rounded-lg border border-red-500/20 px-4 py-2.5 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <p className="py-12 text-center text-sm text-gray-500">
                    Mahsulotlar topilmadi.
                  </p>
                )}
              </section>
            )}

            {activeTab === "customers" && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Mijozlar</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    TurboPizza foydalanuvchilari ro&apos;yxati.
                  </p>
                </div>

                <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#141414] px-4">
                  <Search size={18} className="text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ism yoki telefon raqami..."
                    className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-600"
                  />
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#141414]">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="border-b border-white/10 text-xs text-gray-500">
                      <tr>
                        <th className="p-4">Mijoz</th>
                        <th className="p-4">Telefon</th>
                        <th className="p-4">Manzil</th>
                        <th className="p-4">Buyurtmalar</th>
                        <th className="p-4">Xarajat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="p-4 font-semibold">
                            {customer.name || "Ismsiz"}
                          </td>
                          <td className="p-4 text-gray-400">
                            {customer.phone}
                          </td>
                          <td className="p-4 text-gray-400">
                            {customer.lastAddress || "—"}
                          </td>
                          <td className="p-4">
                            {customer.totalOrders}
                          </td>
                          <td className="p-4 font-semibold text-orange-400">
                            {money(customer.totalSpent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCustomers.length === 0 && (
                    <p className="p-10 text-center text-sm text-gray-500">
                      Mijozlar topilmadi.
                    </p>
                  )}
                </div>
              </section>
            )}

            {activeTab === "settings" && (
              <section>
                <h2 className="text-2xl font-bold">Sozlamalar</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Admin panel va loyiha ma&apos;lumotlari.
                </p>
                <div className="mt-6 max-w-xl rounded-2xl border border-white/10 bg-[#141414] p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-orange-400" size={24} />
                    <div>
                      <div className="font-bold">Administrator akkaunti</div>
                      <div className="mt-1 text-xs text-gray-500">
                        Himoyalangan admin kirishi
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                      <span className="text-gray-500">Ism</span>
                      <span>{user?.name || "Administrator"}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                      <span className="text-gray-500">Telefon</span>
                      <span>{user?.phone || "—"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Loyiha</span>
                      <span>TurboPizza</span>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveProduct}
            className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-2xl sm:rounded-3xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <h2 className="text-xl font-bold">
                {editingProduct ? "Pizzani tahrirlash" : "Yangi pizza"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs text-gray-400">
                  Pizza nomi
                </label>
                <input
                  required
                  minLength={2}
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Masalan: Cheese Premium"
                  className="w-full rounded-xl border border-white/10 bg-[#222] px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-gray-400">
                  Tavsif
                </label>
                <textarea
                  required
                  minLength={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Pizza tarkibi..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#222] px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Narxi (so&apos;m)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: e.target.value,
                      })
                    }
                    placeholder="75000"
                    className="w-full rounded-xl border border-white/10 bg-[#222] px-4 py-3 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Kategoriya
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#222] px-3 py-3 text-sm outline-none focus:border-orange-500"
                  >
                    <option>Go&apos;shtli</option>
                    <option>Klassik</option>
                    <option>Pishloqli</option>
                    <option>Achchiq</option>
                    <option>Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-gray-400">
                  Rasm URL manzili
                </label>
                <input
                  required
                  type="url"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-[#222] px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-xl bg-orange-500 py-3.5 font-bold text-black transition hover:bg-orange-400"
            >
              {editingProduct ? "O'zgarishlarni saqlash" : "Pizza qo&apos;shish"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
