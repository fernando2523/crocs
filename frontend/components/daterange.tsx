import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

function DateRange() {
    const [value, setValue]: any = useState({
        startDate: new Date(),
        endDate: new Date().setMonth(11)
    });

    const handleValueChange = (newValue: any) => {
        console.log("newValue:", newValue);
        setValue(newValue);
    }

    return (
        <div className="">
            <Datepicker
                primaryColor={"blue"}
                value={value}
                onChange={handleValueChange}
                showShortcuts={true}
                inputClassName="bg-white"
            />
        </div>
    );
}
export default DateRange;
