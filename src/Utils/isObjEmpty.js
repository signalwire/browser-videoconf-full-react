export default function isObjEmpty(obj) {
  if (obj === null || obj === undefined) return false;
  for (var i in obj) return false;
  return true;
}
