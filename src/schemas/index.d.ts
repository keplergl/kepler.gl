export type ParsedConfig = {
  visState?: {
    layers?: any[];
    filters?: any[];
    interactionConfig?: {
      tooltip?: {
        fieldsToShow: {
          [key: string]: string[];
        };
        enabled: boolean;
      };
      brush?: {size: number; enabled: boolean};
      coordinate?: {enabled: boolean};
    };
    layerBlending?: string;
    splitMaps?: {
      layers: {
        [key: string]: boolean;
      };
    }[];
    animationConfig?: {
      currentTime: number;
      speed?: number;
    };
  };
  mapState?: any;
  mapStyle?: any;
};
