import { useState, useEffect, useCallback } from "react";
import { BiCalendar } from "react-icons/bi";
import { Search } from "./components/Search";
import "./styles/App.css";
import { AddAppointment } from "./components/AddAppointment";
import { AppointmentInfo } from "./components/AppointmentInfo";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("ownerName");
  const [orderBy, setOrderBy] = useState(1);

  const filteredAppointments = appointmentList
    .filter((item) => item[sortBy].toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      orderBy === 1
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy])
    );

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then(setAppointmentList);
  }, []);

  // const fetchData = async() => {
  //     const response = await fetch('./data.json')
  //     const data = await response.json()
  //     setAppointmentList(data)
  // }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDeleteAppointment = (appointmentId) => {
    setAppointmentList(
      appointmentList.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-5">
        <BiCalendar className="inline-block text-red-400 align-top" /> Your
        Appoiment
      </h1>
      <AddAppointment
        onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
        lastId={appointmentList.reduce((max,item)=> Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search
        query={query}
        onQueryChange={(value) => setQuery(value)}
        orderBy={orderBy}
        onOrderByChange={(myOrder) => setOrderBy(myOrder)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            key={Number(appointment.id)}
            appointment={appointment}
            onDeleteAppointment={onDeleteAppointment}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
