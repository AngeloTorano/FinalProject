"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, FileText, BarChart3, TrendingUp, Users, Calendar } from "lucide-react"

// Mock data for reports
const patientDemographics = [
  { ageGroup: "0-18", count: 245, percentage: 25 },
  { ageGroup: "19-35", count: 189, percentage: 19 },
  { ageGroup: "36-50", count: 298, percentage: 30 },
  { ageGroup: "51-65", count: 156, percentage: 16 },
  { ageGroup: "65+", count: 98, percentage: 10 },
]

const genderDistribution = [
  { name: "Male", value: 512, color: "#8b5cf6" },
  { name: "Female", value: 474, color: "#ec4899" },
]

const regionDistribution = [
  { region: "NCR", patients: 234, missions: 12 },
  { region: "Central Visayas", patients: 189, missions: 8 },
  { region: "Davao Region", patients: 156, missions: 6 },
  { region: "Calabarzon", patients: 145, missions: 7 },
  { region: "Central Luzon", patients: 132, missions: 5 },
]

const hearingLossCauses = [
  { cause: "Aging", count: 298, percentage: 30.2 },
  { cause: "Ear Infection", count: 234, percentage: 23.7 },
  { cause: "Birth Trauma", count: 156, percentage: 15.8 },
  { cause: "Medication", count: 123, percentage: 12.5 },
  { cause: "Meningitis", count: 89, percentage: 9.0 },
  { cause: "Other", count: 87, percentage: 8.8 },
]

const monthlyTrends = [
  { month: "Jan", patients: 65, fittings: 45, aftercare: 23 },
  { month: "Feb", patients: 78, fittings: 52, aftercare: 31 },
  { month: "Mar", patients: 89, fittings: 67, aftercare: 28 },
  { month: "Apr", patients: 95, fittings: 71, aftercare: 35 },
  { month: "May", patients: 102, fittings: 78, aftercare: 42 },
  { month: "Jun", patients: 87, fittings: 65, aftercare: 38 },
]

const treatmentOutcomes = [
  { phase: "Phase 1 Completed", count: 987, color: "#4ade80" },
  { phase: "Phase 2 Completed", count: 756, color: "#f59e0b" },
  { phase: "Phase 3 Completed", count: 623, color: "#8b5cf6" },
  { phase: "Ongoing Treatment", count: 234, color: "#6b7280" },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last-6-months")
  const [reportType, setReportType] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")

  const handleExportReport = (format: string) => {
    console.log(`Exporting report in ${format} format`)
    // Mock export functionality
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights and data visualization</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportReport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("pdf")}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="demographics">Demographics</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="ncr">NCR</SelectItem>
                  <SelectItem value="central-visayas">Central Visayas</SelectItem>
                  <SelectItem value="davao">Davao Region</SelectItem>
                  <SelectItem value="calabarzon">Calabarzon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hearing Aids Fitted</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Treatment completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="demographics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="medical">Medical Analysis</TabsTrigger>
          <TabsTrigger value="operational">Operations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Patient age groups breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={patientDemographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Male vs Female patients</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(p: any) => `${p?.name ?? ""} ${((p?.percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Regional Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Patients and missions by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#8b5cf6" name="Patients" />
                  <Bar dataKey="missions" fill="#ec4899" name="Missions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hearing Loss Causes */}
            <Card>
              <CardHeader>
                <CardTitle>Hearing Loss Causes</CardTitle>
                <CardDescription>Primary causes of hearing loss</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hearingLossCauses} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="cause" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Treatment Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Outcomes</CardTitle>
                <CardDescription>Phase completion statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={treatmentOutcomes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(p: any) => `${String(p?.payload?.phase ?? p?.name ?? "").split(" ")[1] ?? ""} ${((p?.percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {treatmentOutcomes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Medical Statistics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Statistics Summary</CardTitle>
              <CardDescription>Detailed breakdown of medical outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">87.5%</div>
                    <div className="text-sm text-muted-foreground">Patient Satisfaction</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">76.3%</div>
                    <div className="text-sm text-muted-foreground">Follow-up Compliance</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">12.8</div>
                    <div className="text-sm text-muted-foreground">Avg. Days to Fitting</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Mission Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Mission Performance</CardTitle>
                <CardDescription>Efficiency metrics by mission type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Phase 1 Missions</div>
                      <div className="text-sm text-muted-foreground">15 completed</div>
                    </div>
                    <Badge variant="secondary">98.2% efficiency</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Phase 2 Missions</div>
                      <div className="text-sm text-muted-foreground">12 completed</div>
                    </div>
                    <Badge variant="secondary">94.7% efficiency</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">AfterCare Missions</div>
                      <div className="text-sm text-muted-foreground">11 completed</div>
                    </div>
                    <Badge variant="secondary">91.3% efficiency</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Top performing team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Dr. Maria Santos</div>
                      <div className="text-sm text-muted-foreground">Audiologist</div>
                    </div>
                    <Badge variant="default">156 patients</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Juan Cruz</div>
                      <div className="text-sm text-muted-foreground">Hearing Aid Fitter</div>
                    </div>
                    <Badge variant="default">134 fittings</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Ana Garcia</div>
                      <div className="text-sm text-muted-foreground">Coordinator</div>
                    </div>
                    <Badge variant="default">89 follow-ups</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resource Utilization */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
              <CardDescription>Equipment and supply usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,234</div>
                  <div className="text-sm text-muted-foreground">Hearing Aids Distributed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2,456</div>
                  <div className="text-sm text-muted-foreground">Batteries Provided</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">567</div>
                  <div className="text-sm text-muted-foreground">Earmolds Created</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Patient flow and service delivery over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#8b5cf6" name="New Patients" />
                  <Line type="monotone" dataKey="fittings" stroke="#ec4899" name="Fittings" />
                  <Line type="monotone" dataKey="aftercare" stroke="#f59e0b" name="AfterCare" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
                <CardDescription>Year-over-year comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Patient Growth</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      +23.5%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mission Efficiency</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      +15.2%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">
                      +8.7%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cost per Patient</span>
                    <Badge variant="default" className="bg-orange-100 text-orange-800">
                      -12.3%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast</CardTitle>
                <CardDescription>Projected metrics for next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Expected Patients</span>
                    <span className="font-medium">3,200+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Planned Missions</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Target Success Rate</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Resource Needs</span>
                    <span className="font-medium">1,500 aids</span>
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
