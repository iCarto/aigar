import React, {useState} from "react";

import SideBar from "./SideBar";
import UserTable from "./UserTable";
import Calendar from "./Calendar";

import moment from "moment";

function MainPage() {
    const [date, setDate] = useState(moment());
    console.log("foo");
    return (
        <div className="row">
            <SideBar />
            <div className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <Calendar date={date} setDate={setDate} />
                <UserTable />
            </div>
        </div>
    );
}

export default MainPage;
