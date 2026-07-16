import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, CreditCard, TrendingUp, Package, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders & Payments — Tumie's Collections" },
      { name: "description", content: "Track customer orders and payments across hair, makeup and fashion." },
    ],
  }),
  component: OrdersPage,
});

type OrderStatus = "Paid" | "Pending" | "Refunded" | "Shipped";
type Method = "Card" | "EFT" | "PayFast" | "Cash";

interface Order {
  id: string;
  customer: string;
  email: string;
  category: "Hair" | "Makeup" | "Fashion";
  item: string;
  amount: number;
  method: Method;
  status: OrderStatus;
  date: string;
}

const ORDERS: Order[] = [
  { id: "TC-1042", customer: "Naledi Khumalo", email: "naledi@example.com", category: "Hair", item: "Brazilian Body Wave 22\"", amount: 2450, method: "Card", status: "Paid", date: "2026-07-15" },
  { id: "TC-1041", customer: "Zanele Dlamini", email: "zanele@example.com", category: "Makeup", item: "Matte Lip Set (5pc)", amount: 680, method: "PayFast", status: "Shipped", date: "2026-07-15" },
  { id: "TC-1040", customer: "Refilwe Mokoena", email: "refilwe@example.com", category: "Fashion", item: "Silk Wrap Dress — Peach", amount: 1290, method: "Card", status: "Paid", date: "2026-07-14" },
  { id: "TC-1039", customer: "Amahle Nkosi", email: "amahle@example.com", category: "Hair", item: "Peruvian Deep Curl 18\"", amount: 2100, method: "EFT", status: "Pending", date: "2026-07-14" },
  { id: "TC-1038", customer: "Karabo Sithole", email: "karabo@example.com", category: "Makeup", item: "Glow Foundation + Setter", amount: 540, method: "Card", status: "Paid", date: "2026-07-13" },
  { id: "TC-1037", customer: "Lerato Mabaso", email: "lerato@example.com", category: "Fashion", item: "Two-piece Satin Set", amount: 980, method: "Cash", status: "Paid", date: "2026-07-13" },
  { id: "TC-1036", customer: "Palesa Ndlovu", email: "palesa@example.com", category: "Makeup", item: "Bridal Glam Kit", amount: 1750, method: "Card", status: "Refunded", date: "2026-07-12" },
  { id: "TC-1035", customer: "Boitumelo Tau", email: "boitu@example.com", category: "Hair", item: "Closure 4x4 Straight", amount: 890, method: "PayFast", status: "Paid", date: "2026-07-12" },
  { id: "TC-1034", customer: "Nomvula Zulu", email: "nomvula@example.com", category: "Fashion", item: "Peach Blazer", amount: 1450, method: "Card", status: "Shipped", date: "2026-07-11" },
  { id: "TC-1033", customer: "Thandiwe Cele", email: "thandi@example.com", category: "Makeup", item: "Lash Bundle (10 pairs)", amount: 420, method: "EFT", status: "Paid", date: "2026-07-11" },
];

const statusStyles: Record<OrderStatus, string> = {
  Paid: "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
  Pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  Shipped: "bg-brand-blue/15 text-brand-blue border-brand-blue/30",
  Refunded: "bg-destructive/15 text-destructive border-destructive/30",
};

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);
}

function OrdersPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ORDERS;
    return ORDERS.filter(
      (o) =>
        o.customer.toLowerCase().includes(s) ||
        o.id.toLowerCase().includes(s) ||
        o.item.toLowerCase().includes(s) ||
        o.email.toLowerCase().includes(s),
    );
  }, [q]);

  const paid = ORDERS.filter((o) => o.status === "Paid" || o.status === "Shipped");
  const revenue = paid.reduce((s, o) => s + o.amount, 0);
  const pending = ORDERS.filter((o) => o.status === "Pending").reduce((s, o) => s + o.amount, 0);
  const refunded = ORDERS.filter((o) => o.status === "Refunded").reduce((s, o) => s + o.amount, 0);

  const stats = [
    { label: "Total Revenue", value: formatZAR(revenue), icon: TrendingUp, tint: "text-brand-orange" },
    { label: "Orders", value: String(ORDERS.length), icon: ShoppingBag, tint: "text-brand-purple" },
    { label: "Pending Payments", value: formatZAR(pending), icon: CreditCard, tint: "text-brand-pink" },
    { label: "Refunded", value: formatZAR(refunded), icon: Package, tint: "text-brand-blue" },
  ];

  const payments = ORDERS.map((o) => ({
    id: o.id,
    customer: o.customer,
    method: o.method,
    amount: o.amount,
    status: o.status,
    date: o.date,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Orders & Payments"
        description="Live view of customer orders and payment activity across hair, makeup and fashion."
        icon={ShoppingBag}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <s.icon className={`h-4 w-4 ${s.tint}`} />
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value="orders" className="glass-card rounded-2xl p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full">{o.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">{o.item}</TableCell>
                  <TableCell className="font-semibold">{formatZAR(o.amount)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[o.status]}`}>
                      {o.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.date}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="p-8 text-center text-muted-foreground">
                    No orders match "{q}".
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="payments" className="glass-card rounded-2xl p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.customer}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">{p.method}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatZAR(p.amount)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
