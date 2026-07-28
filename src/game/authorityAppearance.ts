export type AuthorityExpression = 'grim';
export type AuthorityOutfit = 'strict-jacket' | 'tank-top';

export interface AuthorityAppearance {
  hairStyle: 'spiky-white' | 'bald';
  hairColor: number;
  accessory: 'brille' | 'keins';
  outfit: AuthorityOutfit;
  expression: AuthorityExpression;
  bodyType: 'normal' | 'breit';
  shirtColor: number;
}

export const AUTHORITY_APPEARANCE: Record<'gundula' | 'uli', AuthorityAppearance> = {
  gundula: {
    hairStyle: 'spiky-white',
    hairColor: 0xf1f0e8,
    accessory: 'brille',
    outfit: 'strict-jacket',
    expression: 'grim',
    bodyType: 'normal',
    shirtColor: 0x9d4f64,
  },
  uli: {
    hairStyle: 'bald',
    hairColor: 0xc99c79,
    accessory: 'keins',
    outfit: 'tank-top',
    expression: 'grim',
    bodyType: 'breit',
    shirtColor: 0x353b38,
  },
};

export function authorityAppearance(id: string): AuthorityAppearance | null {
  return id === 'gundula' || id === 'uli' ? AUTHORITY_APPEARANCE[id] : null;
}
