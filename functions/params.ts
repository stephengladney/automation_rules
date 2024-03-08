export const params: string[] = []

export function createParam<DataType>(name: keyof DataType) {
  params.push(name as string)
  return name
}
