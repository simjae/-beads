declare module "k-means" {
  interface KMeansResult {
    clusters: number[][];
    centroids: number[][];
  }

  interface KMeansOptions {
    k: number;
    iterations?: number;
    distance?: (a: number[], b: number[]) => number;
  }

  function kMeans(data: number[][], options: KMeansOptions): KMeansResult;

  export = kMeans;
}
