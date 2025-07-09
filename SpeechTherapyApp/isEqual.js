function areHindiLettersEqual(said, given) {
  if (!said || !given) return false;

  // Normalize both to NFC form
  const normalizedA = said.normalize("NFC");
  const normalizedB = given.normalize("NFC");

  // Remove spaces and zero-width joiners/non-joiners
  const cleanedA = normalizedA.replace(/\s|\u200C|\u200D/g, '');
  const cleanedB = normalizedB.replace(/\s|\u200C|\u200D/g, '');

  return cleanedA === cleanedB;
}

module.exports = {areHindiLettersEqual};