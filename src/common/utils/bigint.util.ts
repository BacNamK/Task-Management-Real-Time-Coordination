export function serializeBigInt(data: any): string {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
}
