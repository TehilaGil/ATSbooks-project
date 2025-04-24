


// import React, { useState, useEffect } from 'react';
// import { Button } from 'primereact/button';
// import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
// import { Tag } from 'primereact/tag';
// import { classNames } from 'primereact/utils';

// export default function BasicDemo() {
//     const [books, setBooks] = useState([]);
//     const [layout, setLayout] = useState('grid');

//     useEffect(() => {
//         getBooks();
//     }, []);

//     const getSeverity = (book) => {
//         switch (book.inventoryStatus) {
//             case 'INSTOCK':
//                 return 'success';

//             case 'LOWSTOCK':
//                 return 'warning';

//             case 'OUTOFSTOCK':
//                 return 'danger';

//             default:
//                 return null;
//         }
//     };

//     const listItem = (book, index) => {
//         return (
//             <div className="col-12" key={book.id}>
//                 <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
//                     <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/book/${book.image}`} alt={book.name} />
//                     <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
//                         <div className="flex flex-column align-items-center sm:align-items-start gap-3">
//                             <div className="text-2xl font-bold text-900">{book.name}</div>
//                             <div className="flex align-items-center gap-3">
//                                 <span className="flex align-items-center gap-2">
//                                     <i className="pi pi-tag"></i>
//                                     <span className="font-semibold">{book.category}</span>
//                                 </span>
//                                 <Tag value={book.inventoryStatus} severity={getSeverity(book)}></Tag>
//                             </div>
//                         </div>
//                         <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
//                             <span className="text-2xl font-semibold">${book.price}</span>
//                             <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={book.inventoryStatus === 'OUTOFSTOCK'}></Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const gridItem = (book) => {
//         return (
//             <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book.id}>
//                 <div className="p-4 border-1 surface-border surface-card border-round">
//                     <div className="flex flex-wrap align-items-center justify-content-between gap-2">
//                         <div className="flex align-items-center gap-2">
//                             <i className="pi pi-tag"></i>
//                             <span className="font-semibold">{book.category}</span>
//                         </div>
//                         <Tag value={book.inventoryStatus} severity={getSeverity(book)}></Tag>
//                     </div>
//                     <div className="flex flex-column align-items-center gap-3 py-5">
//                         <img className="w-9 shadow-2 border-round" src={`https://primefaces.org/cdn/primereact/images/book/${book.image}`} alt={book.name} />
//                         <div className="text-2xl font-bold">{book.name}</div>
//                         <Rating value={book.rating} readOnly cancel={false}></Rating>
//                     </div>
//                     <div className="flex align-items-center justify-content-between">
//                         <span className="text-2xl font-semibold">${book.price}</span>
//                         <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={book.inventoryStatus === 'OUTOFSTOCK'}></Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const itemTemplate = (book, layout, index) => {
//         if (!book) {
//             return;
//         }

//         if (layout === 'list') return listItem(book, index);
//         else if (layout === 'grid') return gridItem(book);
//     };

//     const listTemplate = (books, layout) => {
//         return <div className="grid grid-nogutter">{books.map((book, index) => itemTemplate(book, layout, index))}</div>;
//     };

//     const header = () => {
//         return (
//             <div className="flex justify-content-end">
//                 <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
//             </div>
//         );
//     };

//     return (
//         <div className="card">
//             <DataView value={books} listTemplate={listTemplate} layout={layout} header={header()} />
//         </div>
//     )
// }
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import BookCreate from  "./BookCreat"

export default function BooksDataView() {
    const [books, setBooks] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [visibleCreatBook, setVisibleCreatBook] = useState(false);

    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/book')
            if (res.status === 200) {
                console.log(res.data);
                setBooks(res.data)
            }
        } catch (e) {
            console.error(e)
        }
    }
    const createBook = async (nameRef,  GradesRef,imageRef) => {
        const newBook = {
            name: nameRef.current.value ? nameRef.current.value : " ",
            grades: GradesRef.current.value ? GradesRef.current.value : " ",
            image: imageRef.current.value ? imageRef.current.value : " "
        };
    
        try {
            const res = await axios.post('http://localhost:7000/api/book', newBook)
                // headers: {
                //     Authorization: `Bearer ${localStorage.getItem("token")}` // אם את משתמשת ב־JWT
                // }
            
    
            if (res.status === 200 || res.status === 201) {
                console.log("ספר נוצר:", res.data);
                getBooks(); // אם יש לך פונקציה כזו לרענון
            }
        } catch (e) {
            console.error("שגיאה ביצירת ספר:", e);
        }
    };
    



    

    const listItem = (book, index) => (
        <div className="col-12" key={book._id}>
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={book.image} alt={book.name} />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{book.name}</div>
                        <div className="text-sm text-color-secondary">מספר שכבות גיל: {book.grades.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const gridItem = (book) => (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book._id}>
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <img className="w-9 shadow-2 border-round" src={book.image} alt={book.name} />
                    <div className="text-2xl font-bold">{book.name}</div>
                    <div className="text-sm text-color-secondary">מותאם ל-{book.grades.length} שכבות גיל</div>
                </div>
                <div className="flex align-items-center justify-content-center mt-3">
                    <Button icon="pi pi-search" className="p-button-rounded" label="לפרטים"></Button>
                </div>
            </div>
        </div>
    );

    const itemTemplate = (book, layout, index) => {
        if (!book) return;
        return layout === 'list' ? listItem(book, index) : gridItem(book);
    };

    const listTemplate = (books, layout) => (
        <div className="grid grid-nogutter">{books.map((book, index) => itemTemplate(book, layout, index))}</div>
    );

    const header = () => (
        <div className="flex justify-content-end">
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    return (
        <div>
        <Button icon="pi pi-plus" rounded aria-label="Filter" onClick={() => setVisibleCreatBook(true)} />
        <BookCreate createBook={createBook} setVisibleCreatBook={setVisibleCreatBook} visibleCreatBook={visibleCreatBook} />
        <div className="card">
            <DataView value={books} listTemplate={listTemplate} layout={layout} header={header()} />
        </div></div>
    );
}
  











