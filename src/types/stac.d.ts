// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * STAC EO Extension for STAC Items.
 */
export type EOExtension =
  | ({
      type: 'Feature';
      properties: Fields;
      assets: {
        [k: string]: Fields;
      };
      [k: string]: unknown;
    } & StacExtensions)
  | ({
      type: 'Collection';
      assets?: {
        [k: string]: Fields;
      };
      item_assets?: {
        [k: string]: Fields;
      };
      [k: string]: unknown;
    } & StacExtensions);
export type CloudCover = number;
export type Bands = [Band, ...Band[]];
export type NameOfTheBand = string;
export type CommonNameOfTheBand =
  | 'coastal'
  | 'blue'
  | 'green'
  | 'red'
  | 'rededge'
  | 'yellow'
  | 'pan'
  | 'nir'
  | 'nir08'
  | 'nir09'
  | 'cirrus'
  | 'swir16'
  | 'swir22'
  | 'lwir'
  | 'lwir11'
  | 'lwir12';
export type CenterWavelength = number;
export type FullWidthHalfMaxFWHM = number;

export interface Fields {
  'eo:cloud_cover'?: CloudCover;
  'eo:bands'?: Bands;
  /**
   * This interface was referenced by `Fields`'s JSON-Schema definition
   * via the `patternProperty` "^(?!eo:)".
   */
  [k: string]: unknown;
}
export interface Band {
  name?: NameOfTheBand;
  common_name?: CommonNameOfTheBand;
  center_wavelength?: CenterWavelength;
  full_width_half_max?: FullWidthHalfMaxFWHM;
  [k: string]: unknown;
}
export interface StacExtensions {
  stac_extensions: unknown[];
  [k: string]: unknown;
}

export type STACItem = Core;
export type Core = GeoJSONFeature &
  (
    | {
        geometry: GeoJSONGeometry;
        bbox: {
          [k: string]: unknown;
        } & number[];
        [k: string]: unknown;
      }
    | {
        geometry: null;
        bbox?: {
          [k: string]: unknown;
        };
        [k: string]: unknown;
      }
  ) & {
    stac_version: STACVersion;
    stac_extensions?: STACExtensions;
    id: ProviderID;
    links: ItemLinks;
    assets: AssetLinks;
    properties: CommonMetadata &
      (
        | {
            datetime: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
      );
    [k: string]: unknown;
  };
export type GeoJSONGeometry =
  | GeoJSONPoint2
  | GeoJSONLineString2
  | GeoJSONPolygon2
  | GeoJSONMultiPoint2
  | GeoJSONMultiLineString2
  | GeoJSONMultiPolygon2;
export type STACVersion = '1.0.0';
export type ReferenceToAJSONSchema = string;
export type STACExtensions = ReferenceToAJSONSchema[];
/**
 * Provider item ID
 */
export type ProviderID = string;
export type LinkReference = string;
export type LinkRelationType = string;
export type LinkType = string;
export type LinkTitle = string;
/**
 * Links to item relations
 */
export type ItemLinks = Link[];
export type Asset = {
  href: AssetReference;
  title?: AssetTitle;
  description?: AssetDescription;
  type?: AssetType;
  roles?: AssetRoles;
  [k: string]: unknown;
} & CommonMetadata;
export type AssetReference = string;
export type AssetTitle = string;
export type AssetDescription = string;
export type AssetType = string;
export type AssetRoles = string[];
export type CommonMetadata = BasicDescriptiveFields &
  DateAndTimeFields &
  InstrumentFields &
  LicensingFields &
  ProviderFields;
/**
 * A human-readable title describing the Item.
 */
export type ItemTitle = string;
/**
 * Detailed multi-line description to fully explain the Item.
 */
export type ItemDescription = string;
/**
 * The searchable date/time of the assets, in UTC (Formatted in RFC 3339)
 */
export type DateAndTime = string | null;
/**
 * The searchable start date/time of the assets, in UTC (Formatted in RFC 3339)
 */
export type StartDateAndTime = string;
/**
 * The searchable end date/time of the assets, in UTC (Formatted in RFC 3339)
 */
export type EndDateAndTime = string;
export type CreationTime = string;
export type LastUpdateTime = string;
export type Platform = string;
export type Instruments = string[];
export type Constellation = string;
export type Mission = string;
export type GroundSampleDistance = number;
export type OrganizationName = string;
export type OrganizationDescription = string;
export type OrganizationRoles = ('producer' | 'licensor' | 'processor' | 'host')[];
export type OrganizationHomepage = string;
export type Providers = {
  name: OrganizationName;
  description?: OrganizationDescription;
  roles?: OrganizationRoles;
  url?: OrganizationHomepage;
  [k: string]: unknown;
}[];

export interface GeoJSONFeature {
  type: 'Feature';
  id?: number | string;
  properties: null | {
    [k: string]: unknown;
  };
  geometry:
    | null
    | GeoJSONPoint
    | GeoJSONLineString
    | GeoJSONPolygon
    | GeoJSONMultiPoint
    | GeoJSONMultiLineString
    | GeoJSONMultiPolygon
    | GeoJSONGeometryCollection;
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number, ...number[]];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiPoint {
  type: 'MultiPoint';
  coordinates: [number, number, ...number[]][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiLineString {
  type: 'MultiLineString';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONGeometryCollection {
  type: 'GeometryCollection';
  geometries: (
    | GeoJSONPoint1
    | GeoJSONLineString1
    | GeoJSONPolygon1
    | GeoJSONMultiPoint1
    | GeoJSONMultiLineString1
    | GeoJSONMultiPolygon1
  )[];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONPoint1 {
  type: 'Point';
  coordinates: [number, number, ...number[]];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONLineString1 {
  type: 'LineString';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONPolygon1 {
  type: 'Polygon';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiPoint1 {
  type: 'MultiPoint';
  coordinates: [number, number, ...number[]][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiLineString1 {
  type: 'MultiLineString';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiPolygon1 {
  type: 'MultiPolygon';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONPoint2 {
  type: 'Point';
  coordinates: [number, number, ...number[]];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONLineString2 {
  type: 'LineString';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONPolygon2 {
  type: 'Polygon';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiPoint2 {
  type: 'MultiPoint';
  coordinates: [number, number, ...number[]][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiLineString2 {
  type: 'MultiLineString';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface GeoJSONMultiPolygon2 {
  type: 'MultiPolygon';
  coordinates: [
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    [number, number, ...number[]],
    ...[number, number, ...number[]][]
  ][][];
  bbox?: [number, number, number, number, ...number[]];
  [k: string]: unknown;
}
export interface Link {
  href: LinkReference;
  rel: LinkRelationType;
  type?: LinkType;
  title?: LinkTitle;
  [k: string]: unknown;
}
/**
 * Links to assets
 */
export interface AssetLinks {
  [k: string]: Asset;
}
export interface BasicDescriptiveFields {
  title?: ItemTitle;
  description?: ItemDescription;
  [k: string]: unknown;
}
export interface DateAndTimeFields {
  datetime?: DateAndTime;
  start_datetime?: StartDateAndTime;
  end_datetime?: EndDateAndTime;
  created?: CreationTime;
  updated?: LastUpdateTime;
  [k: string]: unknown;
}
export interface InstrumentFields {
  platform?: Platform;
  instruments?: Instruments;
  constellation?: Constellation;
  mission?: Mission;
  gsd?: GroundSampleDistance;
  [k: string]: unknown;
}
export interface LicensingFields {
  license?: string;
  [k: string]: unknown;
}
export interface ProviderFields {
  providers?: Providers;
  [k: string]: unknown;
}

/**
 * This object represents Collections in a SpatioTemporal Asset Catalog.
 */
export type STACCollectionSpecification = STACCollection;
export type STACVersion = '1.0.0';
export type ReferenceToAJSONSchema = string;
export type STACExtensions = ReferenceToAJSONSchema[];
export type TypeOfSTACEntity = 'Collection';
export type Identifier = string;
export type Title = string;
export type Description = string;
export type Keywords = string[];
export type CollectionLicenseName = string;
export type OrganizationName = string;
export type OrganizationDescription = string;
export type OrganizationRoles = ('producer' | 'licensor' | 'processor' | 'host')[];
export type OrganizationHomepage = string;
export type SpatialExtents = [SpatialExtent, ...SpatialExtent3[]];
export type SpatialExtent = SpatialExtent1 & SpatialExtent2;
export type SpatialExtent1 =
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    };
export type SpatialExtent2 = number[];
export type SpatialExtent3 = SpatialExtent1 & SpatialExtent2;
export type TemporalExtents = [TemporalExtent, ...TemporalExtent[]];
export type TemporalExtent = [string | null, string | null];
export type AssetReference = string;
export type AssetTitle = string;
export type AssetDescription = string;
export type AssetType = string;
export type AssetRoles = string[];
/**
 * A human-readable title describing the Item.
 */
export type ItemTitle = string;
/**
 * Detailed multi-line description to fully explain the Item.
 */
export type ItemDescription = string;
/**
 * The searchable date/time of the assets, in UTC (Formatted in RFC 3339)
 */
export type DateAndTime = string | null;
/**
 * The searchable start date/time of the assets, in UTC (Formatted in RFC 3339)
 */
export type StartDateAndTime = string;
/**
 * The searchable end date/time of the assets, in UTC (Formatted in RFC 3339)
 */
export type EndDateAndTime = string;
export type CreationTime = string;
export type LastUpdateTime = string;
export type Platform = string;
export type Instruments = string[];
export type Constellation = string;
export type Mission = string;
export type GroundSampleDistance = number;
export type OrganizationName1 = string;
export type OrganizationDescription1 = string;
export type OrganizationRoles1 = ('producer' | 'licensor' | 'processor' | 'host')[];
export type OrganizationHomepage1 = string;
export type Providers = {
  name: OrganizationName1;
  description?: OrganizationDescription1;
  roles?: OrganizationRoles1;
  url?: OrganizationHomepage1;
  [k: string]: unknown;
}[];
export type LinkReference = string;
export type LinkRelationType = string;
export type LinkType = string;
export type LinkTitle = string;
export type Links = Link[];
export type JSONSchema = CoreSchemaMetaSchema;
export type CoreSchemaMetaSchema =
  | {
      $id?: string;
      $schema?: string;
      $ref?: string;
      $comment?: string;
      title?: string;
      description?: string;
      default?: true;
      readOnly?: boolean;
      writeOnly?: boolean;
      examples?: true[];
      multipleOf?: number;
      maximum?: number;
      exclusiveMaximum?: number;
      minimum?: number;
      exclusiveMinimum?: number;
      maxLength?: number;
      minLength?: number;
      pattern?: string;
      additionalItems?: CoreSchemaMetaSchema;
      items?: CoreSchemaMetaSchema | [CoreSchemaMetaSchema, ...CoreSchemaMetaSchema[]];
      maxItems?: number;
      minItems?: number;
      uniqueItems?: boolean;
      contains?: CoreSchemaMetaSchema;
      maxProperties?: number;
      minProperties?: number;
      required?: string[];
      additionalProperties?: CoreSchemaMetaSchema;
      definitions?: {
        [k: string]: CoreSchemaMetaSchema;
      };
      properties?: {
        [k: string]: CoreSchemaMetaSchema;
      };
      patternProperties?: {
        [k: string]: CoreSchemaMetaSchema;
      };
      dependencies?: {
        [k: string]: CoreSchemaMetaSchema | string[];
      };
      propertyNames?: CoreSchemaMetaSchema;
      const?: true;
      enum?: [true, ...unknown[]];
      type?:
        | ('array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string')
        | [
            'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string',
            ...('array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string')[]
          ];
      format?: string;
      contentMediaType?: string;
      contentEncoding?: string;
      if?: CoreSchemaMetaSchema;
      then?: CoreSchemaMetaSchema;
      else?: CoreSchemaMetaSchema;
      allOf?: [CoreSchemaMetaSchema, ...CoreSchemaMetaSchema[]];
      anyOf?: [CoreSchemaMetaSchema, ...CoreSchemaMetaSchema[]];
      oneOf?: [CoreSchemaMetaSchema, ...CoreSchemaMetaSchema[]];
      not?: CoreSchemaMetaSchema;
      [k: string]: unknown;
    }
  | boolean;
export type MinimumValue = number | string;
export type MaximumValue = number | string;
export type SetOfValues = [
  {
    [k: string]: unknown;
  },
  ...{
    [k: string]: unknown;
  }[]
];

/**
 * These are the fields specific to a STAC Collection. All other fields are inherited from STAC Catalog.
 */
export interface STACCollection {
  stac_version: STACVersion;
  stac_extensions?: STACExtensions;
  type: TypeOfSTACEntity;
  id: Identifier;
  title?: Title;
  description: Description;
  keywords?: Keywords;
  license: CollectionLicenseName;
  providers?: {
    name: OrganizationName;
    description?: OrganizationDescription;
    roles?: OrganizationRoles;
    url?: OrganizationHomepage;
    [k: string]: unknown;
  }[];
  extent: Extents;
  assets?: AssetLinks;
  links: Links;
  summaries?: Summaries;
  [k: string]: unknown;
}
export interface Extents {
  spatial: SpatialExtentObject;
  temporal: TemporalExtentObject;
  [k: string]: unknown;
}
export interface SpatialExtentObject {
  bbox: SpatialExtents;
  [k: string]: unknown;
}
export interface TemporalExtentObject {
  interval: TemporalExtents;
  [k: string]: unknown;
}
/**
 * Links to assets
 */
export interface AssetLinks {
  [k: string]: {
    href: AssetReference;
    title?: AssetTitle;
    description?: AssetDescription;
    type?: AssetType;
    roles?: AssetRoles;
    [k: string]: unknown;
  } & (BasicDescriptiveFields &
    DateAndTimeFields &
    InstrumentFields &
    LicensingFields &
    ProviderFields);
}
export interface BasicDescriptiveFields {
  title?: ItemTitle;
  description?: ItemDescription;
  [k: string]: unknown;
}
export interface DateAndTimeFields {
  datetime?: DateAndTime;
  start_datetime?: StartDateAndTime;
  end_datetime?: EndDateAndTime;
  created?: CreationTime;
  updated?: LastUpdateTime;
  [k: string]: unknown;
}
export interface InstrumentFields {
  platform?: Platform;
  instruments?: Instruments;
  constellation?: Constellation;
  mission?: Mission;
  gsd?: GroundSampleDistance;
  [k: string]: unknown;
}
export interface LicensingFields {
  license?: string;
  [k: string]: unknown;
}
export interface ProviderFields {
  providers?: Providers;
  [k: string]: unknown;
}
export interface Link {
  href: LinkReference;
  rel: LinkRelationType;
  type?: LinkType;
  title?: LinkTitle;
  [k: string]: unknown;
}
export interface Summaries {
  [k: string]: JSONSchema | Range | SetOfValues;
}
export interface Range {
  minimum: MinimumValue;
  maximum: MaximumValue;
  [k: string]: unknown;
}

export type AssetTitle = string;
export type AssetDescription = string;
export type AssetType = string;
export type AssetRoles = string[];

/**
 * STAC Item Assets Definition Extension for STAC Collections.
 */
export interface ItemAssetsDefinitionExtension {
  stac_extensions: unknown[];
  type: 'Collection';
  item_assets: {
    [k: string]: {
      href?: DisallowHref;
      title?: AssetTitle;
      description?: AssetDescription;
      type?: AssetType;
      roles?: AssetRoles;
      [k: string]: unknown;
    };
  };
  [k: string]: unknown;
}
export interface DisallowHref {
  [k: string]: unknown;
}

/**
 * STAC Raster Extension for STAC Items.
 */
export type RasterExtension =
  | ({
      type: 'Feature';
      assets: {
        [k: string]: Assetfields;
      };
      [k: string]: unknown;
    } & StacExtensions)
  | {
      type: 'Collection';
      assets?: {
        [k: string]: Assetfields;
      };
      item_assets?: {
        [k: string]: Assetfields;
      };
      [k: string]: unknown;
    };
export type Bands = [Band, ...Band[]];
export type DataTypeOfTheBand =
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'float16'
  | 'float32'
  | 'float64'
  | 'cint16'
  | 'cint32'
  | 'cfloat32'
  | 'cfloat64'
  | 'other';
export type UnitDenominationOfThePixelValue = string;
export type TheActualNumberOfBitsUsedForThisBand = number;
export type PixelSamplingInTheBand = 'area' | 'point';
export type NoDataPixelValue = number | ('nan' | 'inf' | '-inf');
export type MultiplicatorFactorOfThePixelValueToTransformIntoTheValue = number;
export type NumberToBeAddedToThePixelValueToTransformIntoTheValue = number;
export type AverageSpatialResolutionInMetersOfThePixelsInTheBand = number;
export type MeanValueOfAllThePixelsInTheBand = number;
export type MinimumValueOfAllThePixelsInTheBand = number;
export type MaximumValueOfAllThePixelsInTheBand = number;
export type StandardDeviationValueOfAllThePixelsInTheBand = number;
export type PercentageOfValidNotNodataPixel = number;
export type NumberOfBuckets = number;
export type MinimumValueOfTheBuckets = number;
export type MaximumValueOfTheBuckets = number;
export type DistributionBuckets = [
  NumberOfPixelsInTheBucket,
  NumberOfPixelsInTheBucket,
  NumberOfPixelsInTheBucket,
  ...NumberOfPixelsInTheBucket[]
];
export type NumberOfPixelsInTheBucket = number;

export interface Assetfields {
  'raster:bands'?: Bands;
  /**
   * This interface was referenced by `Assetfields`'s JSON-Schema definition
   * via the `patternProperty` "^(?!raster:)".
   */
  [k: string]: {
    [k: string]: unknown;
  };
}
export interface Band {
  data_type?: DataTypeOfTheBand;
  unit?: UnitDenominationOfThePixelValue;
  bits_per_sample?: TheActualNumberOfBitsUsedForThisBand;
  sampling?: PixelSamplingInTheBand;
  nodata?: NoDataPixelValue;
  scale?: MultiplicatorFactorOfThePixelValueToTransformIntoTheValue;
  offset?: NumberToBeAddedToThePixelValueToTransformIntoTheValue;
  spatial_resolution?: AverageSpatialResolutionInMetersOfThePixelsInTheBand;
  statistics?: Statistics;
  histogram?: Histogram;
  [k: string]: unknown;
}
export interface Statistics {
  mean?: MeanValueOfAllThePixelsInTheBand;
  minimum?: MinimumValueOfAllThePixelsInTheBand;
  maximum?: MaximumValueOfAllThePixelsInTheBand;
  stddev?: StandardDeviationValueOfAllThePixelsInTheBand;
  valid_percent?: PercentageOfValidNotNodataPixel;
}
export interface Histogram {
  count: NumberOfBuckets;
  min: MinimumValueOfTheBuckets;
  max: MaximumValueOfTheBuckets;
  buckets: DistributionBuckets;
}
export interface StacExtensions {
  stac_extensions: unknown[];
  [k: string]: unknown;
}

/**
 * STAC Item or Collection
 */
export type STACObject = STACItem | STACCollection;

/**
 * STAC Item including our required extensions: EO and Raster
 */
export type CompleteSTACItem = STACItem & EOExtension & RasterExtension;

/**
 * STAC Collection including our required extensions: Item Assets, EO, and Raster
 */
export type CompleteSTACCollection = STACCollection &
  ItemAssetsDefinitionExtension &
  EOExtension &
  RasterExtension;

export type CompleteSTACObject = CompleteSTACItem | CompleteSTACCollection;
