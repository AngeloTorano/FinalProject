"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Users, Shield, Activity, Plus, Edit, Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export default function AdminPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "admin001",
      fullName: "Maria Santos",
      role: "Admin",
      cityAssigned: null,
      status: "Active",
      lastLogin: "2024-01-15 09:30:00",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      username: "coord_manila",
      fullName: "Juan Dela Cruz",
      role: "City Coordinator",
      cityAssigned: "Manila",
      status: "Active",
      lastLogin: "2024-01-14 16:45:00",
      createdAt: "2024-01-02",
    },
    {
      id: 3,
      username: "supplies_mgr",
      fullName: "Ana Rodriguez",
      role: "Supplies Manager",
      cityAssigned: null,
      status: "Inactive",
      lastLogin: "2024-01-10 11:20:00",
      createdAt: "2024-01-03",
    },
  ])

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: "2024-01-15 10:30:00",
      user: "Maria Santos",
      action: "CREATE",
      tableName: "Patients",
      recordId: "P001234",
      details: "Created new patient record",
      ipAddress: "192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2024-01-15 10:25:00",
      user: "Juan Dela Cruz",
      action: "UPDATE",
      tableName: "HearingAidFittings",
      recordId: "F000567",
      details: "Updated hearing aid fitting details",
      ipAddress: "192.168.1.101",
    },
    {
      id: 3,
      timestamp: "2024-01-15 10:20:00",
      user: "Ana Rodriguez",
      action: "UPDATE",
      tableName: "Supplies",
      recordId: "S000123",
      details: "Updated stock quantity for Battery Type 13",
      ipAddress: "192.168.1.102",
    },
  ])

  const [newUser, setNewUser] = useState({
    username: "",
    fullName: "",
    role: "",
    cityAssigned: "",
    password: "",
  })

  const [systemSettings, setSystemSettings] = useState({
    enableSMSNotifications: true,
    enableEmailNotifications: true,
    autoBackupEnabled: true,
    sessionTimeout: "30",
    maxLoginAttempts: "3",
    passwordMinLength: "8",
  })

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const user = {
      id: users.length + 1,
      ...newUser,
      status: "Active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, user])
    setNewUser({ username: "", fullName: "", role: "", cityAssigned: "", password: "" })
    setIsAddUserOpen(false)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleToggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user,
      ),
    )
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Plus className="h-4 w-4 text-green-500" />
      case "UPDATE":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "DELETE":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "LOGIN":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "LOGOUT":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">System administration and user management</p>
          </div>
        </div>
        <Badge variant="secondary">Administrator</Badge>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">{users.filter((u) => u.status === "Active").length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">Actions today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account for the MediEase system.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newUser.username}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Country Coordinator">Country Coordinator</SelectItem>
                        <SelectItem value="City Coordinator">City Coordinator</SelectItem>
                        <SelectItem value="Supplies Manager">Supplies Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cityAssigned">City Assigned (Optional)</Label>
                    <Input
                      id="cityAssigned"
                      value={newUser.cityAssigned}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, cityAssigned: e.target.value }))}
                      placeholder="For City Coordinators"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create User</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">{user.username}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.cityAssigned || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleToggleUserStatus(user.id)}>
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          <h3 className="text-lg font-semibold">System Audit Logs</h3>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <span>{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.tableName}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.recordId}</TableCell>
                      <TableCell className="text-sm">{log.details}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">System Settings</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch
                    id="sms-notifications"
                    checked={systemSettings.enableSMSNotifications}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({ ...prev, enableSMSNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={systemSettings.enableEmailNotifications}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({ ...prev, enableEmailNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Auto Backup</Label>
                  <Switch
                    id="auto-backup"
                    checked={systemSettings.autoBackupEnabled}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({ ...prev, autoBackupEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input
                    id="max-login-attempts"
                    type="number"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) => setSystemSettings((prev) => ({ ...prev, maxLoginAttempts: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-min-length">Password Min Length</Label>
                  <Input
                    id="password-min-length"
                    type="number"
                    value={systemSettings.passwordMinLength}
                    onChange={(e) => setSystemSettings((prev) => ({ ...prev, passwordMinLength: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </TabsContent>

        {/* System Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <h3 className="text-lg font-semibold">System Monitoring</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Database Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Last backup: 2 hours ago</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Server Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>45%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span>67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Low stock: Battery Type 13</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Backup overdue: 1 day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
