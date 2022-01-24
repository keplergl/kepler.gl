export type breakPointValuesType = {
  palm: number;
  desk: number;
}

export const breakPointValues: breakPointValuesType;

export type mediaType = {
  palm: (...args: any) => string;
  portable: (...args: any) => string;
  desk: (...args: any) => string;
}

export const media: mediaType;
