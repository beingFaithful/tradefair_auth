import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const params = await searchParams;
  const reference = params?.reference || "Unknown";

  return (
    <div className="min-h-screen bg-background text-foreground bg-mesh flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-dark rounded-[2.5rem] border-white/5 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-700 w-full"></div>
        <CardHeader className="text-center pt-10 pb-2">
          <div className="mx-auto bg-emerald-500/10 text-emerald-400 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 border border-emerald-500/20 relative">
            <svg
              className="w-10 h-10 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-extrabold text-white tracking-tight">Payment Successful!</CardTitle>
          <CardDescription className="text-slate-400 mt-2 font-medium">
            Your transaction has been verified and your order is confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Transaction Reference:</span>
              <span className="font-mono font-bold text-white">{reference}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full py-8 text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-2xl shadow-emerald-500/20">
              <Link href="/buyer/orders">View My Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full py-8 text-base font-bold border-white/5 bg-white/[0.02] text-white hover:bg-white/[0.05] rounded-2xl">
              <Link href="/buyer">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
