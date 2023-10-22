import * as fs from "fs";
import {calcTextCrc} from "./common/crcUtil";

const BASE_PATH = './store';

function _createDirectoriesAsNeeded(filePath:string) {
  const pathParts = filePath.split('/');
  pathParts.pop(); // Remove filename.
  let path = '';
  pathParts.forEach(pathPart => {
    path += pathPart + '/';
    if (!fs.existsSync(path)) fs.mkdirSync(path);
  });
}

function _getVerifiedFilepath(key:string, fileMustExist = false):string|null {
  if(!fs.existsSync(BASE_PATH)) { 
    console.error('Store directory not found: ' + BASE_PATH); // Maybe running from wrong working directory?
    return null;
  }
  const filePath = `${BASE_PATH}/${key}`;
  if (!fileMustExist) _createDirectoriesAsNeeded(filePath);
  if(fileMustExist && !fs.existsSync(filePath)) {
    console.error('File not found: ' + filePath);
    return null;
  }
  return filePath;
}

export function doesKeyExist(key: string): boolean {
  const filePath = _getVerifiedFilepath(key, false);
  if (!filePath) return false;
  return fs.existsSync(filePath);
}

export async function get(key: string): Promise<Object|null> {
  const filePath = _getVerifiedFilepath(key, true);
  if (!filePath) return null;
  return new Promise<Object> ((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }  
    });
  });
}

export async function put(key: string, data: Object): Promise<void> {
  const filePath = _getVerifiedFilepath(key);
  if (!filePath) throw Error('Failed to get verified filepath.');
  return new Promise<void> ((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }  
    });
  });
}

function _getHashKey(keyPath:string, hashValue:string):string {
  const hash = calcTextCrc(hashValue);
  return `${keyPath}/${hash}.json`;
}

export async function putHashed(keyPath:string, hashValue:string, data:Object):Promise<void> {
  const key = _getHashKey(keyPath, hashValue);
  const existingEntries = await get(key);
  const entries = existingEntries ? existingEntries as any[] : [];
  const existingIndex = entries.findIndex(entry => entry.hashValue === hashValue);
  if (existingIndex === -1) {
    entries.push({hashValue, data});
  } else { 
    entries[existingIndex] = {hashValue, data};
  }
  
  return await put(key, entries);
}

export async function getHashed(keyPath:string, hashValue:string):Promise<Object|null> {
  const key = _getHashKey(keyPath, hashValue);
  const entries = await get(key) as any[];
  if (!entries) return null;
  const existingIndex = entries.findIndex(entry => entry.hashValue === hashValue);
  return existingIndex === -1 ? null : entries[existingIndex].data;
}