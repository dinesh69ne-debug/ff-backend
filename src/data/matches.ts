export interface Match {
  id: number;
  title: string;
  fee: number;
  slots: number;
}

export const matches: Match[] = [
  { id: 1, title: "Battle Royale - Squad", fee: 50, slots: 10 },
  { id: 2, title: "Clash Squad Pro", fee: 100, slots: 8 },
  { id: 3, title: "Custom Room Tournament", fee: 150, slots: 5 },
];