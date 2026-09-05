export const cleanLine = (line) => {
  if (typeof line !== "string") {
    return "";
  }

  return line
    .replace(/\s+/g, " ")
    .replace(
      /^(?:[•▪▫◦◼◻*−–—-]|â€¢|â—|â–ª|â—¦|â—‹)+\s*/,
      "",
    )
    .trim();
};