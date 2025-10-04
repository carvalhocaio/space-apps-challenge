export interface NASACoordinates {
  latitude: number;
  longitude: number;
}

export interface CropCASMAResponse {
  soilMoisture: number;
  timestamp: string;
  depth: string;
  unit: string;
}

export interface GLAMResponse {
  temperature: number;
  precipitation: number;
  timestamp: string;
  location: NASACoordinates;
}

export interface WorldviewImageRequest {
  latitude: number;
  longitude: number;
  date: string;
  layers: string[];
  width?: number;
  height?: number;
}

export interface WorldviewImageResponse {
  imageUrl: string;
  date: string;
  layers: string[];
}

export interface VegetationIndexResponse {
  ndvi: number;
  timestamp: string;
  location: NASACoordinates;
}

export interface NASAAPIError {
  error: string;
  code: string;
  details?: unknown;
}

export const NASA_API_ENDPOINTS = {
  CROP_CASMA: 'https://nassgeo.csiss.gmu.edu/CropCASMA/api',
  GLAM: 'https://glam1.gsfc.nasa.gov/api',
  WORLDVIEW: 'https://worldview.earthdata.nasa.gov/api/v1',
  GIBS: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
} as const;

export const WORLDVIEW_LAYERS = {
  MODIS_TERRA_TRUE_COLOR: 'MODIS_Terra_CorrectedReflectance_TrueColor',
  VIIRS_SNPP_TRUE_COLOR: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
  NDVI: 'MODIS_Terra_NDVI_8Day',
  SOIL_MOISTURE: 'SMAP_L4_Analyzed_Surface_Soil_Moisture',
} as const;
