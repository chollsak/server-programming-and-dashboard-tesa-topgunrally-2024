// import { useState, useEffect } from 'react';

// export default function CodecEvent() {
//   const [fileMetadata, setFileMetadata] = useState(null);

//   useEffect(() => {
//     // Function to fetch file metadata from the API
//     const fetchFileMetadata = async () => {
//       try {
//         const response = await fetch('/api/audiopacket', { method: 'POST' });
//         if (response.ok) {
//           const data = await response.json();
//           setFileMetadata(data.fileMetadata);
//         } else {
//           console.error('Failed to fetch file metadata');
//         }
//       } catch (error) {
//         console.error('Error fetching file metadata:', error);
//       }
//     };

//     // Poll every 10 seconds to check for new file uploads
//     const interval = setInterval(fetchFileMetadata, 10000);
//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   return (
//     <div className="p-4 bg-gray-50">
//       <h2 className="text-xl font-semibold mb-4 text-gray-700">Audio Packet Event</h2>
//       {fileMetadata ? (
//         <div className="relative p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
//           <p className="text-sm text-gray-600"><strong>Filename:</strong> {fileMetadata.filename}</p>
//           <p className="text-sm text-gray-600"><strong>File Path:</strong> {fileMetadata.filePath}</p>
//           <p className="text-sm text-gray-600"><strong>Size:</strong> {fileMetadata.size} bytes</p>
//           <p className="text-sm text-gray-600"><strong>Type:</strong> {fileMetadata.type}</p>
//           <p className="text-sm text-gray-600"><strong>Upload Date:</strong> {new Date(fileMetadata.uploadDate).toLocaleString()}</p>
          
//           {/* Flowing light effect */}
//           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent overflow-hidden">
//             <div className="w-full h-full bg-orange-500 animate-flow"></div>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-500">Waiting for file upload...</p>
//       )}

//       <style jsx>{`
//         @keyframes flow {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//       `}</style>
//     </div>
//   );
// }
