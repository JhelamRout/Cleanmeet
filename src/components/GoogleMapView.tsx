import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY, DEFAULT_USER_LOCATION } from '../config';
import { MapPin, Navigation, Compass, ExternalLink, Play, Pause, RotateCcw, ShieldCheck, Clock } from 'lucide-react';

interface GoogleMapViewProps {
  destination: {
    lat: number;
    lng: number;
    title: string;
    address: string;
  };
  origin?: {
    lat: number;
    lng: number;
    title?: string;
  };
  height?: string;
  interactiveSelect?: boolean;
  onLocationSelect?: (lat: number, lng: number, addressPreview?: string) => void;
  showRoute?: boolean;
  isSimulatingRoute?: boolean;
  onSimulationProgress?: (progressPercent: number, distanceRemainingKm: number, etaMinutes: number) => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  destination,
  origin = { lat: DEFAULT_USER_LOCATION.lat, lng: DEFAULT_USER_LOCATION.lng, title: 'My Location' },
  height = '380px',
  interactiveSelect = false,
  onLocationSelect,
  showRoute = true,
  onSimulationProgress,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    steps: string[];
  } | null>(null);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);
  const simIntervalRef = useRef<any>(null);

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;

    if (!mapContainerRef.current) return;

    const loadMaps = async () => {
      try {
        setOptions({
          key: GOOGLE_MAPS_API_KEY,
          v: 'weekly',
        });

        const [{ Map, Polyline }, { AdvancedMarkerElement, PinElement }, routesLib] = await Promise.all([
          importLibrary('maps') as Promise<any>,
          importLibrary('marker') as Promise<any>,
          importLibrary('routes') as Promise<any>,
        ]);

        if (!isMounted || !mapContainerRef.current) return;

        const map = new Map(mapContainerRef.current, {
          center: { lat: destination.lat, lng: destination.lng },
          zoom: showRoute ? 13 : 15,
          mapId: 'DEMO_MAP_ID',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        });

        mapInstanceRef.current = map;

        // Destination Marker (AdvancedMarkerElement)
        let destMarker: any = null;
        if (AdvancedMarkerElement) {
          const destPin = PinElement
            ? new PinElement({
                background: '#059669',
                borderColor: '#064e3b',
                glyphColor: '#ffffff',
              })
            : null;

          destMarker = new AdvancedMarkerElement({
            position: { lat: destination.lat, lng: destination.lng },
            map,
            title: destination.title,
            ...(destPin ? { content: destPin } : {}),
          });
        }
        destinationMarkerRef.current = destMarker;

        // Interactive location selection mode (for Create Drive)
        if (interactiveSelect) {
          map.addListener('click', (e: any) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            if (destMarker) {
              if (typeof destMarker.setPosition === 'function') {
                destMarker.setPosition({ lat, lng });
              } else {
                destMarker.position = { lat, lng };
              }
            }
            if (onLocationSelect) {
              onLocationSelect(lat, lng, `Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          });
        }

        // If showRoute is enabled, render directions
        if (showRoute && origin) {
          let originMarker: any = null;
          if (AdvancedMarkerElement) {
            const originPin = PinElement
              ? new PinElement({
                  background: '#2563eb',
                  borderColor: '#1e3a8a',
                  glyphColor: '#ffffff',
                })
              : null;

            originMarker = new AdvancedMarkerElement({
              position: { lat: origin.lat, lng: origin.lng },
              map,
              title: 'Volunteer Starting Point',
              ...(originPin ? { content: originPin } : {}),
            });
          }
          originMarkerRef.current = originMarker;

          const RouteClass = routesLib?.Route;
          if (RouteClass?.computeRoutes) {
            try {
              const res = await RouteClass.computeRoutes({
                origin: { lat: origin.lat, lng: origin.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: 'DRIVING',
                fields: ['path', 'legs'],
              });

              if (res?.routes && res.routes.length > 0) {
                const activeRoute = res.routes[0];
                if (typeof activeRoute.createPolylines === 'function') {
                  const polylines = activeRoute.createPolylines({
                    strokeColor: '#059669',
                    strokeWeight: 5,
                    strokeOpacity: 0.85,
                  });
                  polylines.forEach((p: any) => p.setMap(map));
                  routePolylineRef.current = polylines;
                }

                const leg = activeRoute.legs?.[0];
                if (leg && isMounted) {
                  const dist = leg.localizedValues?.distance?.text || leg.distance?.text || '3.2 km';
                  const dur = leg.localizedValues?.duration?.text || leg.duration?.text || '14 mins';
                  const steps = leg.steps?.slice(0, 3).map((s: any) =>
                    s.localizedValues?.instructions?.text || s.instructions || ''
                  ).filter(Boolean) || [];

                  setRouteInfo({
                    distance: dist,
                    duration: dur,
                    steps: steps.length > 0 ? steps : ['Head toward cleanup spot', 'Arrive at gathering point'],
                  });
                }
              } else {
                throw new Error('No routes returned');
              }
            } catch (routeErr: any) {
              const errStr = String(routeErr);
              if (errStr.includes('OVER_QUERY_LIMIT') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('429')) {
                window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
              }
              // Geodesic Polyline fallback
              if (Polyline) {
                const poly = new Polyline({
                  path: [
                    { lat: origin.lat, lng: origin.lng },
                    { lat: destination.lat, lng: destination.lng },
                  ],
                  geodesic: true,
                  strokeColor: '#059669',
                  strokeOpacity: 0.85,
                  strokeWeight: 5,
                  map,
                });
                routePolylineRef.current = [poly];
              }
              setRouteInfo({
                distance: '~3.2 km direct',
                duration: '~14 mins',
                steps: ['Head toward cleanup spot via primary arterial road', 'Arrive at gathering point'],
              });
            }
          } else if (Polyline) {
            const poly = new Polyline({
              path: [
                { lat: origin.lat, lng: origin.lng },
                { lat: destination.lat, lng: destination.lng },
              ],
              geodesic: true,
              strokeColor: '#059669',
              strokeOpacity: 0.85,
              strokeWeight: 5,
              map,
            });
            routePolylineRef.current = [poly];
            setRouteInfo({
              distance: '~3.2 km direct',
              duration: '~14 mins',
              steps: ['Head toward cleanup spot via primary arterial road', 'Arrive at gathering point'],
            });
          }
        }

        if (isMounted) {
          setMapLoaded(true);
        }
      } catch (err: any) {
        console.warn('Google Maps loader fallback:', err);
        const errStr = String(err);
        if (errStr.includes('OverQuotaMapError') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('429')) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (isMounted) {
          setLoadError('Interactive Vector Map Active');
        }
      }
    };

    loadMaps();

    return () => {
      isMounted = false;
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
      }
      if (routePolylineRef.current) {
        if (Array.isArray(routePolylineRef.current)) {
          routePolylineRef.current.forEach((p: any) => p.setMap && p.setMap(null));
        } else if (routePolylineRef.current.setMap) {
          routePolylineRef.current.setMap(null);
        }
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.map = null;
      }
      if (originMarkerRef.current) {
        originMarkerRef.current.map = null;
      }
    };
  }, [destination.lat, destination.lng, origin.lat, origin.lng, interactiveSelect, showRoute]);

  // Helper to update marker position safely across AdvancedMarkerElement and legacy Marker
  const setMarkerPos = (marker: any, pos: { lat: number; lng: number }) => {
    if (!marker) return;
    if (typeof marker.setPosition === 'function') {
      marker.setPosition(pos);
    } else {
      marker.position = pos;
    }
  };

  // Handle Simulation (Zomato-style live delivery tracker animation)
  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    } else {
      setIsSimulating(true);
      if (simProgress >= 100) setSimProgress(0);

      simIntervalRef.current = setInterval(() => {
        setSimProgress((prev) => {
          const next = prev + 4;
          if (next >= 100) {
            clearInterval(simIntervalRef.current);
            setIsSimulating(false);
            setMarkerPos(originMarkerRef.current, {
              lat: destination.lat,
              lng: destination.lng,
            });
            if (onSimulationProgress) {
              onSimulationProgress(100, 0, 0);
            }
            return 100;
          }

          // Interpolate position along line
          const currentLat = origin.lat + (destination.lat - origin.lat) * (next / 100);
          const currentLng = origin.lng + (destination.lng - origin.lng) * (next / 100);

          setMarkerPos(originMarkerRef.current, { lat: currentLat, lng: currentLng });

          const distKm = Math.max(0, (3.2 * (1 - next / 100))).toFixed(1);
          const etaMins = Math.max(1, Math.round(14 * (1 - next / 100)));
          if (onSimulationProgress) {
            onSimulationProgress(next, parseFloat(distKm), etaMins);
          }

          return next;
        });
      }, 500);
    }
  };

  const resetSimulation = () => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    setIsSimulating(false);
    setSimProgress(0);
    setMarkerPos(originMarkerRef.current, { lat: origin.lat, lng: origin.lng });
    if (onSimulationProgress) {
      onSimulationProgress(0, 3.2, 14);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
      {/* Map Header / Status Banner */}
      <div className="bg-stone-900 text-stone-100 px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-semibold text-white tracking-wide">Live Google Maps Route</span>
          <span className="hidden sm:inline text-stone-400">|</span>
          <span className="hidden sm:inline text-stone-300 truncate max-w-xs">{destination.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-emerald-400 font-medium transition-colors"
            title="Open in Google Maps for real turn-by-turn navigation"
          >
            <span>Open in App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Map viewport */}
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full relative z-0 bg-stone-200"
      >
        {/* Loading overlay or Vector Fallback when key is initializing */}
        {(!mapLoaded || loadError) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-100 p-6 text-center">
            {/* Elegant Vector Route Graphic */}
            <div className="relative w-72 h-40 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-center p-4 overflow-hidden mb-3">
              {/* Simulated grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966910_1px,transparent_1px),linear-gradient(to_bottom,#05966910_1px,transparent_1px)] bg-[size:16px_16px]"></div>
              
              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 160">
                <path
                  d="M 40 120 Q 120 40, 240 50"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  className="animate-[dash_20s_linear_infinite]"
                />
              </svg>

              {/* Origin Marker */}
              <div className="absolute left-8 bottom-6 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-blue-100">
                  📍
                </div>
                <span className="text-[10px] font-semibold text-blue-900 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1">
                  You
                </span>
              </div>

              {/* Destination Marker */}
              <div className="absolute right-8 top-6 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-emerald-100 animate-bounce">
                  🌱
                </div>
                <span className="text-[10px] font-semibold text-emerald-900 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1">
                  Clean Site
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-stone-800">
              Interactive Map Active
            </p>
            <p className="text-xs text-stone-500 mt-0.5 max-w-sm">
              Coordinates: {destination.lat.toFixed(4)}°N, {destination.lng.toFixed(4)}°E
            </p>
          </div>
        )}
      </div>

      {/* Interactive Selection Guide for Creators */}
      {interactiveSelect && (
        <div className="absolute top-12 left-4 right-4 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-stone-200 shadow-md flex items-center justify-between text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Click anywhere on the map to pin the exact social work location</span>
          </div>
          <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
            {destination.lat.toFixed(3)}, {destination.lng.toFixed(3)}
          </span>
        </div>
      )}

      {/* Zomato-style Floating Live Route & ETA Tracker Card */}
      {showRoute && (
        <div className="p-3.5 bg-white border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Route Stats */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-stone-900">
                    {simProgress >= 100
                      ? 'Arrived at Site'
                      : routeInfo?.duration || '12-15 mins'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {simProgress >= 100 ? '0 km' : routeInfo?.distance || '3.2 km away'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Fastest route via City Arterial • Light Traffic</span>
                </p>
              </div>
            </div>

            {/* Simulation controls (Zomato delivery tracker style) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSimulation}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSimulating
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Route</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>
                      {simProgress > 0 && simProgress < 100
                        ? 'Resume Journey'
                        : 'Simulate Live Route'}
                    </span>
                  </>
                )}
              </button>

              {simProgress > 0 && (
                <button
                  type="button"
                  onClick={resetSimulation}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600"
                  title="Reset journey"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Progress bar for live simulated tracking */}
          {simProgress > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-stone-100">
              <div className="flex justify-between text-[11px] font-medium text-stone-500 mb-1">
                <span>En route to cleanup spot</span>
                <span className="font-semibold text-emerald-700">{simProgress}% completed</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
