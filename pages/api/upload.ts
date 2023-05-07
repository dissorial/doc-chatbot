import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

interface UploadedFile {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: any;
  size: number;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: 'Error parsing form data' });
    }

    if (!files) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFiles: string[] = [];
    for (const file of Object.values(files) as UploadedFile[][]) {
      if (!file || file.length === 0) {
        continue;
      }

      const uploadedFile = file[0] as UploadedFile;
      const oldPath = uploadedFile.path;
      const newPath = path.join(
        process.cwd(),
        'docs',
        uploadedFile.originalFilename,
      );

      fs.renameSync(oldPath, newPath);
      uploadedFiles.push(uploadedFile.originalFilename);
    }

    if (uploadedFiles.length > 0) {
      return res.status(200).json({
        message: `Files ${uploadedFiles.join(', ')} uploaded and moved!`,
      });
    } else {
      return res.status(400).json({ message: 'No files uploaded' });
    }
  });
}
