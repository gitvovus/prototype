export interface FlowerRequest {
  type: 'flower';
  id: number;
  radius: number;
  petals: number;
  t: number;
}

export interface FlowerResponse extends FlowerRequest {
  image: ImageBitmap;
}
