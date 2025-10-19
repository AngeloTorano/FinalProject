"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Activity } from "lucide-react"

const TOMTOM_SDK_URL = "https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"

// Mock patient data with coordinates
const mockPatients = [
  { id: 1, name: "Maria Santos", city: "Manila", region: "NCR", lat: 14.5995, lng: 120.9842, phase: "Phase 2" },
  { id: 2, name: "Juan Dela Cruz", city: "Quezon City", region: "NCR", lat: 14.676, lng: 121.0437, phase: "Phase 3" },
  {
    id: 3,
    name: "Ana Rodriguez",
    city: "Cebu City",
    region: "Central Visayas",
    lat: 10.3157,
    lng: 123.8854,
    phase: "Phase 1",
  },
  { id: 4, name: "Pedro Gonzales", city: "Davao City", region: "Davao", lat: 7.1907, lng: 125.4553, phase: "Phase 2" },
  { id: 5, name: "Rosa Martinez", city: "Manila", region: "NCR", lat: 14.6042, lng: 120.9822, phase: "Phase 3" },
  {
    id: 6,
    name: "Carlos Lopez",
    city: "Iloilo City",
    region: "Western Visayas",
    lat: 10.7202,
    lng: 122.5621,
    phase: "Phase 1",
  },
  { id: 7, name: "Elena Reyes", city: "Baguio City", region: "CAR", lat: 16.4023, lng: 120.596, phase: "Phase 2" },
  {
    id: 8,
    name: "Miguel Torres",
    city: "Cebu City",
    region: "Central Visayas",
    lat: 10.3181,
    lng: 123.8906,
    phase: "Phase 1",
  },
]

export default function PatientMapPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)
  const [mapError, setMapError] = useState<string>("")
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const mapInitializedRef = useRef(false)

  const regions = [...new Set(mockPatients.map((p) => p.region))]
  const cities =
    selectedRegion === "all"
      ? [...new Set(mockPatients.map((p) => p.city))]
      : [...new Set(mockPatients.filter((p) => p.region === selectedRegion).map((p) => p.city))]

  useEffect(() => {
    let filtered = mockPatients

    if (selectedRegion !== "all") {
      filtered = filtered.filter((p) => p.region === selectedRegion)
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((p) => p.city === selectedCity)
    }

    setFilteredPatients(filtered)
  }, [selectedRegion, selectedCity])

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Phase 1":
        return "#3b82f6"
      case "Phase 2":
        return "#f97316"
      case "Phase 3":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getPhaseStats = () => {
    const stats = filteredPatients.reduce(
      (acc, patient) => {
        acc[patient.phase] = (acc[patient.phase] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return stats
  }

  const phaseStats = getPhaseStats()

  // Initialize map - only once
  useEffect(() => {
    // Prevent double initialization
    if (mapInitializedRef.current) return
    mapInitializedRef.current = true

    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY
    
    if (!apiKey) {
      setMapError("TomTom API key is missing. Please check your environment variables.")
      setIsMapLoading(false)
      return
    }

    if (!mapContainerRef.current) {
      setMapError("Map container not found")
      setIsMapLoading(false)
      return
    }

    const initMap = async () => {
      try {
        // Load TomTom SDK if not already loaded
        if (!(window as any).tt) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = TOMTOM_SDK_URL
            script.async = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load TomTom SDK'))
            document.head.appendChild(script)
          })
        }

        // Small delay to ensure SDK is fully loaded
        await new Promise(resolve => setTimeout(resolve, 100))

        const tt = (window as any).tt
        
        if (!tt) {
          throw new Error('TomTom SDK not available')
        }

        // Initialize map with proper Philippines center
        mapRef.current = tt.map({
          key: apiKey,
          container: mapContainerRef.current,
          center: [123.7740, 12.8797], // Fixed: Proper Philippines center [lng, lat]
          zoom: 5,
          style: 'https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAVzVIak5Sa1psMEl5Y1VjUDu-_JasLpVOe7ObWhVQUtMj/drafts/0.json?key='+ apiKey,
        })

        // Add navigation control
        mapRef.current.addControl(new tt.NavigationControl())
        
        // Wait for map to be fully loaded
        mapRef.current.on('load', () => {
          console.log('Map loaded successfully')
          setIsMapReady(true)
          setIsMapLoading(false)
          // Add initial markers
          addMarkersToMap(filteredPatients)
        })

        // Handle map errors
        mapRef.current.on('error', (e: any) => {
          console.error('Map error:', e)
          setMapError('Failed to load map. Please try refreshing the page.')
          setIsMapLoading(false)
        })

      } catch (error) {
        console.error('Map initialization error:', error)
        setMapError(`Failed to load map: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsMapLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch (e) {
          console.warn('Error removing map:', e)
        }
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when filteredPatients changes AND map is ready
  useEffect(() => {
    if (isMapReady && mapRef.current) {
      updateMarkers()
    }
  }, [filteredPatients, isMapReady])

  const updateMarkers = () => {
    clearMarkers()
    addMarkersToMap(filteredPatients)
    
    // Adjust map bounds to show all markers
    if (filteredPatients.length > 0 && mapRef.current) {
      const tt = (window as any).tt
      const bounds = new tt.LngLatBounds()
      
      filteredPatients.forEach((patient) => {
        // Ensure correct coordinate order: [lng, lat]
        bounds.extend([patient.lng, patient.lat])
      })
      
      try {
        mapRef.current.fitBounds(bounds, { 
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1000 
        })
      } catch (e) {
        console.warn('Error fitting bounds:', e)
      }
    } else if (filteredPatients.length === 0 && mapRef.current) {
      // Reset to Philippines view if no patients
      mapRef.current.setCenter([123.7740, 12.8797])
      mapRef.current.setZoom(5)
    }
  }

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      try {
        marker.remove()
      } catch (e) {
        console.warn('Error removing marker:', e)
      }
    })
    markersRef.current = []
  }

  const addMarkersToMap = (patients: typeof mockPatients) => {
    const tt = (window as any).tt
    if (!tt || !mapRef.current) {
      console.warn('TomTom not available or map not ready')
      return
    }

    patients.forEach((patient) => {
      try {
        // Create marker element with better styling
        const el = document.createElement("div")
        el.style.width = "20px"
        el.style.height = "20px"
        el.style.borderRadius = "50%"
        el.style.background = getPhaseColor(patient.phase)
        el.style.border = "3px solid white"
        el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)"
        el.style.cursor = "pointer"

        // Create marker with correct coordinates [lng, lat]
        const marker = new tt.Marker({ 
          element: el,
          anchor: 'center'
        })
          .setLngLat([patient.lng, patient.lat]) // Correct order: [longitude, latitude]
          .addTo(mapRef.current)

        // Create popup
        const popup = new tt.Popup({ 
          offset: 25,
          closeButton: false
        }).setHTML(`
          <div style="min-width: 180px; font-family: system-ui, sans-serif; padding: 4px;">
            <strong style="font-size: 14px;">${patient.name}</strong>
            <div style="color: #666; font-size: 12px; margin-top: 4px;">
              ${patient.city}, ${patient.region}
            </div>
            <div style="margin-top: 8px; font-size: 12px;">
              Phase: <span style="color: ${getPhaseColor(patient.phase)}; font-weight: bold;">
                ${patient.phase}
              </span>
            </div>
          </div>
        `)

        marker.setPopup(popup)
        
        // Add click event to show popup
        el.addEventListener('click', () => {
          marker.togglePopup()
        })

        markersRef.current.push(marker)
      } catch (error) {
        console.error('Error adding marker for patient:', patient.name, error)
      }
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Patient Location Map</h1>
        <p className="text-muted-foreground">View patient distribution across regions and cities</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="w-48">
          <Select value={selectedRegion} onValueChange={(value) => {
            setSelectedRegion(value)
            setSelectedCity("all") // Reset city when region changes
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPatients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phase 1</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phaseStats["Phase 1"] || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phase 2</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phaseStats["Phase 2"] || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phase 3</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phaseStats["Phase 3"] || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Distribution Map</CardTitle>
            <CardDescription>
              {mapError ? "Error loading map" : "Interactive TomTom map showing patient locations by treatment phase"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[500px] bg-muted rounded-lg overflow-hidden">
              {mapError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600">
                  <div className="text-center">
                    <p className="font-medium">Map Loading Error</p>
                    <p className="text-sm mt-2">{mapError}</p>
                  </div>
                </div>
              ) : isMapLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : null}
              
              <div 
                ref={mapContainerRef} 
                className="absolute inset-0 w-full h-full" 
                style={{ 
                  visibility: mapError || isMapLoading ? 'hidden' : 'visible' 
                }} 
              />
              
              {/* Legend */}
              {!mapError && !isMapLoading && (
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10 border">
                  <div className="text-xs font-medium mb-2">Treatment Phase</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs">Phase 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-xs">Phase 2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Phase 3</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} in selected area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No patients found in selected area
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.city}, {patient.region}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        patient.phase === "Phase 1"
                          ? "bg-blue-100 text-blue-800"
                          : patient.phase === "Phase 2"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {patient.phase}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  
}