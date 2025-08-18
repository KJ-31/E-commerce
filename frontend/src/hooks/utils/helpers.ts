export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

export const calculateDiscount = (price: number, originalPrice?: number): number => {
  if (originalPrice && originalPrice > price) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }
  return 0;
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const getMainImage = (images: Array<{ imageUrl: string; isMain: boolean; order: number }>): string => {
  const mainImage = images.find(img => img.isMain);
  if (mainImage) return mainImage.imageUrl;
  
  const sortedImages = images.sort((a, b) => a.order - b.order);
  return sortedImages[0]?.imageUrl || '/placeholder-image.jpg';
};