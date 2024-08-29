export const generateBeadPattern = (imageData: any) => {
    const pattern = [];
    for (let y = 0; y < imageData.height; y++) {
      const row = [];
      for (let x = 0; x < imageData.width; x++) {
        const index = (y * imageData.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        row.push(`rgb(${r},${g},${b})`);
      }
      pattern.push(row);
    }
    return pattern;
  };