export function formatSearchParams<T extends object>(data: T) {
  const params = new URLSearchParams();

  Object.keys(data).forEach((key) => {
    if (data[key as never]) {
      params.set(key, data[key as never] as string);
    }
  })

  return params;
}