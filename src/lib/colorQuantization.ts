// src/utils/ColorQuantization.ts

import { Color, kMeans } from "./kMeans";

export const colorQuantization = (
  imageData: ImageData,
  clusterCount: number
): ImageData => {
  const colors: Color[] = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    colors.push({
      r: imageData.data[i],
      g: imageData.data[i + 1],
      b: imageData.data[i + 2],
    });
  }

  const clusters = kMeans(colors, clusterCount);

  for (let i = 0; i < colors.length; i++) {
    const clusterIndex = clusters.assignments[i];
    const centroid = clusters.centroids[clusterIndex];
    imageData.data[i * 4] = centroid.r;
    imageData.data[i * 4 + 1] = centroid.g;
    imageData.data[i * 4 + 2] = centroid.b;
  }

  return imageData;
};
