const materialImageModules = import.meta.glob('../assets/material/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default'
});

export const materialImages = Object.entries(materialImageModules)
  .sort(([firstPath], [secondPath]) =>
    firstPath.localeCompare(secondPath, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  )
  .map(([, src]) => src);

const hashKey = (value = '') =>
  value.split('').reduce((total, character) => ((total * 31 + character.charCodeAt(0)) | 0), 7);

export const getProductImage = (product) => {
  if (!product) {
    return '';
  }

  if (product.image && /^(https?:)?\/\//.test(product.image)) {
    return product.image;
  }

  if (!materialImages.length) {
    return '';
  }

  const key = [product._id, product.name, product.category, product.fabric].filter(Boolean).join('|');
  const index = Math.abs(hashKey(key)) % materialImages.length;
  return materialImages[index];
};
