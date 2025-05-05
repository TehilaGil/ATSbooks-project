// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// const ViewFile = () => {
//   const [fileUrl, setFileUrl] = useState('');

//   const { fileId } = useParams();

//   useEffect(() => {
//     setFileUrl(`http://localhost:7000/api/file/view/${fileId}`);
//   }, [fileId]);

//   return (
//     <div style={{ height: '90vh' }}>
//       <iframe
//         src={fileUrl}
//         title="תצוגת קובץ"
//         width="100%"
//         height="100%"
//         style={{ border: 'none' }}
//       />
//     </div>
//   );
// };

// export default ViewFile;


import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const FileView = () => {


  const { fileId } = useParams();
  console.log("*&^^^^^^^^^^^^^^^^^^^^^%$$$");
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.token);
  const { user } = useSelector((state) => state.token);

  useEffect(() => {
    console.log("useEffect triggered");
    console.log("useEffect triggered with fileId:", fileId);
    if (fileId)
      fetchFile()
  }, [fileId]);


  const fetchFile = async () => {
    try {
      console.log("hghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

      // קריאת שרת עם headers
      const response = await axios.get(`http://localhost:7000/api/file/view/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` }, // הוספת הטוקן ב-Headers
        responseType: 'blob', // טיפוס blob עבור קבצים
      });

      // יצירת URL זמני מה-blob
      const url = URL.createObjectURL(response.data);
      setFileUrl(url);
      setLoading(false);
      // קביעת סוג הקובץ על פי הסיומת
      const extension = fileId.split('.').pop().toLowerCase();
      if (['mp4', 'webm'].includes(extension)) setFileType('video');
      else if (['mp3', 'wav', 'ogg'].includes(extension)) setFileType('audio');
      else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) setFileType('image');
      else if (['pdf'].includes(extension)) setFileType('pdf');
      else if (['txt', 'doc', 'docx'].includes(extension)) setFileType('document');
      else setFileType('iframe');
    }
    catch (err) {
      console.error("שגיאה בטעינת הקובץ:", err);
      alert("שגיאה בטעינת הקובץ");
      setLoading(false);
    }
  }



const renderFile = () => {
  switch (fileType) {
    case 'video':
      return (
        <video controls width="100%" height="100%">
          <source src={fileUrl} type="video/mp4" />
          הדפדפן שלך לא תומך בסרטונים.
        </video>
      );
    case 'audio':
      return (
        <audio controls style={{ width: '100%' }}>
          <source src={fileUrl} type="audio/mpeg" />
          הדפדפן שלך לא תומך בקבצי שמע.
        </audio>
      );
    case 'image':
      return <img src={fileUrl} alt="תמונה" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    case 'pdf':
      return (
        <iframe
          src={fileUrl}
          title="תצוגת PDF"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            alert("שגיאה בטעינת הקובץ");
          }}
        />
      );
    case 'document':
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
          title="תצוגת מסמך"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      );
    default:
      return (
        <iframe
          src={fileUrl}
          title="תצוגת קובץ"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            alert("שגיאה בטעינת הקובץ");
          }}
        />
      );
  }
};

return (
  <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '1000px',
        height: '80vh',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        position: 'relative',
      }}
    >
      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#f9f9f9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10
        }}>
          טוען קובץ...
        </div>
      )}
      {renderFile()}
    </div>
  </div>
);
}
export default FileView;

