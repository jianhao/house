import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Spin, message } from 'antd'
import { CarOutlined, EnvironmentOutlined, WalkOutlined } from '@ant-design/icons'

interface MapViewProps {
  address: string
  houseName: string
  longitude?: number
  latitude?: number
}

interface POI {
  name: string
  address: string
  distance: string
  type: string
}

const MapView: React.FC<MapViewProps> = ({ address, houseName, longitude, latitude }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([])
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number } | null>(null)

  useEffect(() => {
    const loadAMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.AMap) {
          resolve(window.AMap)
          return
        }
        
        const script = document.createElement('script')
        script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=YOUR_AMAP_KEY&plugin=AMap.Geocoder,AMap.PlaceSearch'
        script.onload = () => resolve(window.AMap)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const initMap = async () => {
      try {
        await loadAMapScript()
        
        let mapCenter = [120.1551, 30.2741]
        
        if (longitude && latitude) {
          mapCenter = [longitude, latitude]
          setCoordinates({ lng: longitude, lat: latitude })
        }
        
        const mapInstance = new window.AMap.Map(mapRef.current, {
          zoom: 15,
          center: mapCenter,
          mapStyle: 'amap://styles/normal'
        })
        
        new window.AMap.Marker({
          position: mapCenter,
          title: houseName,
          map: mapInstance
        })
        
        setMap(mapInstance)
        setLoading(false)
        
      } catch (error) {
        console.error('地图加载失败:', error)
        setLoading(false)
        message.error('地图加载失败')
      }
    }

    initMap()
  }, [address, houseName, longitude, latitude])

  const planRoute = (destination: string, type: 'driving' | 'walking' = 'driving') => {
    if (!coordinates) {
      message.warning('请先获取房源位置信息')
      return
    }
    
    const amapUrl = `https://uri.amap.com/navigation?from=${coordinates.lng},${coordinates.lat},${houseName}&to=${destination}&mode=${type}&coordinate=gaode`
    window.open(amapUrl, '_blank')
  }

  return (
    <div className="map-view">
      <Card title="位置信息" className="mb-4">
        <div className="mb-4">
          <p><EnvironmentOutlined /> {address}</p>
        </div>
        
        <div ref={mapRef} style={{ width: '100%', height: '400px', position: 'relative' }}>
          {loading && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
              <Spin size="large" />
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button type="primary" icon={<CarOutlined />} onClick={() => planRoute(address, 'driving')}>
            驾车导航
          </Button>
          <Button icon={<WalkOutlined />} onClick={() => planRoute(address, 'walking')}>
            步行导航
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default MapView

declare global {
  interface Window {
    AMap: any
  }
}