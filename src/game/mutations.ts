export type Mutation = {
  name: string;
  description: string;
  apply: (state: any) => any;
};

export const mutationPool: Mutation[] = [
  {
    name: 'Sticky Membranes',
    description: 'Lowers spoon damage by 50%.',
    apply: (state) => ({ ...state, spoonResistance: true }),
  },
  {
    name: 'Enzyme Cascade',
    description: '+5 XP immediately.',
    apply: (state) => ({ ...state, xp: state.xp + 5 }),
  },
  {
    name: 'Photosensitive Skin',
    description: '+5 Oxygen per day.',
    apply: (state) => ({ ...state, oxygenBonus: true }),
  },
  {
    name: 'Spice Receptors',
    description: 'Spices increase stability.',
    apply: (state) => ({ ...state, spiceSynergy: true }),
  },
  {
    name: 'Rapid Division',
    description: 'Increase XP gain by 1 per action.',
    apply: (state) => ({ ...state, xpBoost: true }),
  },
];
