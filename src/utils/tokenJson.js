import fs from 'fs';

export function insertDataToken(data, file) {
  fs.writeFileSync(file, JSON.stringify(data));
}
export function getDataToken(file) {
  let data = JSON.parse(fs.readFileSync(file));
  return data;
}