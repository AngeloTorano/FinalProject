"use client"

import React, { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Activity, Package, Map } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/role-guard"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("userRole")
      setUserRole(stored || "Admin")
    } catch (e) {
      setUserRole("Admin")
    }
  }, [])

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("userRole")
    } catch (e) {}
    window.location.href = "/"
  }

  const getRoleBasedQuickActions = () => {
    const baseActions = [
      {
        href: "/patients",
        title: "Patient Management",
        description: "Register new patients, update records, and manage patient data",
        roles: ["Admin", "Country Coordinator", "City Coordinator"],
      },
      {
        href: "/forms",
        title: "Medical Forms",
        description: "Access Phase 1, 2, and 3 forms for patient assessments",
        roles: ["Admin", "Country Coordinator", "City Coordinator"],
      },
    ]

    const roleSpecificActions = [
      {
        href: "/map",
        title: "Patient Map",
        description: "View patient locations and distribution across regions",
        roles: ["Admin", "Country Coordinator", "City Coordinator"],
      },
      {
        href: "/inventory",
        title: "Inventory Management",
        description: "Track supplies, hearing aids, and medical equipment",
        roles: ["Admin", "Supplies Manager", "Country Coordinator"],
      },
      {
        href: "/reports",
        title: "Reports & Analytics",
        description: "Generate reports and view system analytics",
        roles: ["Admin", "Country Coordinator", "City Coordinator"],
      },
      {
        href: "/admin",
        title: "Admin Panel",
        description: "Manage users, system settings, and monitor activity",
        roles: ["Admin"],
      },
      {
        href: "/scheduling",
        title: "Scheduling",
        description: "Manage mission schedules and appointments",
        roles: ["Admin", "Country Coordinator"],
      },
    ]

    return [...baseActions, ...roleSpecificActions].filter((action) => action.roles.includes(userRole || ""))
  }

  return (
    <div className="min-h-screen bg-background flex">

      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <Badge variant="secondary">{userRole}</Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-balance">Welcome to MediEase</h2>
              <p className="text-muted-foreground">Manage patient records, inventory, and generate reports efficiently.</p>
            </div>

            <RoleGuard allowedRoles={["Admin", "Country Coordinator", "City Coordinator"]} userRole={userRole || ""}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,847</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hearing Aids Fitted</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">892</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                  </CardContent>
                </Card>

                <RoleGuard allowedRoles={["Admin", "Supplies Manager", "Country Coordinator"]} userRole={userRole || ""}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Supplies in Stock</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">456</div>
                      <p className="text-xs text-muted-foreground">-3% from last month</p>
                    </CardContent>
                  </Card>
                </RoleGuard>
              </div>
            </RoleGuard>

            <RoleGuard allowedRoles={["Admin", "Country Coordinator", "City Coordinator"]} userRole={userRole || ""}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Patient Location Overview
                  </CardTitle>
                  <CardDescription>Quick access to patient distribution map and location analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      View patients across {userRole === "City Coordinator" ? "your city" : "all regions"}
                    </div>
                    <Link href="/map">
                      <Button size="sm">View Map</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </RoleGuard>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getRoleBasedQuickActions().map((action) => (
                <Link key={action.href} href={action.href}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            <RoleGuard allowedRoles={["Supplies Manager"]} userRole={userRole || ""}>
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg text-accent">Supplies Manager Dashboard</CardTitle>
                  <CardDescription>
                    You have access to inventory management, supply tracking, and stock alerts.
                  </CardDescription>
                </CardHeader>
              </Card>
            </RoleGuard>

            <RoleGuard allowedRoles={["City Coordinator"]} userRole={userRole || ""}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">City Coordinator Dashboard</CardTitle>
                  <CardDescription>
                    Manage patients and missions within your assigned city. Access local reports and scheduling.
                  </CardDescription>
                </CardHeader>
              </Card>
            </RoleGuard>

            <RoleGuard allowedRoles={["Country Coordinator"]} userRole={userRole || ""}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Country Coordinator Dashboard</CardTitle>
                  <CardDescription>
                    Oversee nationwide operations, manage all city coordinators, and access comprehensive reports.
                  </CardDescription>
                </CardHeader>
              </Card>
            </RoleGuard>
          </div>
        </main>
      </div>
    </div>
  )
}
