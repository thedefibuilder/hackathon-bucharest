export default async function fetchImageFromIpfs(content: string) {
  const json = JSON.parse(content);

  if (json && typeof json === 'object' && 'imageURI' in json) {
    const response = await fetch(json.imageURI);
    const imageJson = await response.json();

    if (imageJson && typeof imageJson === 'object' && 'imageBase64' in imageJson) {
      return imageJson.imageBase64 as string;
    }
  }
}
