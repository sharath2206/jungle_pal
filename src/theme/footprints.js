// Animal Footprints and Favorite Companions System
// Provides custom SVG footprints, cursors, sounds, and descriptors for each Jungle Pal

export const FAVORITE_ANIMALS = {
  cheetah: {
    id: 'cheetah',
    name: 'Chester the Cheetah',
    shortName: 'Cheetah',
    avatar: '🐆',
    tagline: 'Fast as lightning! Swift golden paws!',
    pawColor: '#E69C24',
    secondaryColor: '#B87208',
    sound: 'cheetah',
    speech: 'Chester the Cheetah is your safari pal! Look at your cheetah footprints!',
    // Distinctive cheetah footprint: 4 lean oval toe pads with sharp claw marks and triangular heel pad
    svgPaw: `
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Pad -->
        <path d="M 24 22 C 16 22, 13 32, 17 38 C 20 42, 28 42, 31 38 C 35 32, 32 22, 24 22 Z" fill="#E69C24" stroke="#B87208" stroke-width="2"/>
        <ellipse cx="24" cy="31" rx="4" ry="3" fill="#FFE29A"/>
        <!-- 4 Toe Pads with Claw tips -->
        <!-- Toe 1 -->
        <ellipse cx="12" cy="18" rx="3.5" ry="5" transform="rotate(-25 12 18)" fill="#E69C24" stroke="#B87208" stroke-width="1.5"/>
        <path d="M 10 13 L 8 8 L 12 11 Z" fill="#78350F"/>
        <!-- Toe 2 -->
        <ellipse cx="19" cy="13" rx="3.5" ry="5.5" transform="rotate(-8 19 13)" fill="#E69C24" stroke="#B87208" stroke-width="1.5"/>
        <path d="M 18.5 7 L 18 2 L 21 6 Z" fill="#78350F"/>
        <!-- Toe 3 -->
        <ellipse cx="29" cy="13" rx="3.5" ry="5.5" transform="rotate(8 29 13)" fill="#E69C24" stroke="#B87208" stroke-width="1.5"/>
        <path d="M 29.5 7 L 30 2 L 27 6 Z" fill="#78350F"/>
        <!-- Toe 4 -->
        <ellipse cx="36" cy="18" rx="3.5" ry="5" transform="rotate(25 36 18)" fill="#E69C24" stroke="#B87208" stroke-width="1.5"/>
        <path d="M 38 13 L 40 8 L 36 11 Z" fill="#78350F"/>
      </svg>
    `,
  },
  lion: {
    id: 'lion',
    name: 'Leo the Lion',
    shortName: 'Lion',
    avatar: '🦁',
    tagline: 'King of the jungle! Mighty round paws!',
    pawColor: '#D97706',
    secondaryColor: '#92400E',
    sound: 'lion',
    speech: 'Leo the Lion is your brave safari pal! RAWR! Lion paws on every step!',
    // Broad circular lion paw print with 4 rounded circular toe pads
    svgPaw: `
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Pad (3 lobed bottom) -->
        <path d="M 24 23 C 15 23, 11 31, 14 38 C 17 43, 21 42, 24 39 C 27 42, 31 43, 34 38 C 37 31, 33 23, 24 23 Z" fill="#D97706" stroke="#92400E" stroke-width="2"/>
        <circle cx="24" cy="33" r="4" fill="#FED7AA"/>
        <!-- 4 Round Toe Pads -->
        <circle cx="11" cy="19" r="4.5" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
        <circle cx="19" cy="13" r="5" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
        <circle cx="29" cy="13" r="5" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
        <circle cx="37" cy="19" r="4.5" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
      </svg>
    `,
  },
  bunny: {
    id: 'bunny',
    name: 'Bella the Bunny',
    shortName: 'Bunny',
    avatar: '🐰',
    tagline: 'Boing boing! Bouncy, adorable bunny hops!',
    pawColor: '#EC4899',
    secondaryColor: '#BE185D',
    sound: 'rabbit',
    speech: 'Bella the Bunny is your bouncy pal! Hop hop hop with bunny tracks!',
    // Cute elongated rabbit hop: double long pads with cute little toe beans
    svgPaw: `
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Left Foot -->
        <ellipse cx="16" cy="27" rx="5.5" ry="11" transform="rotate(-8 16 27)" fill="#F472B6" stroke="#BE185D" stroke-width="1.8"/>
        <circle cx="16" cy="31" r="3" fill="#FCE7F3"/>
        <circle cx="13" cy="13" r="2.5" fill="#F472B6" stroke="#BE185D" stroke-width="1"/>
        <circle cx="17" cy="12" r="2.5" fill="#F472B6" stroke="#BE185D" stroke-width="1"/>
        <circle cx="20" cy="14" r="2" fill="#F472B6" stroke="#BE185D" stroke-width="1"/>
        <!-- Right Foot -->
        <ellipse cx="32" cy="27" rx="5.5" ry="11" transform="rotate(8 32 27)" fill="#F472B6" stroke="#BE185D" stroke-width="1.8"/>
        <circle cx="32" cy="31" r="3" fill="#FCE7F3"/>
        <circle cx="28" cy="14" r="2" fill="#F472B6" stroke="#BE185D" stroke-width="1"/>
        <circle cx="31" cy="12" r="2.5" fill="#F472B6" stroke="#BE185D" stroke-width="1"/>
        <circle cx="35" cy="13" r="2.5" fill="#F472B6" stroke="#BE185D" stroke-width="1"/>
      </svg>
    `,
  },
  elephant: {
    id: 'elephant',
    name: 'Ellie the Elephant',
    shortName: 'Elephant',
    avatar: '🐘',
    tagline: 'Gentle giant! Big round stompy footpads!',
    pawColor: '#6366F1',
    secondaryColor: '#4338CA',
    sound: 'elephant',
    speech: 'Ellie the Elephant is your gentle giant pal! Stomp stomp stomp with big footprint pads!',
    // Large round elephant foot pad with 5 front toenail indentations
    svgPaw: `
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Giant Sturdy Round Pad -->
        <ellipse cx="24" cy="27" rx="17" ry="15" fill="#818CF8" stroke="#4338CA" stroke-width="2"/>
        <ellipse cx="24" cy="27" rx="11" ry="9" fill="#C7D2FE"/>
        <!-- 5 Rounded Toenails along the front curve -->
        <ellipse cx="12" cy="18" rx="2.5" ry="2" transform="rotate(-30 12 18)" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.2"/>
        <ellipse cx="17" cy="14" rx="2.5" ry="2" transform="rotate(-15 17 14)" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.2"/>
        <ellipse cx="24" cy="12.5" rx="3" ry="2" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.2"/>
        <ellipse cx="31" cy="14" rx="2.5" ry="2" transform="rotate(15 31 14)" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.2"/>
        <ellipse cx="36" cy="18" rx="2.5" ry="2" transform="rotate(30 36 18)" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.2"/>
      </svg>
    `,
  },
  monkey: {
    id: 'monkey',
    name: 'Milo the Monkey',
    shortName: 'Monkey',
    avatar: '🐒',
    tagline: 'Playful tree jumper! Agile hand-paws!',
    pawColor: '#10B981',
    secondaryColor: '#047857',
    sound: 'monkey',
    speech: 'Milo the Monkey is your playful pal! Ooh ooh aah aah with monkey footprints!',
    // Agile primate palm print with opposable thumb and 4 fingers
    svgPaw: `
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Central Palm -->
        <ellipse cx="25" cy="29" rx="8" ry="10" fill="#34D399" stroke="#047857" stroke-width="1.8"/>
        <!-- Thumb -->
        <ellipse cx="12" cy="32" rx="3.5" ry="6" transform="rotate(-40 12 32)" fill="#34D399" stroke="#047857" stroke-width="1.5"/>
        <!-- 4 Long Fingers -->
        <ellipse cx="16" cy="17" rx="2.5" ry="6.5" transform="rotate(-18 16 17)" fill="#34D399" stroke="#047857" stroke-width="1.5"/>
        <ellipse cx="22" cy="13" rx="2.5" ry="7.5" transform="rotate(-5 22 13)" fill="#34D399" stroke="#047857" stroke-width="1.5"/>
        <ellipse cx="28" cy="13" rx="2.5" ry="7.5" transform="rotate(5 28 13)" fill="#34D399" stroke="#047857" stroke-width="1.5"/>
        <ellipse cx="34" cy="17" rx="2.5" ry="6.5" transform="rotate(18 34 17)" fill="#34D399" stroke="#047857" stroke-width="1.5"/>
      </svg>
    `,
  },
  bear: {
    id: 'bear',
    name: 'Barnaby the Bear',
    shortName: 'Bear',
    avatar: '🐻',
    tagline: 'Cozy and strong! Wide furry bear paw!',
    pawColor: '#B45309',
    secondaryColor: '#78350F',
    sound: 'bear',
    speech: 'Barnaby the Bear is your cozy pal! Big bear hugs and big bear tracks!',
    // Wide bear paw with 5 toe beans and claw tips
    svgPaw: `
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Broad Kidney-shaped Main Pad -->
        <path d="M 24 23 C 14 23, 10 30, 14 38 C 18 43, 30 43, 34 38 C 38 30, 34 23, 24 23 Z" fill="#D97706" stroke="#78350F" stroke-width="2"/>
        <ellipse cx="24" cy="32" rx="6" ry="4" fill="#FDE68A"/>
        <!-- 5 Rounded Toe Beans with Claws -->
        <circle cx="9" cy="21" r="3.2" fill="#D97706" stroke="#78350F" stroke-width="1.2"/>
        <path d="M 8 17 L 6 13 L 9 16 Z" fill="#451A03"/>
        <circle cx="16" cy="16" r="3.8" fill="#D97706" stroke="#78350F" stroke-width="1.2"/>
        <path d="M 15 11 L 14 7 L 17 10 Z" fill="#451A03"/>
        <circle cx="24" cy="14" r="4" fill="#D97706" stroke="#78350F" stroke-width="1.2"/>
        <path d="M 23.5 9 L 24 4 L 25.5 9 Z" fill="#451A03"/>
        <circle cx="32" cy="16" r="3.8" fill="#D97706" stroke="#78350F" stroke-width="1.2"/>
        <path d="M 33 11 L 34 7 L 31 10 Z" fill="#451A03"/>
        <circle cx="39" cy="21" r="3.2" fill="#D97706" stroke="#78350F" stroke-width="1.2"/>
        <path d="M 40 17 L 42 13 L 39 16 Z" fill="#451A03"/>
      </svg>
    `,
  },
};

// Generates a clean URL data-URI for the custom CSS cursor
export function getAnimalCursorUri(animalId) {
  const animal = FAVORITE_ANIMALS[animalId] || FAVORITE_ANIMALS.cheetah;
  const svgClean = animal.svgPaw.replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  const encodedSvg = encodeURIComponent(svgClean);
  return `url("data:image/svg+xml;utf8,${encodedSvg}") 16 16, auto`;
}

// Helpers for localStorage persistence
const STORAGE_KEY = 'jungle_favorite_animal';

export function getSavedFavoriteAnimal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && FAVORITE_ANIMALS[saved]) {
      return saved;
    }
  } catch {}
  return 'cheetah'; // Cheetah is default as requested
}

export function saveFavoriteAnimal(animalId) {
  try {
    if (FAVORITE_ANIMALS[animalId]) {
      localStorage.setItem(STORAGE_KEY, animalId);
    }
  } catch {}
}
