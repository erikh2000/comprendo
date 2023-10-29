import aws4 from 'aws4';
import fetch from 'node-fetch';
import { COMPRENDO_ACCESS_KEY_ID, COMPRENDO_SECRET_ACCESS_KEY, COMPRENDO_API_ID, COMPRENDO_REGION, COMPRENDO_STAGE } from "./private/apiConfig";

export async function callApiGateway(resource:string, method:string, body:Object):Promise<Object> {
  const region = COMPRENDO_REGION;
  const stage = COMPRENDO_STAGE;
  const endpoint = `https://${COMPRENDO_API_ID}.execute-api.${region}.amazonaws.com/${stage}/${resource}`;
  const requestDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');

  const request = {
    host: new URL(endpoint).hostname,
    method: 'POST',
    path: `/${stage}/${resource}`,
    headers: { 'Content-Type': 'application/json', 'X-Amz-Date': requestDate },
    body: JSON.stringify(body),
    service:'execute-api',
    region,
  };

  const credentials = { accessKeyId: COMPRENDO_ACCESS_KEY_ID, secretAccessKey: COMPRENDO_SECRET_ACCESS_KEY };
  aws4.sign(request, credentials);
  
  const response = await fetch(endpoint, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(text);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}