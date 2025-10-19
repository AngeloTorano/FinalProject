"use client"

import axios from "axios"
import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Phase1FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PatientSearchResponse {
  patient_id: string
}

const initialFormState = {
  phase1_date: "",
  phase1_city: "",
  patient_id: "", // This is the SHF ID input
  user_id: "", // This will store the actual patient_id from database

  hearing_loss: "",
  sign_language_use: "",
  speech_use: "",
  hearing_loss_cause: [""],
  ringing_sensation: "",
  ear_pain: "",
  hearing_satisfaction: "",
  repeat_request: "",

  ears_clear_for_impressions: "",
  left_wax: "",
  left_infection: false,
  left_perforation: false,
  left_tinnitus: false,
  left_atresia: false,
  left_implant: false,
  left_other: false,
  right_wax: false,
  right_infection: false,
  right_perforation: false,
  right_tinnitus: false,
  right_atresia: false,
  right_implant: false,
  right_other: false,
  medical_recommendation: "",
  medication_given: [""],
  otoscopy_comments: "",
  screening_method: "",
  left_ear_result: "",
  right_ear_result: "",
  satisfaction_with_hearing: "",
  left_ear_impression: false,
  right_ear_impression: false,
  impression_comments: "",
  completed_counseling: false,
  received_aftercare_info: false,
  trained_as_student_ambassador: false,
  ear_impressions_inspected: false,
  shf_id_card_given: false,
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000",
  withCredentials: true,
})

export function Phase1FormModal({ open, onOpenChange }: Phase1FormModalProps) {
  const [formData, setFormData] = useState({ ...initialFormState })
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchedPatient, setSearchedPatient] = useState<PatientSearchResponse | null>(null)
  const initialRef = useRef({ ...initialFormState })
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false)
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({})
  const [sectionSuccess, setSectionSuccess] = useState<Record<string, boolean>>({})

  const hearingLossCauses = [
    "Medication",
    "Ear Infection",
    "Meningitis",
    "Aging",
    "Malaria",
    "Birth Trauma",
    "Tuberculosis",
    "HIV",
    "Other",
    "Unknown",
  ]

  const medications = ["Antiseptic", "Analgesic", "Antifungal", "Antibiotic"]

  // Search for patient by SHF ID
  const searchPatient = async () => {
    if (!formData.patient_id.trim()) {
      setSearchError("Please enter an SHF ID")
      return
    }

    setSearchLoading(true)
    setSearchError(null)
    setSearchedPatient(null)

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // Use the correct endpoint from your backend
      const response = await api.get<PatientSearchResponse>(
        `/api/patients/shf?shf=${encodeURIComponent(formData.patient_id.trim())}`,
        { headers }
      )
      
      if (response.data && response.data.patient_id) {
        setSearchedPatient(response.data)
        setFormData(prev => ({ ...prev, user_id: response.data.patient_id }))
        setSearchError(null)
      } else {
        setSearchError("Patient not found with this SHF ID")
      }
    } catch (error: any) {
      console.error("Patient search error:", error)
      if (error.response?.status === 404) {
        setSearchError(`Patient not found: ${error.response?.data?.error || "SHF ID not found"}`)
      } else if (error.response?.status === 400) {
        setSearchError(`Invalid SHF ID: ${error.response?.data?.error || "Please check the format"}`)
      } else {
        setSearchError(error.response?.data?.error || "Failed to search for patient")
      }
    } finally {
      setSearchLoading(false)
    }
  }

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
      setFormData({ ...initialRef.current })
      setSearchedPatient(null)
    }
  }

  const handleConfirmClose = () => {
    setConfirmCloseOpen(false)
    onOpenChange(false)
    setFormData({ ...initialRef.current })
    setSearchedPatient(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchedPatient) {
      setErrorMessage("Please search and select a patient first")
      return
    }
    
    setSubmitConfirmOpen(true)
  }

  const buildPayload = (obj: Record<string, any>) => {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined) continue

      if (typeof v === "string") {
        if (v.trim() === "") continue
        out[k] = v
        continue
      }

      if (Array.isArray(v)) {
        const filtered = v.filter(Boolean)
        if (filtered.length === 0) continue
        out[k] = filtered
        continue
      }

      if (typeof v === "boolean" || typeof v === "number") {
        out[k] = v
        continue
      }

      if (typeof v === "object") {
        if (Object.keys(v).length === 0) continue
        out[k] = v
        continue
      }

      out[k] = v
    }
    return out
  }

  // Individual section submission functions - now using user_id (patient_id from database)
  const submitRegistration = async () => {
    if (!searchedPatient) {
      setSectionErrors(prev => ({...prev, registration: "Please search and select a patient first"}))
      return false
    }

    if (!formData.phase1_date.trim() || !formData.phase1_city.trim()) {
      setSectionErrors(prev => ({...prev, registration: "Please fill in Phase 1 Date and Phase 1 City"}))
      return false
    }

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const registrationPayload = buildPayload({
        user_id: formData.user_id, // Use the actual patient_id from database
        registration_date: formData.phase1_date,
        city: formData.phase1_city,
        has_hearing_loss: formData.hearing_loss === "Yes",
        uses_sign_language: formData.sign_language_use === "Yes",
        uses_speech: formData.speech_use === "Yes",
        hearing_loss_causes: formData.hearing_loss_cause,
        ringing_sensation: formData.ringing_sensation === "Yes",
        ear_pain: formData.ear_pain === "Yes",
        hearing_satisfaction_18_plus: formData.hearing_satisfaction,
        conversation_difficulty: formData.repeat_request,
      })

      console.log("Registration Payload:", registrationPayload)

      await api.post("/api/phase1/registration", registrationPayload, { headers })
      
      setSectionSuccess(prev => ({...prev, registration: true}))
      setSectionErrors(prev => ({...prev, registration: ""}))
      return true
    } catch (error: any) {
      console.error("Failed to submit Registration:", error)
      setSectionErrors(prev => ({...prev, registration: error.response?.data?.error || "Failed to submit Registration"}))
      return false
    }
  }

  const submitEarScreening = async () => {
    if (!searchedPatient) {
      setSectionErrors(prev => ({...prev, earScreening: "Please search and select a patient first"}))
      return false
    }

    if (formData.ears_clear_for_impressions === "Yes") {
      setSectionSuccess(prev => ({...prev, earScreening: true}))
      return true
    }

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const earScreeningPayload = buildPayload({
        user_id: formData.user_id, // Use the actual patient_id from database
        ears_clear_for_impressions: formData.ears_clear_for_impressions,
        left_wax: formData.left_wax,
        right_wax: formData.right_wax,
        left_infection: formData.left_infection,
        right_infection: formData.right_infection,
        left_perforation: formData.left_perforation,
        right_perforation: formData.right_perforation,
        left_tinnitus: formData.left_tinnitus,
        right_tinnitus: formData.right_tinnitus,
        left_atresia: formData.left_atresia,
        right_atresia: formData.right_atresia,
        left_implant: formData.left_implant,
        right_implant: formData.right_implant,
        left_other: formData.left_other,
        right_other: formData.right_other,
        medical_recommendation: formData.medical_recommendation,
        medication_given: formData.medication_given,
        comments: formData.otoscopy_comments,
      })

      if (Object.keys(earScreeningPayload).length > 0) {
        await api.post("/api/phase1/ear-screening", earScreeningPayload, { headers })
      }
      
      setSectionSuccess(prev => ({...prev, earScreening: true}))
      setSectionErrors(prev => ({...prev, earScreening: ""}))
      return true
    } catch (error: any) {
      console.error("Failed to submit Ear Screening:", error)
      setSectionErrors(prev => ({...prev, earScreening: error.response?.data?.error || "Failed to submit Ear Screening"}))
      return false
    }
  }

  const submitHearingScreening = async () => {
    if (!searchedPatient) {
      setSectionErrors(prev => ({...prev, hearingScreening: "Please search and select a patient first"}))
      return false
    }

    if (!formData.screening_method) {
      setSectionErrors(prev => ({...prev, hearingScreening: "Please select a screening method"}))
      return false
    }

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      await api.post(
        "/api/phase1/hearing-screening",
        {
          user_id: formData.user_id, // Use the actual patient_id from database
          screening_method: formData.screening_method,
          left_ear_result: formData.left_ear_result,
          right_ear_result: formData.right_ear_result,
          satisfaction_with_hearing: formData.satisfaction_with_hearing,
        },
        { headers }
      )
      
      setSectionSuccess(prev => ({...prev, hearingScreening: true}))
      setSectionErrors(prev => ({...prev, hearingScreening: ""}))
      return true
    } catch (error: any) {
      console.error("Failed to submit Hearing Screening:", error)
      setSectionErrors(prev => ({...prev, hearingScreening: error.response?.data?.error || "Failed to submit Hearing Screening"}))
      return false
    }
  }

  const submitEarImpressions = async () => {
    if (!searchedPatient) {
      setSectionErrors(prev => ({...prev, earImpressions: "Please search and select a patient first"}))
      return false
    }

    if (!formData.left_ear_impression && !formData.right_ear_impression) {
      setSectionSuccess(prev => ({...prev, earImpressions: true}))
      return true
    }

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      if (formData.left_ear_impression) {
        await api.post(
          "/api/phase1/ear-impressions",
          {
            user_id: formData.user_id, // Use the actual patient_id from database
            ear_impression: "Left",
            comment: formData.impression_comments,
          },
          { headers }
        )
      }
      if (formData.right_ear_impression) {
        await api.post(
          "/api/phase1/ear-impressions",
          {
            user_id: formData.user_id, // Use the actual patient_id from database
            ear_impression: "Right",
            comment: formData.impression_comments,
          },
          { headers }
        )
      }
      
      setSectionSuccess(prev => ({...prev, earImpressions: true}))
      setSectionErrors(prev => ({...prev, earImpressions: ""}))
      return true
    } catch (error: any) {
      console.error("Failed to submit Ear Impressions:", error)
      setSectionErrors(prev => ({...prev, earImpressions: error.response?.data?.error || "Failed to submit Ear Impressions"}))
      return false
    }
  }

  const submitFinalQC = async () => {
    if (!searchedPatient) {
      setSectionErrors(prev => ({...prev, finalQC: "Please search and select a patient first"}))
      return false
    }

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      await api.post(
        "/api/phase1/final-qc",
        {
          user_id: formData.user_id, // Use the actual patient_id from database
          ear_impressions_inspected: formData.ear_impressions_inspected,
          shf_id_card_given: formData.shf_id_card_given,
        },
        { headers }
      )
      
      setSectionSuccess(prev => ({...prev, finalQC: true}))
      setSectionErrors(prev => ({...prev, finalQC: ""}))
      return true
    } catch (error: any) {
      console.error("Failed to submit Final QC:", error)
      setSectionErrors(prev => ({...prev, finalQC: error.response?.data?.error || "Failed to submit Final QC"}))
      return false
    }
  }

  const handleConfirmSubmit = async () => {
    if (!searchedPatient) {
      setErrorMessage("Please search and select a patient first")
      return
    }

    setSectionErrors({})
    setSectionSuccess({})

    // Submit all sections in order
    const results = await Promise.all([
      submitRegistration(),
      submitEarScreening(),
      submitHearingScreening(),
      submitEarImpressions(),
      submitFinalQC()
    ])

    const allSuccessful = results.every(result => result === true)

    if (allSuccessful) {
      onOpenChange(false)
      setFormData({ ...initialRef.current })
      setSearchedPatient(null)
      setSubmitConfirmOpen(false)
      setErrorMessage(null)
      alert("Phase 1 form submitted successfully!")
    } else {
      setErrorMessage("Some sections failed to submit. Please check the individual section errors above.")
    }
  }

  const handleDialogOpenChange = (val: boolean) => {
    if (!val) {
      requestClose()
    } else {
      onOpenChange(true)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[60vw] sm:h-[94vh]">
          <DialogHeader>
            <DialogTitle>Phase 1 Form</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[80vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Search Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div className="col-span-2">
                      <Label htmlFor="patient_id">SHF - ID</Label>
                      <Input
                        id="patient_id"
                        value={formData.patient_id}
                        placeholder="Enter SHF ID (e.g., SHF123, PH-SHF456, SHF-uxYW0ytZWs)"
                        onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            searchPatient()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Button 
                        type="button" 
                        onClick={searchPatient}
                        disabled={searchLoading}
                        className="w-full"
                      >
                        {searchLoading ? "Searching..." : "Search Patient"}
                      </Button>
                    </div>
                  </div>

                  {searchError && (
                    <div className="text-red-600 text-sm">{searchError}</div>
                  )}

                  {searchedPatient && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800 font-semibold">
                        ✓ Patient Found
                      </p>
                      <p className="text-green-700">
                        SHF ID: {formData.patient_id}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 1. REGISTRATION - Phase 1 Specific */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1.1 Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phase1_date">Phase 1 Date</Label>
                      <Input
                        id="phase1_date"
                        type="date"
                        value={formData.phase1_date}
                        onChange={(e) => setFormData({ ...formData, phase1_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phase1_city">Phase 1 City</Label>
                      <Input
                        id="phase1_city"
                        placeholder="Phase 1 City"
                        value={formData.phase1_city}
                        onChange={(e) => setFormData({ ...formData, phase1_city: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* General Questions */}
                  <Separator className="my-4" />
                  <h4 className="font-semibold text-2xl">General Questions</h4>

                  <div className="grid grid-cols gap-4">
                    <div>
                      <Label className="font-medium mb-4"><strong>1. Do you have a hearing loss?</strong></Label>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={formData.hearing_loss}
                        onValueChange={(value) => setFormData({ ...formData, hearing_loss: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="hearing_loss_yes" />
                          <Label htmlFor="hearing_loss_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="hearing_loss_no" />
                          <Label htmlFor="hearing_loss_no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Undecided" id="hearing_loss_undecided" />
                          <Label htmlFor="hearing_loss_undecided">Undecided</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="font-medium mb-4" ><strong>2. Do you use sign language?</strong></Label>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={formData.sign_language_use}
                        onValueChange={(value) => setFormData({ ...formData, sign_language_use: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="sign_yes" />
                          <Label htmlFor="sign_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="sign_no" />
                          <Label htmlFor="sign_no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="A little" id="sign_little" />
                          <Label htmlFor="sign_little">A little</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="font-medium mb-4"><strong>3. Do you use speech?</strong></Label>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={formData.speech_use}
                        onValueChange={(value) => setFormData({ ...formData, speech_use: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="speech_yes" />
                          <Label htmlFor="speech_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="speech_no" />
                          <Label htmlFor="speech_no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="A little" id="speech_little" />
                          <Label htmlFor="speech_little">A little</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="mt-4 mb-4">
                    <Label className="mb-4 block"><strong>4. Hearing Loss Cause:</strong></Label>
                    <div className="grid grid-cols-2 gap-4">
                      {hearingLossCauses.map((cause) => (
                        <div key={cause} className="flex items-center space-x-2">
                          <Checkbox
                            id={cause}
                            checked={formData.hearing_loss_cause?.includes(cause)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  hearing_loss_cause: [...(formData.hearing_loss_cause || []), cause],
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  hearing_loss_cause: formData.hearing_loss_cause.filter((c) => c !== cause),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={cause}>{cause}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols gap-4">
                    <div>
                      <Label className="mb-4"><strong>5. Do you experience a ringing
                        sensation in your ear?</strong></Label>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={formData.ringing_sensation}
                        onValueChange={(value) => setFormData({ ...formData, ringing_sensation: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="ringing_yes" />
                          <Label htmlFor="ringing_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="ringing_no" />
                          <Label htmlFor="ringing_no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="A little" id="ringing_little" />
                          <Label htmlFor="ringing_little">A little</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-4"><strong>6. Do you have pain in your ear?</strong></Label>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={formData.ear_pain}
                        onValueChange={(value) => setFormData({ ...formData, ear_pain: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="pain_yes" />
                          <Label htmlFor="pain_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="pain_no" />
                          <Label htmlFor="pain_no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="A little" id="pain_little" />
                          <Label htmlFor="pain_little">A little</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <Label className="font-medium mb-4"><strong>(FOR PATIENTS 18 & OLDER)</strong></Label>
                      {/* Question 7 */}
                      <div>
                        <Label className="font-medium mb-4 block">
                          <strong>7. How satisfied are you with your hearing?</strong>
                        </Label>
                        <RadioGroup
                          className="grid grid-cols-3 gap-4 mb-4"
                          value={formData.hearing_satisfaction}
                          onValueChange={(value) => setFormData({ ...formData, hearing_satisfaction: value })}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Unsatisfied" id="hearing_unsatisfied" />
                            <Label htmlFor="hearing_unsatisfied">Unsatisfied</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Undecided" id="hearing_undecided" />
                            <Label htmlFor="hearing_undecided">Undecided</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Satisfied" id="hearing_satisfied" />
                            <Label htmlFor="hearing_satisfied">Satisfied</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Question 8 */}
                      <div>
                        <Label className="font-medium mb-4 block">
                          <strong>8. Do you ask people to repeat themselves or speak louder in conversation?</strong>
                        </Label>
                        <RadioGroup
                          className="grid grid-cols-3 gap-4"
                          value={formData.repeat_request}
                          onValueChange={(value) => setFormData({ ...formData, repeat_request: value })}
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

                    </div>
                  </div>

                  {/* Registration Submit Button */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      {sectionErrors.registration && (
                        <p className="text-red-600 text-sm">{sectionErrors.registration}</p>
                      )}
                      {sectionSuccess.registration && (
                        <p className="text-green-600 text-sm">✓ Registration submitted successfully</p>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      onClick={submitRegistration}
                      disabled={!searchedPatient}
                    >
                      Submit Registration
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* 2A. EAR SCREENING */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2A. Ear Screening</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="mb-4">Ears Clear for Impressions <strong>(IF YES, SKIP TO SECTION 3)</strong>:</Label>
                    <RadioGroup
                      className="grid grid-cols-2 gap-3"
                      value={formData.ears_clear_for_impressions}
                      onValueChange={(value) => setFormData({ ...formData, ears_clear_for_impressions: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="clear_yes" />
                        <Label htmlFor="clear_yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="clear_no" />
                        <Label htmlFor="clear_no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Ear Screening Submit Button */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      {sectionErrors.earScreening && (
                        <p className="text-red-600 text-sm">{sectionErrors.earScreening}</p>
                      )}
                      {sectionSuccess.earScreening && (
                        <p className="text-green-600 text-sm">✓ Ear Screening submitted successfully</p>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      onClick={submitEarScreening}
                      disabled={!searchedPatient}
                    >
                      Submit Ear Screening
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 2B. OTOSCOPY - HIDDEN WHEN EARS CLEAR FOR IMPRESSIONS = Yes */}
              {formData.ears_clear_for_impressions !== "Yes" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">2B. Otoscopy</CardTitle>
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
                      <Label className="mb-4" htmlFor="otoscopy_comments">Comments</Label>
                      <Textarea
                        id="otoscopy_comments"
                        value={formData.otoscopy_comments}
                        onChange={(e) => setFormData({ ...formData, otoscopy_comments: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 3. HEARING SCREENING */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Hearing Screening</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-4">Screening Method</Label>
                    <RadioGroup
                      className="grid grid-cols-2 gap-4"
                      value={formData.screening_method}
                      onValueChange={(value) =>
                        setFormData({ ...formData, screening_method: value })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Audiogram" id="audiogram" />
                        <Label htmlFor="audiogram">Audiogram</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Voice Test" id="voice_test" />
                        <Label htmlFor="voice_test">WFA® Voice Test</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-4">Left Ear Result</Label>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={formData.left_ear_result}
                        onValueChange={(value) => setFormData({ ...formData, left_ear_result: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Pass" id="left_pass" />
                          <Label htmlFor="left_pass">Pass</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Fail" id="left_fail" />
                          <Label htmlFor="left_fail">Fail</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-4">Right Ear Result</Label>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={formData.right_ear_result}
                        onValueChange={(value) => setFormData({ ...formData, right_ear_result: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Pass" id="right_pass" />
                          <Label htmlFor="right_pass">Pass</Label>
                        </div>
                        <div className="flex items-center space-x-2 ">
                          <RadioGroupItem value="Fail" id="right_fail" />
                          <Label htmlFor="right_fail">Fail</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <Label className="mb-4">Satisfaction with Hearing (18+ if passes)</Label>
                    <RadioGroup
                      className="grid grid-cols-3 gap-4"
                      value={formData.satisfaction_with_hearing}
                      onValueChange={(value) => setFormData({ ...formData, satisfaction_with_hearing: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Unsatisfied" id="sat_unsatisfied" />
                        <Label htmlFor="sat_unsatisfied">Unsatisfied</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Undecided" id="sat_undecided" />
                        <Label htmlFor="sat_undecided">Undecided</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Satisfied" id="sat_satisfied" />
                        <Label htmlFor="sat_satisfied">Satisfied</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Hearing Screening Submit Button */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      {sectionErrors.hearingScreening && (
                        <p className="text-red-600 text-sm">{sectionErrors.hearingScreening}</p>
                      )}
                      {sectionSuccess.hearingScreening && (
                        <p className="text-green-600 text-sm">✓ Hearing Screening submitted successfully</p>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      onClick={submitHearingScreening}
                      disabled={!searchedPatient}
                    >
                      Submit Hearing Screening
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 4. EAR IMPRESSIONS */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. Ear Impressions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="left_ear_impression"
                        checked={formData.left_ear_impression}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, left_ear_impression: checked as boolean })
                        }
                      />
                      <Label htmlFor="left_ear_impression">Left Ear Impression</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="right_ear_impression"
                        checked={formData.right_ear_impression}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, right_ear_impression: checked as boolean })
                        }
                      />
                      <Label htmlFor="right_ear_impression">Right Ear Impression</Label>
                    </div>
                  </div>
                  <div>
                    <Label
                      className="mb-4" htmlFor="impression_comments">Comments</Label>
                    <Textarea
                      id="impression_comments"
                      value={formData.impression_comments}
                      onChange={(e) => setFormData({ ...formData, impression_comments: e.target.value })}
                    />
                  </div>

                  {/* Ear Impressions Submit Button */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      {sectionErrors.earImpressions && (
                        <p className="text-red-600 text-sm">{sectionErrors.earImpressions}</p>
                      )}
                      {sectionSuccess.earImpressions && (
                        <p className="text-green-600 text-sm">✓ Ear Impressions submitted successfully</p>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      onClick={submitEarImpressions}
                      disabled={!searchedPatient}
                    >
                      Submit Ear Impressions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 5. FINAL QUALITY CONTROL */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5. Final Quality Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ear_impressions_inspected"
                        checked={formData.ear_impressions_inspected}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, ear_impressions_inspected: checked as boolean })
                        }
                      />
                      <Label htmlFor="ear_impressions_inspected">Ear impressions inspected & collected</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shf_id_card_given"
                        checked={formData.shf_id_card_given}
                        onCheckedChange={(checked) => setFormData({ ...formData, shf_id_card_given: checked as boolean })}
                      />
                      <Label htmlFor="shf_id_card_given">SHF ID number and ID card given</Label>
                    </div>
                  </div>

                  {/* Final QC Submit Button */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      {sectionErrors.finalQC && (
                        <p className="text-red-600 text-sm">{sectionErrors.finalQC}</p>
                      )}
                      {sectionSuccess.finalQC && (
                        <p className="text-green-600 text-sm">✓ Final QC submitted successfully</p>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      onClick={submitFinalQC}
                      disabled={!searchedPatient}
                    >
                      Submit Final QC
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </form>
          </ScrollArea>

          <div className="flex justify-end space-x-1 pt-1">
            <Button type="button" variant="outline" onClick={requestClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={!searchedPatient}
            >
              Submit All Sections
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog to avoid accidental close */}
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
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-2">Please recheck patient data</h3>
            {searchedPatient && (
              <div className="mb-3 p-2 bg-blue-50 rounded">
                <p><strong>SHF ID:</strong> {formData.patient_id}</p>
                <p><strong>Database Patient ID:</strong> {searchedPatient.patient_id}</p>
              </div>
            )}
            <p className="mb-4">Before submitting, please confirm you have reviewed all patient data. Proceed?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSubmitConfirmOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmSubmit}>Confirm & Submit All</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-red-600">{errorMessage}</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setErrorMessage(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}