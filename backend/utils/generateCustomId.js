export const generateCustomId = (inventoryId, sequence) => {
  const random = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
  return `INV-${inventoryId}-${random}-${sequence}`;
};
