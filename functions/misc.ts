export function isObjectInArray(obj: Object, arr: Object[]) {
  return JSON.stringify(arr).includes(JSON.stringify(obj))
}
