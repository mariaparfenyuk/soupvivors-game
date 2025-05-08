export type SoupType = {
  id: string;
  name: string;
  description: string;
  asciiIcon: string[]; // 3 строки по 3 emoji
  initialResources: {
    proteins: number;
    carbs: number;
    spices: number;
    oxygen: number;
  };
};

export const soups: SoupType[] = [
  {
    id: 'borscht',
    name: 'Borscht',
    description: 'Earthy and stable. Root-rich soup of survival.',
    asciiIcon: [
      '🟥🥬🟥',
      '🥔🧄🥕',
      '🟥🥕🟥',
    ],
    initialResources: {
      proteins: 30,
      carbs: 50,
      spices: 10,
      oxygen: 25,
    },
  },
  {
    id: 'miso',
    name: 'Miso Soup',
    description: 'Light, fast, and fleeting. A whisper of umami.',
    asciiIcon: [
      '⬜🟫⬜',
      '🟧⬜🟧',
      '⬜🟫⬜',
    ],
    initialResources: {
      proteins: 15,
      carbs: 30,
      spices: 20,
      oxygen: 40,
    },
  },
  {
    id: 'tom_kha',
    name: 'Tom Kha',
    description: 'Spicy coconut chaos. Perfect for mutations.',
    asciiIcon: [
      '🥥🌶🥬',
      '🟠🌶🟠',
      '🥥🥬🌶',
    ],
    initialResources: {
      proteins: 20,
      carbs: 25,
      spices: 40,
      oxygen: 20,
    },
  },
];
