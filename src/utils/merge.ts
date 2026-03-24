export const mergeItems = <T extends { _id: string }>(
  existingItems: T[],
  itemUpdate: Partial<T>,
): T[] =>
  existingItems.map((item) =>
    item._id === itemUpdate._id ? { ...item, ...itemUpdate } : item,
  );
