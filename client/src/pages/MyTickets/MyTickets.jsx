import React, { useEffect, useState } from "react";
import "./MyTickets.css";
import axios from "axios";
import { fetchSession, fetchUserInfo } from "../../apiClient";

export default function MyTickets() {
  const [events, setEvents] = useState([]);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const sessionResponse = await fetchSession();
      if (sessionResponse.data.success) {
        const userProfile = await fetchUserInfo(sessionResponse.data.user_id);
        const userID = userProfile.data[0]._id;

        const paymentsInfoResponse = await axios.post(
          "http://localhost:3000/stripe/getAllPaymentsInfo",
          { userID }
        );

        setUserID(userID);
        setEvents(paymentsInfoResponse.data.reverse());
      }
    }

    fetchData();
  }, []);

  console.log(events);
  console.log(userID);

  return (
    <div>
      <div>
        <div className="container">
          <div className="row">
            {events.filter((data)=>userID==data.user).map((data, key) => {
              return (
                <div
                  className="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-3"
                  key={key}>
                  <div class="card h-100 text-dark makeCard">
                    <div class="card-body">
                      <h5 class="card-title">Registered Events</h5>
                      <p class="card-text">
                        {data.event}
                      </p>
                      <ul class="list-group">
                        <li class="list-group-item"><b>Transaction:</b> {data.paymentId}</li>
                        <li class="list-group-item"><b>Amount:</b> {data.amount}</li>
                        <li class="list-group-item"><b>Payment Date:</b> {new Date(data.paymentDate).toDateString()}</li>
                        <li class="list-group-item"><b>Number of People:</b> {data.quantity}</li>
                      </ul>
                      <img
                        src="https://www.qrcode-monkey.com/img/sample.png"
                        alt="QR Code"
                        class="mt-3 mx-auto d-block"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
