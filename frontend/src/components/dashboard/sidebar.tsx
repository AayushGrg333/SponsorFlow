"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Users,
  Briefcase,
  Bell,
} from "lucide-react"

interface SidebarProps {
  userType: "influencer" | "company"
}

const influencerNavItems = [
  { href: "/dashboard/influencer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/influencer/discover", label: "Discover Brands", icon: Search },
  { href: "/dashboard/influencer/campaigns", label: "My Campaigns", icon: Briefcase },
  { href: "/dashboard/influencer/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/influencer/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/influencer/profile", label: "Profile", icon: User },
]

const companyNavItems = [
  { href: "/dashboard/company", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/company/discover", label: "Find Influencers", icon: Search },
  { href: "/dashboard/company/campaigns", label: "Campaigns", icon: Briefcase },
  { href: "/dashboard/company/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/company/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/company/profile", label: "Company Profile", icon: Building2 },
]

export function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navItems = userType === "influencer" ? influencerNavItems : companyNavItems

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
          <img src="/sponsorflow_logo.png" alt="SponsorFlow Logo"  className="h-10 w-10" />

          </div>
          <span className="text-xl font-bold text-foreground">SponsorFlow</span>
        </Link>
      </div>

      {/* User Type Badge */}
      <div className="border-b border-border p-4">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2",
            userType === "influencer" ? "bg-primary/10" : "bg-accent/10",
          )}
        >
          {userType === "influencer" ? (
            <Users className="h-4 w-4 text-primary" />
          ) : (
            <Building2 className="h-4 w-4 text-accent" />
          )}
          <span
            className={cn("text-sm font-medium capitalize", userType === "influencer" ? "text-primary" : "text-accent")}
          >
            {userType} Account
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="border-t border-border p-4">
        <Link
          href={`/dashboard/${userType}/settings`}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card lg:flex">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
            <img src="/sponsorflow_logo.png" alt="SponsorFlow Logo"  className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold text-foreground">SponsorFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed right-0 top-0 z-50 flex h-screen w-64 flex-col border-l border-border bg-card lg:hidden">
            <NavContent />
          </aside>
        </>
      )}
    </>
  )
}
