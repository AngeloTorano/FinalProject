"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Phase3FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Phase3FormModal({ open, onOpenChange }: Phase3FormModalProps) {
  const [formData, setFormData] = useState({
    // Registration
    shf_id: "",
    country: "",
    phase3_aftercare_city: "",
    phase3_date: "",
    surname: "",
    first_name: "",
    gender: "",
    dob: "",
    age: "",
    mobile_phone_number: "",
    type_of_aftercare: "",
    service_center_or_school_name: "",
    highest_level_education: "",
    return_visit_picking_up_items: false,
    employment_status: "",
    has_problem_with_aids_earmolds: "",
    // Ear Screening/Otoscopy - Left Ear
    left_wax: false,
    left_infection: false,
    left_perforation: false,
    left_other: false,
    // Ear Screening/Otoscopy - Right Ear
    right_wax: false,
    right_infection: false,
    right_perforation: false,
    right_other: false,
    medical_recommendation: "",
    medication_given: [""],
    ears_clear_for_assessment: "",
    right_ear_clear_for_assessment: "",
    left_ear_clear_for_assessment: "",
    otoscopy_comments: "",
    // AfterCare Assessment - Evaluation - Left Ear
    left_ha_dead_or_broken: false,
    left_ha_internal_feedback: false,
    left_ha_power_change_needed: false,
    left_ha_lost_or_stolen: false,
    left_ha_no_problem: false,
    left_em_discomfort_too_tight: false,
    left_em_feedback_too_loose: false,
    left_em_damaged_or_tubing_cracked: false,
    left_em_lost_or_stolen: false,
    left_em_no_problem: false,
    // AfterCare Assessment - Evaluation - Right Ear
    right_ha_dead_or_broken: false,
    right_ha_internal_feedback: false,
    right_ha_power_change_needed: false,
    right_ha_lost_or_stolen: false,
    right_ha_no_problem: false,
    right_em_discomfort_too_tight: false,
    right_em_feedback_too_loose: false,
    right_em_damaged_or_tubing_cracked: false,
    right_em_lost_or_stolen: false,
    right_em_no_problem: false,
    // AfterCare Assessment - Services Completed - Left Ear
    left_ha_tested_wfa_demo: false,
    left_ha_sent_for_repair_replacement: false,
    left_ha_refit_new: false,
    left_ha_not_benefiting: false,
    left_em_retubed_unplugged: false,
    left_em_modified: false,
    left_em_fit_stock: false,
    left_em_took_new_impression: false,
    left_em_refit_custom: false,
    // AfterCare Assessment - Services Completed - Right Ear
    right_ha_tested_wfa_demo: false,
    right_ha_sent_for_repair_replacement: false,
    right_ha_refit_new: false,
    right_ha_not_benefiting: false,
    right_em_retubed_unplugged: false,
    right_em_modified: false,
    right_em_fit_stock: false,
    right_em_took_new_impression: false,
    right_em_refit_custom: false,
    // General Services
    counseling_provided: false,
    batteries_provided_13: 0,
    batteries_provided_675: 0,
    refer_to_aftercare_center: false,
    refer_to_next_phase2_mission: false,
    // Final Quality Control
    satisfaction_with_hearing: "",
    asks_to_repeat_or_speak_louder: "",
    patient_signature_present: false,
    parent_guardian_signature_present: false,
    shf_notes: "",
    // Current Fitting Info - Left Ear
    left_power_level: "",
    left_level: "",
    left_volume: "",
    left_model: "",
    left_battery_type: "",
    left_earmold_type: "",
    // Current Fitting Info - Right Ear
    right_power_level: "",
    right_level: "",
    right_volume: "",
    right_model: "",
    right_battery_type: "",
    right_earmold_type: "",

    show_batteries_provided: false,
  })

  // snapshot of initial values for dirty check
  const initialRef = useRef({ ...formData })
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false)
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false)
  
  // update snapshot when dialog opens so fresh initial state is used
  useEffect(() => {
    if (open) {
      initialRef.current = { ...formData }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const isFormDirty = () => {
    const current = formData
    const initial = initialRef.current

    for (const key of Object.keys(initial) as (keyof typeof initial)[]) {
      const a = (initial as any)[key]
      const b = (current as any)[key]

      if (Array.isArray(a) && Array.isArray(b)) {
        const aFiltered = a.filter(Boolean)
        const bFiltered = b.filter(Boolean)
        if (aFiltered.length !== bFiltered.length) return true
        if (aFiltered.some((v, i) => v !== bFiltered[i])) return true
      } else if (typeof a === "string") {
        if ((a || "").trim() !== (b || "").trim()) return true
      } else if (typeof a === "boolean") {
        if (a !== b) return true
      } else if (typeof a === "number") {
        if (a !== b) return true
      } else {
        if (a !== b) return true
      }
    }
    return false
  }

  const requestClose = () => {
    if (isFormDirty()) {
      setConfirmCloseOpen(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleConfirmClose = () => {
    setConfirmCloseOpen(false)
    onOpenChange(false)
    // reset to initial snapshot
    setFormData({ ...initialRef.current })
  }

  const handleDialogOpenChange = (val: boolean) => {
    if (!val) {
      // attempt to close
      if (isFormDirty()) {
        setConfirmCloseOpen(true)
      } else {
        onOpenChange(false)
      }
    } else {
      // opening -> pass through
      onOpenChange(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitConfirmOpen(true)
  }

  const handleConfirmSubmit = () => {
    console.log("Phase 3 Form Data:", formData)
    // Handle form submission here
    onOpenChange(false)
    // optional reset to initial snapshot
    setFormData({ ...initialRef.current })
    setSubmitConfirmOpen(false)
  }
  
  const aftercareTypes = ["1st Call", "2nd Call", "3rd Call", "Patient Unreachable"]
  const medications = ["Antiseptic", "Analgesic", "Antifungal", "Antibiotic"]

  return (
    <>
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[60vw] sm:h-[94vh]">
        <DialogHeader>
          <DialogTitle>Phase 3 AfterCare Assessment</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. REGISTRATION */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shf_id">SHF ID</Label>
                    <Input
                      id="shf_id"
                      value={formData.shf_id}
                      onChange={(e) => setFormData({ ...formData, shf_id: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase3_aftercare_city">Phase 3 AfterCare City</Label>
                    <Input
                      id="phase3_aftercare_city"
                      value={formData.phase3_aftercare_city}
                      onChange={(e) => setFormData({ ...formData, phase3_aftercare_city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phase3_date">Date</Label>
                    <Input
                      id="phase3_date"
                      type="date"
                      value={formData.phase3_date}
                      onChange={(e) => setFormData({ ...formData, phase3_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Type of AfterCare</Label>
                    <Select
                      value={formData.type_of_aftercare}
                      onValueChange={(value) => setFormData({ ...formData, type_of_aftercare: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {aftercareTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="surname">Last Name</Label>
                    <Input
                      id="surname"
                      value={formData.surname}
                      onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobile_phone_number">Mobile Phone Number</Label>
                    <Input
                      id="mobile_phone_number"
                      value={formData.mobile_phone_number}
                      onChange={(e) => setFormData({ ...formData, mobile_phone_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service_center_or_school_name">Service Center or School Name</Label>
                    <Input
                      id="service_center_or_school_name"
                      value={formData.service_center_or_school_name}
                      onChange={(e) => setFormData({ ...formData, service_center_or_school_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Highest Level of Education Attained</Label>
                    <Select
                      value={formData.highest_level_education}
                      onValueChange={(value) => setFormData({ ...formData, highest_level_education: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue className="font-large text-gray-700" placeholder="Select level" />

                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Post Secondary">Post Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Employment Status</Label>
                    <Select
                      value={formData.employment_status}
                      onValueChange={(value) => setFormData({ ...formData, employment_status: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employed">Employed</SelectItem>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                        <SelectItem value="Not Employed">Not Employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="return_visit_picking_up_items"
                      checked={formData.return_visit_picking_up_items}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, return_visit_picking_up_items: checked as boolean })
                      }
                    />
                    <Label className="font-medium mb-2" htmlFor="return_visit_picking_up_items">
                      <strong>Return Visit</strong>(Patient is picking up custom earmold(s) and/or repaired hearing aid)
                    </Label>
                  </div>
                  <div>
                    <Label className="font-medium mb-2">
                      Are you having a problem with your hearing aid(s) and/or earmold(s)?
                    </Label>
                    <RadioGroup
                      className="grid grid-cols-2 gap-4"
                      value={formData.has_problem_with_aids_earmolds}
                      onValueChange={(value) =>
                        setFormData({ ...formData, has_problem_with_aids_earmolds: value })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="problem_yes" />
                        <Label htmlFor="problem_yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="problem_no" />
                        <Label htmlFor="problem_no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="col-span-2 w-full">
                    <Label className="mb-4 font-medium">Current Fitting Information:</Label>
                    <table className="w-full border-collapse border border-gray-400 text-sm">
                      <thead className="bg-gray-100">
                        <tr className="border-b border-gray-400">
                          <th className="font-bold border-r border-gray-400 p-2 text-black h-auto text-left w-[10%]">RESULTS</th>
                          <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[20%]">POWER LEVEL</th>
                          <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[20%]">VOLUME</th>
                          <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[20%]">MODEL</th>
                          <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[10%]">BATTERY</th>
                          <th className="font-bold p-2 text-black h-auto w-[25%]">EARMOLD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* LEFT EAR ROW */}
                        <tr className="border-b border-gray-400">
                          <td className="font-bold border-r border-gray-400 p-2">LEFT EAR</td>
                          <td className="border-r border-gray-400 p-0">
                            {/* LEFT POWER LEVEL Input */}
                            <Input
                              id="left_power_level"
                              value={formData.left_power_level}
                              onChange={(e) => setFormData({ ...formData, left_power_level: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                          <td className="border-r border-gray-400 p-0">
                            {/* LEFT VOLUME Input */}
                            <Input
                              id="left_volume"
                              value={formData.left_volume}
                              onChange={(e) => setFormData({ ...formData, left_volume: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                          <td className="border-r border-gray-400 p-0">
                            {/* LEFT MODEL Input */}
                            <Input
                              id="left_model"
                              value={formData.left_model}
                              onChange={(e) => setFormData({ ...formData, left_model: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                          <td className="border-r border-gray-400 p-2">
                            {/* LEFT Battery Radio Group */}
                            <RadioGroup
                              value={formData.left_battery_type}
                              onValueChange={(value) => setFormData({ ...formData, left_battery_type: value })}
                              className="flex space-x-4 justify-center"
                            >
                              <div className="flex items-center space-x-1">
                                {/* NOTE: Using RadioGroupItem for standard component look */}
                                <RadioGroupItem value="13" id="left_batt_13" />
                                <Label htmlFor="left_batt_13" className="font-normal text-sm">13</Label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="675" id="left_batt_675" />
                                <Label htmlFor="left_batt_675" className="font-normal text-sm">675</Label>
                              </div>
                            </RadioGroup>
                          </td>
                          <td className="p-0">
                            {/* LEFT EARMOLD Input */}
                            <Input
                              id="left_earmold_type"
                              value={formData.left_earmold_type}
                              onChange={(e) => setFormData({ ...formData, left_earmold_type: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                        </tr>
                        {/* RIGHT EAR ROW */}
                        <tr>
                          <td className="font-bold border-r border-gray-400 p-2">RIGHT EAR</td>
                          <td className="border-r border-gray-400 p-0">
                            {/* RIGHT POWER LEVEL Input */}
                            <Input
                              id="right_power_level"
                              value={formData.right_power_level}
                              onChange={(e) => setFormData({ ...formData, right_power_level: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                          <td className="border-r border-gray-400 p-0">
                            {/* RIGHT VOLUME Input */}
                            <Input
                              id="right_volume"
                              value={formData.right_volume}
                              onChange={(e) => setFormData({ ...formData, right_volume: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                          <td className="border-r border-gray-400 p-0">
                            {/* RIGHT MODEL Input */}
                            <Input
                              id="left_model"
                              value={formData.right_model}
                              onChange={(e) => setFormData({ ...formData, right_model: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                          <td className="border-r border-gray-400 p-2">
                            {/* RIGHT Battery Radio Group */}
                            <RadioGroup
                              value={formData.right_battery_type}
                              onValueChange={(value) => setFormData({ ...formData, right_battery_type: value })}
                              className="flex space-x-4 justify-center"
                            >
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="13" id="right_batt_13" />
                                <Label htmlFor="right_batt_13" className="font-normal text-sm">13</Label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="675" id="right_batt_675" />
                                <Label htmlFor="right_batt_675" className="font-normal text-sm">675</Label>
                              </div>
                            </RadioGroup>
                          </td>
                          <td className="p-0">
                            {/* RIGHT EARMOLD Input */}
                            <Input
                              id="right_earmold_type"
                              value={formData.right_earmold_type}
                              onChange={(e) => setFormData({ ...formData, right_earmold_type: e.target.value })}
                              className="h-8 border-none focus-visible:ring-0 text-center"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>


                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* 2. EAR SCREENING/OTOSCOPY */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Ear Screening/Otoscopy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Left Ear</h4>
                    <div className="space-y-2">
                      {[
                        { key: "left_wax", label: "Wax" },
                        { key: "left_infection", label: "Infection" },
                        { key: "left_perforation", label: "Perforation" },
                        { key: "left_tinnitus", label: "Tinnitus" },
                        { key: "left_atresia", label: "Atresia" },
                        { key: "left_implant", label: "Implant" },
                        { key: "left_other", label: "Other" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={formData[key as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                          />
                          <Label htmlFor={key}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Right Ear</h4>
                    <div className="space-y-2">
                      {[
                        { key: "right_wax", label: "Wax" },
                        { key: "right_infection", label: "Infection" },
                        { key: "right_perforation", label: "Perforation" },
                        { key: "right_tinnitus", label: "Tinnitus" },
                        { key: "right_atresia", label: "Atresia" },
                        { key: "right_implant", label: "Implant" },
                        { key: "right_other", label: "Other" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={formData[key as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                          />
                          <Label htmlFor={key}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-4" htmlFor="medical_recommendation">Medical Recommendation</Label>
                  <RadioGroup
                    className="grid grid-cols-2 gap-3"
                    value={formData.medical_recommendation}
                    onValueChange={(value) => setFormData({ ...formData, medical_recommendation: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="medical_reco_left" />
                      <Label htmlFor="medical_reco_left">Left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="medical_reco_right" />
                      <Label htmlFor="medical_reco_right">Right</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Medication Given</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {medications.map((med) => (
                      <div key={med} className="flex items-center space-x-2">
                        <Checkbox
                          id={`med_${med}`}
                          checked={formData.medication_given.includes(med)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, medication_given: [...formData.medication_given, med] })
                            } else {
                              setFormData({
                                ...formData,
                                medication_given: formData.medication_given.filter((m) => m !== med),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`med_${med}`}>{med}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-4 font-medium">Ears Clear for Assessment?</Label>

                  <div className="grid grid-cols-2 gap-6">
                    {/* RIGHT EAR */}
                    <div>
                      <Label className="text-sm font-semibold">Right Ear</Label>
                      <RadioGroup
                        className="grid grid-cols-2 gap-3 mt-2"
                        value={formData.right_ear_clear_for_assessment}
                        onValueChange={(value) =>
                          setFormData({ ...formData, right_ear_clear_for_assessment: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="right_ear_clear_yes" />
                          <Label htmlFor="right_ear_clear_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="right_ear_clear_no" />
                          <Label htmlFor="right_ear_clear_no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* LEFT EAR */}
                    <div>
                      <Label className="text-sm font-semibold">Left Ear</Label>
                      <RadioGroup
                        className="grid grid-cols-2 gap-3 mt-2"
                        value={formData.left_ear_clear_for_assessment}
                        onValueChange={(value) =>
                          setFormData({ ...formData, left_ear_clear_for_assessment: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="left_ear_clear_yes" />
                          <Label htmlFor="left_ear_clear_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="left_ear_clear_no" />
                          <Label htmlFor="left_ear_clear_no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>


                <div>
                  <Label htmlFor="otoscopy_comments" className="mb-4">Comments</Label>
                  <Textarea
                    id="otoscopy_comments"
                    value={formData.otoscopy_comments}
                    onChange={(e) => setFormData({ ...formData, otoscopy_comments: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3A. AFTERCARE ASSESSMENT - EVALUATION */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3A. AfterCare Assessment - Evaluation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Left Ear</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Hearing Aid</h5>
                        <div className="space-y-2">
                          {[
                            { key: "left_ha_dead_or_broken", label: "Hearing Aid is Dead or Broken" },
                            { key: "left_ha_internal_feedback", label: "Hearing Aid has Internal Feedback" },
                            { key: "left_ha_power_change_needed", label: "Hearing Aid Power Change Needed" },
                            { key: "left_ha_lost_or_stolen", label: "Hearing Aid was Lost or Stolen" },
                            { key: "left_ha_no_problem", label: "No Problem with Hearing Aid" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Earmold</h5>
                        <div className="space-y-2">
                          {[
                            { key: "left_em_discomfort_too_tight", label: "Discomfort/Earmold too Tight" },
                            { key: "left_em_feedback_too_loose", label: "Feedback/Earmold too Loose" },
                            {
                              key: "left_em_damaged_or_tubing_cracked",
                              label: "Earmold is Damaged or Tubing is Cracked",
                            },
                            { key: "left_em_lost_or_stolen", label: "Earmold was Lost or Stolen" },
                            { key: "left_em_no_problem", label: "No Problem with Earmold" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Right Ear</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Hearing Aid</h5>
                        <div className="space-y-2">
                          {[
                            { key: "right_ha_dead_or_broken", label: "Hearing Aid is Dead or Broken" },
                            { key: "right_ha_internal_feedback", label: "Hearing Aid has Internal Feedback" },
                            { key: "right_ha_power_change_needed", label: "Hearing Aid Power Change Needed" },
                            { key: "right_ha_lost_or_stolen", label: "Hearing Aid was Lost or Stolen" },
                            { key: "right_ha_no_problem", label: "No Problem with Hearing Aid" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Earmold</h5>
                        <div className="space-y-2">
                          {[
                            { key: "right_em_discomfort_too_tight", label: "Discomfort/Earmold too Tight" },
                            { key: "right_em_feedback_too_loose", label: "Feedback/Earmold too Loose" },
                            {
                              key: "right_em_damaged_or_tubing_cracked",
                              label: "Earmold is Damaged or Tubing is Cracked",
                            },
                            { key: "right_em_lost_or_stolen", label: "Earmold was Lost or Stolen" },
                            { key: "right_em_no_problem", label: "No Problem with Earmold" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3B. AFTERCARE ASSESSMENT - SERVICES COMPLETED */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3B. AfterCare Assessment - Services Completed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Left Ear</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Hearing Aid</h5>
                        <div className="space-y-2">
                          {[
                            {
                              key: "left_ha_tested_wfa_demo",
                              label: "Tested with WFA® Fitting Method using Demo Hearing Aids",
                            },
                            {
                              key: "left_ha_sent_for_repair_replacement",
                              label: "Hearing Aid Sent to SHF for Repair or Replacement",
                            },
                            { key: "left_ha_refit_new", label: "Refit new Hearing Aid" },
                            { key: "left_ha_not_benefiting", label: "Not Benefiting from Hearing Aid" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Earmold</h5>
                        <div className="space-y-2">
                          {[
                            { key: "left_em_retubed_unplugged", label: "Retubed or Unplugged Earmold" },
                            { key: "left_em_modified", label: "Modified Earmold" },
                            { key: "left_em_fit_stock", label: "Fit Stock Earmold" },
                            { key: "left_em_took_new_impression", label: "Took new Ear Impression" },
                            { key: "left_em_refit_custom", label: "Refit Custom Earmold" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Right Ear</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Hearing Aid</h5>
                        <div className="space-y-2">
                          {[
                            {
                              key: "right_ha_tested_wfa_demo",
                              label: "Tested with WFA® Fitting Method using Demo Hearing Aids",
                            },
                            {
                              key: "right_ha_sent_for_repair_replacement",
                              label: "Hearing Aid Sent to SHF for Repair or Replacement",
                            },
                            { key: "right_ha_refit_new", label: "Refit new Hearing Aid" },
                            { key: "right_ha_not_benefiting", label: "Not Benefiting from Hearing Aid" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Earmold</h5>
                        <div className="space-y-2">
                          {[
                            { key: "right_em_retubed_unplugged", label: "Retubed or Unplugged Earmold" },
                            { key: "right_em_modified", label: "Modified Earmold" },
                            { key: "right_em_fit_stock", label: "Fit Stock Earmold" },
                            { key: "right_em_took_new_impression", label: "Took new Ear Impression" },
                            { key: "right_em_refit_custom", label: "Refit Custom Earmold" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData[key as keyof typeof formData] as boolean}
                                onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                              />
                              <Label htmlFor={key} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">General Services</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="counseling_provided"
                        checked={formData.counseling_provided}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, counseling_provided: checked as boolean })
                        }
                      />
                      <Label htmlFor="counseling_provided">Counseling</Label>
                    </div>

                    <div className="space-y-2">
                      {/* Main Checkbox */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="toggle_batteries_provided"
                          checked={formData.show_batteries_provided}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              show_batteries_provided: checked as boolean,
                              batteries_provided_13: checked ? prev.batteries_provided_13 : 0,
                              batteries_provided_675: checked ? prev.batteries_provided_675 : 0,
                            }))
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor="toggle_batteries_provided">
                          Batteries Provided:
                        </Label>
                      </div>

                      {/* Inputs for Battery 13 and 675 (show when checked) */}
                      {formData.show_batteries_provided && (
                        <div className="grid grid-cols-2 gap-4 pl-6">
                          <div>
                            <Label htmlFor="batteries_provided_13">Battery 13</Label>
                            <Input
                              id="batteries_provided_13"
                              type="number"
                              placeholder="Enter quantity"
                              value={formData.batteries_provided_13}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  batteries_provided_13: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="batteries_provided_675">Battery 675</Label>
                            <Input
                              id="batteries_provided_675"
                              type="number"
                              placeholder="Enter quantity"
                              value={formData.batteries_provided_675}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  batteries_provided_675: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="refer_to_aftercare_center"
                          checked={formData.refer_to_aftercare_center}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, refer_to_aftercare_center: checked as boolean })
                          }
                        />
                        <Label htmlFor="refer_to_aftercare_center">Refer to AfterCare Service Center</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="refer_to_next_phase2_mission"
                          checked={formData.refer_to_next_phase2_mission}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, refer_to_next_phase2_mission: checked as boolean })
                          }
                        />
                        <Label htmlFor="refer_to_next_phase2_mission">Refer to next Phase 2 Mission</Label>
                      </div>
                    </div>
                    <Separator />
                    <div className="col-span-2 w-full">
                      <Label className="mb-4 font-medium">Updated Hearing Aid and/or Earmold Information:</Label>
                      <table className="h-[30%] w-full border-collapse border border-gray-400 text-sm">
                        <thead className="bg-gray-100">
                          <tr className="border-b border-gray-400">
                            <th className="font-bold border-r border-gray-400 p-2 text-black h-auto text-left w-[10%]">RESULTS</th>
                            <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[20%]">POWER LEVEL</th>
                            <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[20%]">VOLUME</th>
                            <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[20%]">MODEL</th>
                            <th className="font-bold border-r border-gray-400 p-2 text-black h-auto w-[10%]">BATTERY</th>
                            <th className="font-bold p-2 text-black h-auto w-[25%]">EARMOLD</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* LEFT EAR ROW */}
                          <tr className="border-b border-gray-400">
                            <td className="font-bold border-r border-gray-400 p-2">LEFT EAR</td>
                            <td className="border-r border-gray-400 p-0">
                              {/* LEFT POWER LEVEL Input */}
                              <Input
                                id="left_power_level"
                                value={formData.left_power_level}
                                onChange={(e) => setFormData({ ...formData, left_power_level: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                            <td className="border-r border-gray-400 p-0">
                              {/* LEFT VOLUME Input */}
                              <Input
                                id="left_volume"
                                value={formData.left_volume}
                                onChange={(e) => setFormData({ ...formData, left_volume: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                            <td className="border-r border-gray-400 p-0">
                              {/* LEFT MODEL Input */}
                              <Input
                                id="left_model"
                                value={formData.left_model}
                                onChange={(e) => setFormData({ ...formData, left_model: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                            <td className="border-r border-gray-400 p-2">
                              {/* LEFT Battery Radio Group */}
                              <RadioGroup
                                value={formData.left_battery_type}
                                onValueChange={(value) => setFormData({ ...formData, left_battery_type: value })}
                                className="flex space-x-4 justify-center"
                              >
                                <div className="flex items-center space-x-1">
                                  {/* NOTE: Using RadioGroupItem for standard component look */}
                                  <RadioGroupItem value="13" id="left_batt_13" />
                                  <Label htmlFor="left_batt_13" className="font-normal text-sm">13</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="675" id="left_batt_675" />
                                  <Label htmlFor="left_batt_675" className="font-normal text-sm">675</Label>
                                </div>
                              </RadioGroup>
                            </td>
                            <td className="p-0">
                              {/* LEFT EARMOLD Input */}
                              <Input
                                id="left_earmold_type"
                                value={formData.left_earmold_type}
                                onChange={(e) => setFormData({ ...formData, left_earmold_type: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                          </tr>
                          {/* RIGHT EAR ROW */}
                          <tr>
                            <td className="font-bold border-r border-gray-400 p-2">RIGHT EAR</td>
                            <td className="border-r border-gray-400 p-0">
                              {/* RIGHT POWER LEVEL Input */}
                              <Input
                                id="right_power_level"
                                value={formData.right_power_level}
                                onChange={(e) => setFormData({ ...formData, right_power_level: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                            <td className="border-r border-gray-400 p-0">
                              {/* RIGHT VOLUME Input */}
                              <Input
                                id="right_volume"
                                value={formData.right_volume}
                                onChange={(e) => setFormData({ ...formData, right_volume: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                            <td className="border-r border-gray-400 p-0">
                              {/* RIGHT MODEL Input */}
                              <Input
                                id="left_model"
                                value={formData.right_model}
                                onChange={(e) => setFormData({ ...formData, right_model: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                            <td className="border-r border-gray-400 p-2">
                              {/* RIGHT Battery Radio Group */}
                              <RadioGroup
                                value={formData.right_battery_type}
                                onValueChange={(value) => setFormData({ ...formData, right_battery_type: value })}
                                className="flex space-x-4 justify-center"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="13" id="right_batt_13" />
                                  <Label htmlFor="right_batt_13" className="font-normal text-sm">13</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="675" id="right_batt_675" />
                                  <Label htmlFor="right_batt_675" className="font-normal text-sm">675</Label>
                                </div>
                              </RadioGroup>
                            </td>
                            <td className="p-0">
                              {/* RIGHT EARMOLD Input */}
                              <Input
                                id="right_earmold_type"
                                value={formData.right_earmold_type}
                                onChange={(e) => setFormData({ ...formData, right_earmold_type: e.target.value })}
                                className="h-8 border-none focus-visible:ring-0 text-center"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h5>If you are sending in a hearing aid for repair or replacement ensure that you retest the patient
using the WFA® Fitting Method with your demo kit. Add the new fitting information above.</h5>
                    </div>

                    <div >
                      <Label htmlFor="otoscopy_comments" className="mb-4">Comments</Label>
                      <Textarea
                        id="otoscopy_comments"
                        value={formData.otoscopy_comments}
                        onChange={(e) => setFormData({ ...formData, otoscopy_comments: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. FINAL QUALITY CONTROL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Final Quality Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>When wearing your hearing aid(s) how satisfied are you with your hearing? (18+)</Label>
                  <RadioGroup
                    className="grid grid-cols-3 gap-3 mt-4"
                    value={formData.satisfaction_with_hearing}
                    onValueChange={(value) => setFormData({ ...formData, satisfaction_with_hearing: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Unsatisfied" id="final_unsatisfied" />
                      <Label htmlFor="final_unsatisfied">Unsatisfied</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Undecided" id="final_undecided" />
                      <Label htmlFor="final_undecided">Undecided</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Satisfied" id="final_satisfied" />
                      <Label htmlFor="final_satisfied">Satisfied</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>
                    When wearing your hearing aid(s) do you ask people to repeat themselves or speak louder in
                    conversation? (18+)
                  </Label>
                  <RadioGroup
                    className="grid grid-cols-3 gap-3 mt-4"
                    value={formData.asks_to_repeat_or_speak_louder}
                    onValueChange={(value) => setFormData({ ...formData, asks_to_repeat_or_speak_louder: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="repeat_no" />
                      <Label htmlFor="repeat_no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sometimes" id="repeat_sometimes" />
                      <Label htmlFor="repeat_sometimes">Sometimes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="repeat_yes" />
                      <Label htmlFor="repeat_yes">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="patient_signature_present"
                      checked={formData.patient_signature_present}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, patient_signature_present: checked as boolean })
                      }
                    />
                    <Label htmlFor="patient_signature_present">Patient Signature Present</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parent_guardian_signature_present"
                      checked={formData.parent_guardian_signature_present}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, parent_guardian_signature_present: checked as boolean })
                      }
                    />
                    <Label htmlFor="parent_guardian_signature_present">Parent/Guardian Signature Present</Label>
                  </div>
                </div>

                <div>
                  <Label className="mb-4" htmlFor="shf_notes">Notes from SHF</Label>
                  <Textarea

                    id="shf_notes"
                    value={formData.shf_notes}
                    onChange={(e) => setFormData({ ...formData, shf_notes: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>


          </form>
        </ScrollArea>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={requestClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>Submit Phase 3 Form</Button>
        </div>
       </DialogContent>
     </Dialog>
     {/* confirmation to avoid accidental close when dirty */}
     <Dialog open={confirmCloseOpen} onOpenChange={(v) => setConfirmCloseOpen(v)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Discard changes?</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">You have unsaved changes. Are you sure you want to close and discard them?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmCloseOpen(false)}>Keep editing</Button>
            <Button onClick={handleConfirmClose}>Discard & Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    {/* Submit confirmation: recheck patient data before proceeding */}
    <Dialog open={submitConfirmOpen} onOpenChange={(v) => setSubmitConfirmOpen(v)}>
      <DialogContent className="max-w-md">
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-2">Please recheck patient data</h3>
          <p className="mb-4">Before submitting, please confirm you have reviewed all patient data. Proceed?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSubmitConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmSubmit}>Confirm & Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
   </>
  )
}
