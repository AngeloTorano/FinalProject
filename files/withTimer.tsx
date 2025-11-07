"use client"

import { useState, useEffect, useRef, useCallback } from "react" // Import useRef and useCallback
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // Import useRouter here
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import axios from "axios"
import {
  Heart,
  Users,
  FileText,
  Package,
  BarChart3,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  LayoutDashboard,
} from "lucide-react"
import { decryptObject } from "@/utils/decrypt"

interface SidebarProps {
  userRole: string
  collapsed?: boolean
  setCollapsed?: (v: boolean) => void
}

export const NAV_ITEMS = [
  // ... (Your NAV_ITEMS array remains unchanged)
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "Admin",
      "Country Coordinator",
      "City Coordinator",
      "Supplies Manager",
    ],
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
    roles: ["Admin", "Country Coordinator", "City Coordinator"],
  },
  {
    title: "Phase Forms",
    href: "/forms",
    icon: FileText,
    roles: ["Admin", "Country Coordinator", "City Coordinator"],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["Admin", "Supply Manager"],
  },
  {
    title: "Scheduling",
    href: "/scheduling",
    icon: Calendar,
    roles: ["Admin", "Country Coordinator", "City Coordinator"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["Admin", "Country Coordinator", "City Coordinator"],
  },
  {
    title: "Admin Panel",
    href: "/admin",
    icon: Settings,
    roles: ["Admin"],
  },
]

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
})

// --- Auto-logout settings ---
// Set to 30 minutes (in milliseconds)
//const INACTIVITY_TIMEOUT = 30 * 60 * 1000 
// Set to 1 minute (in milliseconds)
//const INACTIVITY_TIMEOUT = 1 * 60 * 1000
// Events that reset the timer
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove', 
  'mousedown', 
  'keypress', 
  'scroll', 
  'touchstart'
];

export function Sidebar({ collapsed: collapsedProp, setCollapsed: setCollapsedProp }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = typeof collapsedProp === "boolean" ? collapsedProp : internalCollapsed
  const setCollapsed = setCollapsedProp ?? setInternalCollapsed
  const pathname = usePathname()

  const userRoles = sessionStorage.getItem("userRole")

  const navigationItems = NAV_ITEMS

  const filteredItems = navigationItems.filter((item) => item.roles.includes(sessionStorage.getItem("userRole") || "Admin"))

  const [lowStockCount, setLowStockCount] = useState<number>(0)

  // --- Moved from LogoutButton ---
  const router = useRouter()
  // 'busy' state is for disabling the button
  const [busy, setBusy] = useState(false)
  // 'busyRef' is to prevent concurrent logout calls (e.g., timer + click)
  const busyRef = useRef(false) 
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // --- Logout Function (now in Sidebar component) ---
  const handleLogout = useCallback(async () => {
    // Use ref to prevent concurrent executions
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      const base = process.env.NEXT_PUBLIC_API_URL || ""
      const logoutUrl = base ? `${base}/api/auth/logout` : "/api/auth/logout"

      try {
        await fetch(logoutUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        })
      } catch (err) {
        console.error("Backend logout request failed:", err)
      }

      // Clear local session regardless of backend result
      try {
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("token")
        localStorage.removeItem("token")
      } catch (e) {
        console.error("Failed to clear storage:", e)
      }

      router.push("/")
    } finally {
      // No need to set busyRef/setBusy to false, as we're navigating away
      // But it's good practice in case navigation fails
      busyRef.current = false;
      setBusy(false);
    }
  }, [router]) // Dependency on router

  // --- Inactivity Timer Logic ---
  const resetTimer = useCallback(() => {
    // Clear existing timer
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    // Set a new timer
    timerId.current = setTimeout(() => {
      // When timer expires, call logout
      console.log("Inactivity timer expired. Logging out...");
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout]); // Depends on the stable handleLogout function

  // Effect to set up and clean up activity listeners
  useEffect(() => {
    // Handler for any user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Start the timer on component mount
    resetTimer();

    // Add listeners for all specified activity events
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      // Clear the timer
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      // Remove all event listeners
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]); // Runs once on mount (since resetTimer is stable)


  // --- Low Stock Count Effect ---
  useEffect(() => {
    let mounted = true
    const fetchLowStock = async () => {
      try {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("token") || localStorage.getItem("token") : null
        const res = await api.get("/api/supplies", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { low_stock: true, limit: 1000 },
        })

        let payload: any = null
        if (res.data?.encrypted_data) {
          payload = decryptObject(res.data.encrypted_data)
        } else {
          payload = res.data?.data ?? res.data
        }

        const count = Array.isArray(payload) ? payload.length : 0
        if (mounted) setLowStockCount(count)
      } catch (err) {
        console.warn("Failed to fetch low stock count", err)
      }
    }

    fetchLowStock()
    const id = setInterval(fetchLowStock, 60_000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])


  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* ... (Your existing Logo and Collapse Button JSX) ... */}
      <div className="flex items-center justify-between p-4 border-b ">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <Image
              src="/img/starkeyLogo.png"
              alt="Starkey Logo"
              width={200}
              height={200}
              className="rounded-md"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-8 w-8" />
          ) : (
            <ChevronLeft className="h-8 w-8" />
          )}
        </Button>
      </div>

      {/* ... (Your existing Navigation/ScrollArea JSX) ... */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-4">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn("w-full justify-start text-lg", collapsed && "px-2")}
                >
                  <div className="flex items-center w-full justify-between">
                    <div className="flex items-center">
                      <Icon className={cn("h-8 w-8", !collapsed && "mr-2")} />
                      {!collapsed && <span>{item.title}</span>}
                    </div>

                    {/* Show bell + count for Inventory item */}
                    {!collapsed && item.title === "Inventory" && lowStockCount > 0 && (
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 stroke-red-500 fill-red-500" />
                        <div className="text-xs font-semibold text-destructive">{lowStockCount}</div>
                      </div>
                    )}

                    {collapsed && item.title === "Inventory" && lowStockCount > 0 && (
                      <Bell className="h-5 w-5 stroke-red-500 fill-red-500" />
                    )}
                  </div>
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* ... (Your existing User Role Badge JSX) ... */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground mb-1">Current Role</div>
          <div className="text-sm font-medium">{userRoles}</div>
        </div>
      )}
      
      {/* Logout Button */}
      <div className={cn("p-4 border-t mt-auto", collapsed ? "text-center" : "")}>
        {/* Pass props to the LogoutButton */}
        <LogoutButton collapsed={collapsed} onLogout={handleLogout} busy={busy} />
      </div>
    </div>
  )
}

// --- Updated LogoutButton Component ---
// It is now a simpler "presentational" component
function LogoutButton({ 
  collapsed, 
  onLogout, 
  busy 
}: { 
  collapsed: boolean,
  onLogout: () => void,
  busy: boolean 
}) {
  // All logic (router, state, handler) has been moved to Sidebar
  if (collapsed) {
    return (
      <Button
        variant="ghost"
        className="w-full flex items-center justify-center p-2"
        onClick={onLogout} // Use prop
        disabled={busy}    // Use prop
        title="Sign Out"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-lg"
      onClick={onLogout} // Use prop
      disabled={busy}    // Use prop
    >
      <LogOut />
      Sign Out
    </Button>
  )
}