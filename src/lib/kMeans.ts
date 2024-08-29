// src/utils/kMeans.ts

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface ClusterResult {
  centroids: Color[];
  assignments: number[];
}

export const kMeans = (
  colors: Color[],
  k: number,
  maxIterations = 10
): ClusterResult => {
  // 임의로 초기 중심점(centroids)을 선택합니다.
  const centroids: Color[] = colors.slice(0, k);
  let assignments: number[] = new Array(colors.length).fill(-1);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let hasChanged = false;

    // 각 색상을 가장 가까운 중심점으로 할당합니다.
    assignments = colors.map((color, index) => {
      let minDistance = Infinity;
      let closestCentroid = 0;

      centroids.forEach((centroid, i) => {
        const distance =
          (color.r - centroid.r) ** 2 +
          (color.g - centroid.g) ** 2 +
          (color.b - centroid.b) ** 2;

        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = i;
        }
      });

      if (assignments[index] !== closestCentroid) {
        hasChanged = true;
      }

      return closestCentroid;
    });

    if (!hasChanged) break;

    // 새로운 중심점을 계산합니다.
    const newCentroids = new Array(k).fill(0).map(() => ({ r: 0, g: 0, b: 0 }));
    const counts = new Array(k).fill(0);

    assignments.forEach((assignment, index) => {
      const color = colors[index];
      newCentroids[assignment].r += color.r;
      newCentroids[assignment].g += color.g;
      newCentroids[assignment].b += color.b;
      counts[assignment]++;
    });

    centroids.forEach((_, i) => {
      if (counts[i] > 0) {
        centroids[i].r = Math.floor(newCentroids[i].r / counts[i]);
        centroids[i].g = Math.floor(newCentroids[i].g / counts[i]);
        centroids[i].b = Math.floor(newCentroids[i].b / counts[i]);
      }
    });
  }

  return { centroids, assignments };
};
