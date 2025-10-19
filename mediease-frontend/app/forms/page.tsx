"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Stethoscope, Heart } from "lucide-react"
import { Phase1FormModal } from "./forms-modals/phase1-form-modal"
import { Phase2FormModal } from "./forms-modals/phase2-form-modal"
import { Phase3FormModal } from "./forms-modals/phase3-form-modal"

export default function FormsPage() {
  const [phase1ModalOpen, setPhase1ModalOpen] = useState(false)
  const [phase2ModalOpen, setPhase2ModalOpen] = useState(false)
  const [phase3ModalOpen, setPhase3ModalOpen] = useState(false)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Phase Forms</h1>
        <p className="text-muted-foreground">Complete patient evaluations through our structured assessment phases</p>
      </div>

      {/* Form Categories */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Phase 1 Forms */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Phase 1 Forms</CardTitle>
              </div>
              <Badge variant="secondary">Registration</Badge>
            </div>
            <CardDescription>Initial patient registration and hearing screening</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setPhase1ModalOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Phase 1 Patient Form
              </Button>
              <div className="text-sm text-muted-foreground">
                <p>• Patient demographics</p>
                <p>• Medical history</p>
                <p>• Hearing screening</p>
                <p>• Initial assessment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 2 Forms */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Phase 2 Forms</CardTitle>
              </div>
              <Badge variant="secondary">Treatment</Badge>
            </div>
            <CardDescription>Detailed examination and hearing aid fitting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setPhase2ModalOpen(true)}
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Phase 2 Patient Form
              </Button>
              <div className="text-sm text-muted-foreground">
                <p>• Ear examination</p>
                <p>• Otoscopy findings</p>
                <p>• Hearing aid fitting</p>
                <p>• Quality control</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 3 Forms */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Phase 3 Forms</CardTitle>
              </div>
              <Badge variant="secondary">AfterCare</Badge>
            </div>
            <CardDescription>Follow-up care and hearing aid maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setPhase3ModalOpen(true)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Phase 3 AfterCare Form
              </Button>
              <div className="text-sm text-muted-foreground">
                <p>• Follow-up assessment</p>
                <p>• Device troubleshooting</p>
                <p>• Maintenance services</p>
                <p>• Patient satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Form Submissions</CardTitle>
          <CardDescription>Latest patient assessments and form completions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">Phase 1</Badge>
                <div>
                  <p className="font-medium">Santos, Maria</p>
                  <p className="text-sm text-muted-foreground">SHF-2024-001 • Completed 2 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">Phase 2</Badge>
                <div>
                  <p className="font-medium">Cruz, Juan</p>
                  <p className="text-sm text-muted-foreground">SHF-2024-002 • Completed 4 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">Phase 3</Badge>
                <div>
                  <p className="font-medium">Garcia, Ana</p>
                  <p className="text-sm text-muted-foreground">Pending SHF ID • Completed 6 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <Phase1FormModal open={phase1ModalOpen} onOpenChange={setPhase1ModalOpen} />
      <Phase2FormModal open={phase2ModalOpen} onOpenChange={setPhase2ModalOpen} />
      <Phase3FormModal open={phase3ModalOpen} onOpenChange={setPhase3ModalOpen} />
    </div>
  )
}
