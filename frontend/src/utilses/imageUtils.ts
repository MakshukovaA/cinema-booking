export type ImageSet = {
  posterUrl: string;
  backgroundImage?: string;
  gallery?: string[];
  POSTER: string;
  BACKGROUND?: string;
  GALLERY?: string[];
};

export type LegacyImageSet = {
  POSTER: string;
  BACKGROUND?: string;
  GALLERY?: string[];
};

export type FilmImages = Record<string, ImageSet>;

const PLACEHOLDER = 'https://png.pngtree.com/thumb_back/fh260/background/20240522/pngtree-abstract-white-blurred-movie-theater-interior-background-image_15686521.jpg';

const createImageSet = (
  posterUrl: string,
  backgroundImage?: string,
  gallery?: string[]
): ImageSet => {
  return {
    posterUrl,
    backgroundImage,
    gallery: gallery ?? [],
    POSTER: posterUrl,
    BACKGROUND: backgroundImage,
    GALLERY: gallery ?? []
  };
};

export const CHEBURASHKA_IMAGES = createImageSet(
  'https://i.pinimg.com/originals/71/80/4a/71804a1a8d59d0f23099a1e0d91b1804.jpg',
  'https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/2274752/RJTMDlTwRMAhYXbNnz27vA.jpg',
  []
);

export const CINEMA_IMAGES = createImageSet(
  'https://www.kino-teatr.ru/movie/kadr/132926/1069109.jpg',
  'https://images.stopgame.ru/news/2021/10/26/IyLa1E6cE.jpg',
  []
);

export const DUNE_IMAGES = createImageSet(
  'https://images.stopgame.ru/news/2021/10/26/IyLa1E6cE.jpg',
  'https://www.kino-teatr.ru/movie/kadr/132926/1069109.jpg',
  []
);


export const NIGHT_IMAGES = createImageSet(
  'https://img.freepik.com/premium-photo/cinema-movie-theatre-with-blue-seats-rows-black-copy-space-surface_118047-6522.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-photo/movie-background-collage_23-2149876015.jpg?semt=ais_hybrid&w=740',
  []
);

export const DEFAULT_FILM_IMAGES = createImageSet(
  'https://img.freepik.com/premium-photo/cinema-magic-scene-with-projector-clapperboard-film-reels-nostalgic-wooden-background_71756-5815.jpg?semt=ais_hybrid&w=740',
  'https://img.freepik.com/premium-photo/part-black-clapper-board-movie-slate-popcorn-black-background_335640-3934.jpg?semt=ais_hybrid&w=740',
  []
);

export const ALL_IMAGES: FilmImages = {
  cinema: CINEMA_IMAGES,
  dune: DUNE_IMAGES,
  cheburashka: CHEBURASHKA_IMAGES,
  night: NIGHT_IMAGES
};

const FILM_ID_MAP: Record<string, string> = {
  '1': 'dune',
  'dune': 'dune',
  '2': 'cheburashka',
  'cheburashka': 'cheburashka',
  '3': 'cinema',
  'cinema': 'cinema',
  'night': 'night'
};

export const getFilmImages = (filmId?: string | number): ImageSet | undefined => {
  if (!filmId) return undefined;
  const key = String(filmId).toLowerCase().trim();
  const mapped = FILM_ID_MAP[key] ?? key;
  return ALL_IMAGES[mapped];
};

export const getFilmImagesSafe = (filmId?: string | number): ImageSet => {
  const images = getFilmImages(filmId);
  if (!images) {
    console.warn(`[imageUtils] no images for filmId="${filmId}", using DEFAULT_FILM_IMAGES`);
    return DEFAULT_FILM_IMAGES;
  }
  return images;
};

export const getFilmPoster = (filmId?: string | number): string =>
  getFilmImagesSafe(filmId).posterUrl;

export const getFilmBackground = (filmId?: string | number): string =>
  getFilmImagesSafe(filmId).backgroundImage ?? DEFAULT_FILM_IMAGES.backgroundImage!;

export const getFilmGallery = (filmId?: string | number): string[] =>
  getFilmImagesSafe(filmId).gallery ?? [];

export const getFallbackImage = (
  type: 'poster' | 'background' | 'gallery' | string,
  filmId?: string | number,
  index?: number
): string => {
  const images = getFilmImagesSafe(filmId);

  const t = String(type).toLowerCase();
  if (t === 'poster') return images.posterUrl;
  if (t === 'background') return images.backgroundImage ?? PLACEHOLDER;
  if (t === 'gallery') {
    const g = images.gallery ?? [];
    if (g.length === 0) return PLACEHOLDER;
    const i = typeof index === 'number' ? index % g.length : 0;
    return g[i];
  }
  return PLACEHOLDER;
};

export const FREEPIK_IMAGES: Record<string, LegacyImageSet> = Object.keys(ALL_IMAGES).reduce(
  (acc, key) => {
    const img = ALL_IMAGES[key];
    acc[key.toUpperCase()] = {
      POSTER: img.POSTER,
      BACKGROUND: img.BACKGROUND,
      GALLERY: img.GALLERY
    };
    return acc;
  },
  {} as Record<string, LegacyImageSet>
);

export const getAllImages = (): FilmImages => ALL_IMAGES;