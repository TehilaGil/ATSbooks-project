import { useState } from "react"
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';
import UpdateGrade from "./GradeUpdate"

import 'primeicons/primeicons.css';
import axios from 'axios'
import '../Grade.css';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";


const Grade = (props) => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const { token } = useSelector((state) => state.token);
    const { user } = useSelector((state) => state.token);
    const navigate = useNavigate();
    //**********updateGrade
    const updateGrade = async (selectedItem, imageRef) => {
        console.log(selectedItem)
        const updatedGrade = {
            ...props.grade,
            name: selectedItem,
            // image: imageRef.current.value ? imageRef.current.value : props.grade.body,
        };
        try {
            const res = await axios.put('http://localhost:7000/api/grade', updatedGrade, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.status === 200) {

                console.log("res.data", res.data);
                props.setGradesData(res.data)
                if (toast?.current) {
                    toast.current.show({ severity: 'success', summary: 'Updated successfully', life: 3000 });
                }
            }
        } catch (e) {
            console.error(e)
            props.toast?.current.show({
                severity: 'error',
                summary: 'Error updating',
                detail: e.response?.data?.message || e.message,
                life: 4000
            });
        }
    }

    const [isLoading, setIsLoading] = useState(false);

    const deleteGrade = async (id) => {
        console.log("Deleting grade with ID:", id);

        try {
            console.log("Accept function triggered");
            const res = await axios.delete(`http://localhost:7000/api/grade/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(res.data)) {
                props.setGradesData(res.data);
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'נמחק בהצלחה', life: 3000 });
                }

            }
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'שגיאה במחיקה',
                detail: e.response?.data?.message || e.message,
                life: 4000
            });

        }
        finally {
            setIsLoading(false); // להחזיר את המצב לאחר סיום הפעולה
        }


    };



    // const footer = (

    //     <div className="card flex flex-wrap gap-2 justify-content-center">

    //         <Button icon="pi pi-times" label="Delete" onClick={() => { deleteGrade(props.grade._id) }} />

    //         <Button label="Update" icon="pi pi-pencil" onClick={() => setVisible(true)} />

    //          <Link to={`/grads/${props.grade._id}`} className="text-center p-2">
    //                 <Button icon="pi pi-search" className="p-button-rounded" label="For details" />
    //         </Link>

    //         {/* <GradesUpdate VisibleUpdatGrade={VisibleUpdatGrade} setVisibleUpdatGrade={setVisibleUpdatGrade} updateGrade={updateGrade} grade={props.grade} /> */}
    //         <UpdateGrade updateGrade={updateGrade} setVisible={setVisible} visible={visible} grade={props.grade} />
    //     </div>
    // );
    const [iDdeleteBook, setIDdeleteBook] = useState(null);
    const [deletflage, setDeletflage] = useState(false);



const confirmDeleteGrade = (id) => {
        confirmDialog({
            message: 'Are you sure you want to delete this grade?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            accept: () => deleteGrade(id),
            reject: () => {
                toast.current.show({ severity: 'info', summary: 'Cancelled', detail: 'Deletion canceled', life: 3000 });
            }
        });
    };


const footer = (
    <div className="card flex flex-wrap gap-2 justify-content-center">
        {user?.roles === "Admin" && (
            <>
                <Button icon="pi pi-times" label="Delete" onClick={(e) => {
                    e.stopPropagation()
                    // setIDdeleteBook(props.grade._id)
                    // setDeletflage(true)
                    deleteGrade(props.grade._id)
                }} />

                <Button label="Update" icon="pi pi-pencil" onClick={(e) => {
                    e.stopPropagation()
                    setVisible(true)
                }} /></>)}
        <UpdateGrade updateGrade={updateGrade} setVisible={setVisible} visible={visible} grade={props.grade} />
    </div>
);


return (
    <>
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={props.grade._id}>

            <div
                className="p-4 border-1 surface-border surface-card border-round"
                onClick={() => navigate(`/books/${props.grade._id}`)}
                style={{ cursor: 'pointer' }}>

                <div className="flex flex-column align-items-center gap-3 py-5">
                    <img className="w-9 shadow-2 border-round" src={`/pictures/${props.grade.name}.png `} alt={props.grade.name} footer={footer} />
                    {/* ${grade.image} */}
                    <div className="text-2xl font-bold">{props.grade.name} {footer}</div>
                </div>
            </div>
        </div>
    </>
)

}
{/* <Link to={`/books/${props.grade._id}`} className="link-custom"></Link> */ }

export default Grade


