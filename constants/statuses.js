export const STATUSES = [
  'Quoted',
  'Won',
  'In Progress',
  'Done',
  'Invoiced',
  'Lost',
];

export const STATUS_COLORS = {
  Quoted: '#38BDF8',
  Won: '#22C55E',
  'In Progress': '#F59E0B',
  Done: '#A78BFA',
  Invoiced: '#94A3B8',
  Lost: '#EF4444',
};

export const NEXT_STATUS = {
  Quoted: ['Won', 'Lost'],
  Won: ['In Progress', 'Lost'],
  'In Progress': ['Done', 'Lost'],
  Done: ['Invoiced'],
  Invoiced: [],
  Lost: [],
};
