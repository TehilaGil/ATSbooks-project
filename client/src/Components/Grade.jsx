import { useState } from "react"
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import UpdateGrade from "./GradeUpdate"

import 'primeicons/primeicons.css';
import axios from 'axios'
import '../Grade.css';

const Grade = (props) => {
    const [visible, setVisible] = useState(false);


    //**********updateGrade
    const updateGrade = async (selectedItem, imageRef) => {
        console.log(selectedItem)
        const updatedGrade = {
            ...props.grade,
            name: selectedItem ,
            image: imageRef.current.value ? imageRef.current.value : props.grade.body,
        };
        try {
            const res = await axios.put('http://localhost:7000/api/grade', updatedGrade)
            if (res.status === 200) {

                console.log("res.data", res.data);
                props.setGradesData(res.data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    //************delete
    const deleteGrade = async (id) => {
        const res = await axios.delete(`http://localhost:7000/api/grade/${id}`)
        if (Array.isArray(res.data)) 
            {props.setGradesData(res.data)}
    }


    const footer = (

        <div className="card flex flex-wrap gap-2 justify-content-center">

            <Button icon="pi pi-times" label="Delete" onClick={() => { deleteGrade(props.grade._id) }} />

            <Button label="Update" icon="pi pi-pencil" onClick={() => setVisible(true)} />

            {/* <GradesUpdate VisibleUpdatGrade={VisibleUpdatGrade} setVisibleUpdatGrade={setVisibleUpdatGrade} updateGrade={updateGrade} grade={props.grade} /> */}
            <UpdateGrade updateGrade={updateGrade} setVisible={setVisible} visible={visible} grade={props.grade} />
        </div>
    );

    return (

        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={props.grade._id}>
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <img className="w-9 shadow-2 border-round" src={`/pictures/${props.grade.name}.png `} alt={props.grade.name} footer={footer} />
                    {/* ${grade.image} */}
                    <div className="text-2xl font-bold">{props.grade.name} {footer}</div>
                </div>
            </div>
        </div>

    )

}


export default Grade


