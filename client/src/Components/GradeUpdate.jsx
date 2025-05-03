
import React, { useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { AutoComplete } from "primereact/autocomplete";




const UpdateGrade = (props) => {
    const [selectedItem, setSelectedItem] = useState(null);
     const items = ['first grade','second grade','third grade','fourth grade','fifth grade','sixth grade','seventh grade','eighth grade'];

    const [filteredItems, setFilteredItems] = useState(null);

    const { updateGrade } = props
    const { visible } = props


    const nameRef = useRef("")
    const imageRef = useRef("")


    const searchItems = (event) => {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo purposes we filter at client side
        // let query = event.query;
        // let _filteredItems = [];

        setFilteredItems(items);
    }



    return (

        // <Dialog
        //     visible={visible}
        //     modal
        //     header="Update Grade"
        //     onHide={() => { if (!visible) return; props.setVisible(false); }}
        //     content={({ hide }) => (
        //         <div className="flex flex-column gap-3" style={{ minWidth: '300px' }}>
        //             <div className="inline-flex flex-column gap-2">
        //             <label className="font-medium">Name</label>
        //                 <AutoComplete value={selectedItem} suggestions={filteredItems} completeMethod={searchItems}
        //                     virtualScrollerOptions={{ itemSize: 38 }}  dropdown onChange={(e) => setSelectedItem(e.value)} />
        //             </div>
        //             <div className="inline-flex flex-column gap-2">
        //             <label className="font-medium">Image</label>
        //             //     <InputText ref={imageRef} />
        //                 <InputText id="name" label="name" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="name" ref={imageRef} defaultValue={props.grade.image}></InputText>
        //             </div>
        //             <div className="flex align-items-center gap-2">
        //                 <Button label="Update" onClick={(e) => { updateGrade(selectedItem, imageRef); hide(e) }} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
        //                 <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
        //             </div>
        //         </div>
        //     )}
        // ></Dialog>
        <Dialog
        visible={visible}
        modal
        header="Update Grade"
        style={{ width: '400px', borderRadius: '8px' }}
        onHide={() => props.setVisible(false)}
    >
        <div className="flex flex-column gap-4" style={{ padding: '1rem' }}>
            {/* Name Field */}
            <div className="flex flex-column gap-2">
                <label htmlFor="name" className="font-medium">Name</label>
                <AutoComplete
                    id="name"
                    value={selectedItem}
                    suggestions={filteredItems}
                    completeMethod={searchItems}
                    dropdown
                    onChange={(e) => setSelectedItem(e.value)}
                    placeholder="Select grade"
                    className="p-inputtext-sm"
                />
            </div>

            {/* Image Field */}
            <div className="flex flex-column gap-2">
                <label htmlFor="image" className="font-medium">Image</label>
                <InputText
                    id="image"
                    ref={imageRef}
                    defaultValue={props.grade?.image}
                    placeholder="Enter image URL"
                    className="p-inputtext-sm"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-content-center gap-2">
                <Button
                    label="Update"
                    onClick={() => {
                        updateGrade(selectedItem, imageRef);
                       props.setVisible(false);
                    }}
                    className="p-button p-button-primary"
                />
                <Button
                    label="Cancel"
                    onClick={() => props.setVisible(false)}
                    className="p-button p-button-secondary"
                />
            </div>
        </div>
    </Dialog>
     )
}
export default UpdateGrade