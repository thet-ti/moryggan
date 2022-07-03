import { v4 as uuidv4 } from 'uuid';

export const getUniqueFilename = (extension: string): string => {
  const timestamp = new Date().getTime();
  const uuid = uuidv4();

  return `${timestamp}_${uuid}${extension && `.${extension}`}`;
};

export const getContentTypeFromBase64 = (base64: string): string => {
  if (!base64) return '';

  [, base64] = base64.split(/data:/);

  if (base64) {
    [base64] = base64.split(/;base64,/);
  }

  return base64 || '';
};
