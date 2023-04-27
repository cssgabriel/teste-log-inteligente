export default async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return await response.json();
}
