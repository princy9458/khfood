import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell, Shield } from "lucide-react";
import StoreProvider from "@/app/StoreProvider";
import GetAllAttributes from "@/lib/GetAllDetails/GetAllAttributes";
import GetAllCategories from "@/lib/GetAllDetails/GetAllCategories";
import GetAllProducts from "@/lib/GetAllDetails/GetAllProducts";
import GetCart from "@/lib/GetAllDetails/GetCart";
import GetUser from "@/lib/GetAllDetails/GetUser";
import GetAllForms from "@/lib/GetAllDetails/GetAllForms";

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  let isAuthenticated = false;

  let user: any = null;

  if (token) {
    try {
      let check = jwt.verify(token, JWT_SECRET);
      if (check) {
        isAuthenticated = true;
        user = jwt.decode(token);
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <StoreProvider>
      <GetUser user={user} />
      <GetAllAttributes />
      <GetAllCategories />
      <GetAllProducts />
      <GetCart />
      <GetAllForms />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#050505] flex flex-col min-w-0 min-h-screen">
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#C8A97E]/10 bg-[#0A0A0A]/80 backdrop-blur-xl px-8 sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="-ml-2 text-white/30 hover:text-[#C8A97E] transition-colors" />
              <div className="h-6 w-px bg-white/10" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/admin"
                      className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-[#C8A97E] transition-all"
                    >
                      BOUTIQUE MANAGEMENT
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/5 mx-4" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.4em]">
                      MARKET INSIGHTS
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-3 bg-[#C8A97E]/5 border border-[#C8A97E]/10 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  System Online
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all cursor-pointer">
                <Bell size={18} strokeWidth={2} />
              </div>
              <div className="h-11 w-11 rounded-xl bg-[#C8A97E] border border-[#C8A97E]/50 flex items-center justify-center text-black shadow-lg shadow-[#C8A97E]/20 overflow-hidden group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Shield size={20} strokeWidth={2.5} />
              </div>
            </div>
          </header>
          <div className="flex-1 flex flex-col p-8 md:p-12 w-full animate-in fade-in slide-in-from-bottom-2 duration-700 overflow-x-hidden relative">
            <div className="relative z-10 flex-1 flex flex-col">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  );
}
