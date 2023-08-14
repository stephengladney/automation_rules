export const params: string[] = []

export function addParam<DataType>(name: keyof DataType) {
  params.push(name as string)
}
