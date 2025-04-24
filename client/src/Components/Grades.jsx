import { useEffect, useState } from "react"
import { Button } from 'primereact/button';

import 'primeicons/primeicons.css';
import axios from 'axios'
import Grade from "./Grade"
import CreatGrade from "./GradeCreat"
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

const Grades = () => {
    const [gradesData, setGradesData] = useState([])
    const [visibleCreatGrade, setVisibleCreatGrade] = useState(false);

    //GET - getAllGrades/
    const getGrades = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/grade')
            if (res.status === 200) {
                //console.log(res.data);
                setGradesData(res.data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const getGradeById = async (id) => {
        try {

            const res = await axios.get(`http://localhost:7000/api/grade/${id}`)
            // if (res.status === 200) {
            //     console.log(res.data);
            // }
        } catch (e) {
            console.error(e)
        }
    }

    //******Grade - createGrade***** */
    const createGrade = async (nameRef, imageRef) => {
        const newGrade = {
            name: nameRef.current.value ? nameRef.current.value : " ",
            image: imageRef.current.value ? imageRef.current.value : " ",
        }
        try {
            const res = await axios.Grade('http://localhost:7000/api/grade', newGrade)
            if (res.status === 200) {

                // console.log("res.data", res.data);
                getGrades()
            }
        }
        catch (e) {
            console.error(e)
        }
    }


    //********useEffect
    useEffect(() => {
        getGrades()
    }, [])



    const itemTemplate = (grade, index) => {
        if (!grade) {
            return;
        }
        return <Grade grade={grade} getGrades={getGrades} setGradesData={setGradesData} />;
    };


    const listTemplate = (gradesData) => {
        return <div className="grid grid-nogutter">{gradesData.map((grade, index) => itemTemplate(grade, index))}</div>;
    };


    return (<>

        {/* if(maneger) */}
        <Button icon="pi pi-plus" rounded aria-label="Filter" onClick={() => setVisibleCreatGrade(true)} />
        <CreatGrade createGrade={createGrade} setVisibleCreatGrade={setVisibleCreatGrade} visibleCreatGrade={visibleCreatGrade} />

        <div className="card">
            <DataView value={gradesData} listTemplate={listTemplate}  />
        </div>

    </>)
}

export default Grades