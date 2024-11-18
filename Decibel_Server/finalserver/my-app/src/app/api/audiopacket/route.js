// import { NextResponse } from 'next/server';
// import formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parser to handle file uploads with formidable
//   },
// };

// export async function POST(req) {
//   const form = new formidable.IncomingForm();
//   const uploadDir = path.join(process.cwd(), 'public', 'uploads');

//   // Ensure the upload directory exists
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log('ssssss')

//   return new Promise((resolve, reject) => {
//     form.uploadDir = uploadDir;
//     form.keepExtensions = true;

//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         console.error('Error parsing the form:', err);
//         return resolve(NextResponse.json({ message: 'Error processing upload' }, { status: 500 }));
//       }

//       // Access uploaded file metadata
//       const file = files.file;
//       const fileMetadata = {
//         filename: file.originalFilename,
//         filePath: `/uploads/${path.basename(file.filepath)}`,
//         size: file.size,
//         type: file.mimetype,
//         uploadDate: new Date(),
//       };

//       // Send the file metadata as a response
//       resolve(NextResponse.json({ message: 'File received', fileMetadata }, { status: 200 }));
//     });
//   });
// }
