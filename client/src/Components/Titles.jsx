


import React, { useEffect, useState, useRef } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Titles = () => {
    const [items, setItems] = useState([]);
    const [visibleUpload, setVisibleUpload] = useState(false);
    const [uploadTitleId, setUploadTitleId] = useState(null);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [filesByTitle, setFilesByTitle] = useState({});
    const [book, setBook] = useState(null);

    const { token } = useSelector((state) => state.token);
    const { user } = useSelector((state) => state.token);

    const toast = useRef(null);
    const { bookId } = useParams();
    const navigate = useNavigate();

    const fetchBook = async () => {
        try {
            const res = await axios.get(`http://localhost:7000/api/book/${bookId}`,{ headers : {'Authorization': `Bearer ${token}`}
            });
            setBook(res.data);
        } catch (err) {
            if(err.status===400)
                toast?.current.show({ severity: 'error', summary: 'שגיאה', detail: 'No book found', life: 3000 });
            console.error("שגיאה בטעינת ספר:", err);
        }
    };
    
    useEffect(() => {
        fetchBook();
    fetchTitles();
    }, []);

    const fetchTitles = async () => {
        try {
            const res = await axios.get(`http://localhost:7000/api/title/getTitlesByBook/${bookId}`,{ headers : {'Authorization': `Bearer ${token}`}
            });
            const titles = res.data;

            const filesMap = {};
            for (const title of titles) {
                const filesRes = await axios.get(`http://localhost:7000/api/file/title/${title._id}`,{ headers : {'Authorization': `Bearer ${token}`}
                });
                
                filesMap[title._id] = filesRes.data;
            }

            setFilesByTitle(filesMap);
            const panelItems = titles.map(title => ({
               
                label: (
                    <div className="flex justify-between align-items-center w-full">
                        <span>{title.name}</span>
                        {user?.roles === "Admin" && (<>
                        <Button icon="pi pi-plus" rounded text size="small" onClick={(e) => {
                            e.stopPropagation();
                            setUploadTitleId(title._id);
                            setVisibleUpload(true);
                        }} /></>)}
                    </div>
                ),
                items: (filesMap[title._id] || []).map(file => ({
                    label: (
                        <div className="flex justify-between align-items-center w-full gap-2">
                            <span
                                style={{
                                    maxWidth: '30%', // חצי מהרוחב של השורה
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                                title={file.name} // מציג את השם המלא כ-tooltip על מעבר עכבר
                            >
                                {file.name}
                            </span>
                            <span className="flex gap-2">
                                <Button icon="pi pi-eye" rounded text size="small" onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("&&&&&&&&&&&&*************"+file._id);
                                    
                                    navigate(`/FileView/${file._id}`);
                                    console.log("+++++++++++++++++++++++++++++++");
                                    
                                }} />
                                <Button icon="pi pi-download" rounded text size="small" onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`http://localhost:7000/api/file/download/${file._id}?name=${file.customName || file.name}`, '_blank'
                                );
                                }} />
                                  {user?.roles === "Admin" && (<>
                                <Button icon="pi pi-pencil" rounded text size="small" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit({ id: file._id, name: file.customName || file.name, titleId: title._id  });
                                }} />
                                <Button icon="pi pi-trash" rounded text size="small" severity="danger" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(file._id, title._id);
                                }} /></>)}
                            </span>
                        </div>
                    )
                }))
            }));

            setItems(panelItems);
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בטעינה', life: 3000 });
        }
    };

    const handleDelete = async (fileId, titleId) => {
        try {
            await axios.delete(`http://localhost:7000/api/file/${fileId}`,{ headers : {'Authorization': `Bearer ${token}`}
            });
            setFilesByTitle(prev => ({
                ...prev,
                [titleId]: prev[titleId].filter(f => f._id !== fileId)
            }));
            fetchTitles();
            toast.current?.show({ severity: 'success', summary: 'נמחק', detail: 'קובץ נמחק', life: 2000 });
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן למחוק', life: 3000 });
        }
    };

    const handleUpload = async ({ files }) => {
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', uploadTitleId);
        formData.append('customName', newFileName); // שליחת שם מותאם אישית

        try {
            await axios.post('http://localhost:7000/api/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data','Authorization': `Bearer ${token}` }
            });
            fetchTitles();
            setVisibleUpload(false);
            setNewFileName('');
            
            toast.current?.show({ severity: 'success', summary: 'הועלה', detail: 'קובץ הועלה בהצלחה', life: 2000 });
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'שגיאה', detail: 'העלאה נכשלה', life: 3000 });
        }
    };

    const handleEdit = ({ id, name }) => {
        setSelectedFile(id);
        setNewFileName(name);
        setVisibleUpdate(true);
    };

    const handleUpdate = async (event) => {
        console.log(selectedFile);
        
        const formData = new FormData();
console.log(formData);

        const files = event?.files;
        if (!files || files.length === 0) {
            toast.current?.show({ severity: 'error', summary: 'שגיאה', detail: 'לא נבחר קובץ לעדכון', life: 3000 });
            return;
        }
    
        const file = files[0];
        try {
            // 1. מחיקת הקובץ הישן
            await axios.delete(`http://localhost:7000/api/file/${selectedFile}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            // 2. העלאת הקובץ החדש
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', uploadTitleId);
            formData.append('customName', newFileName); // לשמר את השם המקורי אם רוצים
    
            await axios.post('http://localhost:7000/api/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            toast.current?.show({ severity: 'success', summary: 'הצלחה', detail: 'קובץ הוחלף בהצלחה', life: 3000 });
            fetchTitles();
            setVisibleUpdate(false);
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'שגיאה', detail: 'החלפה נכשלה', life: 3000 });
        }
    };
    
    
    const [filePreview, setFilePreview] = useState(''); // תצוגה מקדימה של שם הקובץ הנבחר

    
    return (
        <div className="p-4">
           
            {book && (
                <h2 className="text-center mb-4">{book.name}</h2>
            )}
    
            <div className="flex flex-column md:flex-row gap-4">
                {/* תמונת הספר בצד שמאל */}
                {book?.image && (
                    <div className="flex justify-content-center md:w-4">
                        <img
                            src={`http://localhost:7000${book.image}`} 
                            alt="Book"
                            className="border-round shadow-2"
                            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                        />
                    </div>
                )}
    
                {/* כותרות בצד ימין */}
                <div className="flex-grow-1">

                    <PanelMenu model={items} className="w-full md:w-30rem" />
                </div>
            </div>
            <Dialog
                header="Upload new file"
                visible={visibleUpload}
                onHide={() => {
                    setVisibleUpload(false);
                    setSelectedFile(null); // איפוס הקובץ הנבחר אם החלון נסגר
                    setFilePreview(''); // איפוס תצוגת שם הקובץ
                }}
                style={{ width: '30rem', borderRadius: '8px', textAlign: 'center' }}
                className="custom-upload-dialog"
            >
                <div className="flex flex-column gap-4" style={{ padding: '1.5rem' }}>
                    <label htmlFor="fileName" className="font-medium" style={{ textAlign: 'left' }}>
                        שם קובץ
                    </label>
                    <InputText
                        id="fileName"
                        placeholder="הכנס שם קובץ"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="p-inputtext-lg"
                        style={{ borderRadius: '6px', width: '100%' }}
                    />
                    <FileUpload
                        mode="basic"
                        auto={false} // ביטול העלאה אוטומטית
                        customUpload
                        // uploadHandler={handleUpload}
                        chooseLabel="בחר קובץ"
                        uploadHandler={({ files }) => {
                            console.log("jjj",files);
                            
                            setSelectedFile(files[0]); // שמירת הקובץ הנבחר ב-state זמני
                            setFilePreview(files[0]?.name || ''); // הצגת שם הקובץ הנבחר
                        }}
                        className="p-button-primary"
                        style={{ width: '100%' }}
                        
                    />
                    {filePreview && (
                        <div style={{ textAlign: 'left', fontSize: '0.9rem', color: '#555' }}>
                            <strong>קובץ נבחר:</strong> {filePreview}
                        </div>
                    )}
                    <div className="flex justify-content-center gap-3">
                        <Button
                            label="Upload"
                            onClick={() => {
                                if (selectedFile) {
                                    handleUpload({ files: [selectedFile] }); // קריאה ל-handleUpload עם הקובץ הנבחר
                                } else {
                                    toast.current?.show({ severity: 'warn', summary: 'שגיאה', detail: 'יש לבחור קובץ לפני העלאה', life: 3000 });
                                }
                            }}
                            className="p-button-primary"
                            style={{ width: '40%' }}
                        />
                        <Button
                            label="Cancel"
                            onClick={() => {
                                setVisibleUpload(false);
                                setSelectedFile(null); // איפוס הקובץ הנבחר
                                setFilePreview(''); // איפוס שם הקובץ
                            }}
                            className="p-button-secondary"
                            style={{ width: '40%' }}
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog header="עריכת קובץ" visible={visibleUpdate} style={{ width: '30vw' }} onHide={() => setVisibleUpdate(false)}>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="flex flex-column gap-3">
                    <InputText placeholder="שם קובץ חדש" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
                    {/* <FileUpload mode="basic" auto customUpload uploadHandler={({ files }) => setSelectedFile(files[0])} chooseLabel="בחר קובץ חדש" />
                    <Button label="שמור" type="submit" /> */}
                    <FileUpload
    mode="basic"
    auto={false}
    customUpload
    uploadHandler={handleUpload}
    chooseLabel="בחר קובץ..."
    className="p-button-sm"
/>
{/* <Button
    label="העלה"
    icon="pi pi-upload"
    onClick={handleUpdate}
    // onClick={() => toast.current?.show({ severity: 'warn', summary: 'הערה', detail: 'אנא בחר קובץ ולחץ העלה מתוך הקומפוננטה' })}
    className="p-button-outlined"
/> */}
                </form>
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
    
};

export default Titles;