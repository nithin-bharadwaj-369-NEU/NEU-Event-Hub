import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import successPayment from "../../assets-pack/successPayment/successPayment.jpeg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { createPaymentRecord } from "../../apiClient";
import { EventManagementState } from "../../contexts/context";

const SuccessPayment = () => {
  let navigate = useNavigate();
  let location = useLocation();
  location.state.event[0].numberOfTickets = location.state.numberOfSeats;
  const getRegisteredEvents = () => {
    navigate("/account");
  };
  const { state, dispatch } = EventManagementState();
  console.log("Current state in Success Payment : ", state);

  useEffect(() => {
    const paymentPayload = {
      paymentMethod: "Stripe",
      paymentDate: new Date(),
      amount: state.ticketPrice * state.numberOfSeats,
      quantity: state.numberOfSeats,
      event_id: state.eventID,
      user_id: state.user_id,
      paymentId: location.state.paymentId,
    };
    console.log("Payment Payload inside useEffect : ", paymentPayload);
    createPaymentRecord(paymentPayload)
      .then((response) => {
        console.log("Payment Payload response : ", response);
        axios
          .post("http://localhost:3000/stripe/addEventToUser", {
            username: state.username,
            event: state.event,
          })
          .then((response) =>
            axios
              .post("http://localhost:3000/stripe/decreaseEventCount", {
                eventID: state.eventID,
                ticketsCount: state.numberOfSeats,
              })
              .then((res) =>
                console.log("Responsesssdasdakndbsj,fnsakfansfgkjnfsa", res)
              )
          );
      })
      .catch((error) => console.error(error));
  }, [
    state.ticketPrice,
    state.numberOfSeats,
    state.eventID,
    state.user_id,
    location.state.paymentId,
    createPaymentRecord,
  ]);

  return (
    <div>
      <Navbar />
      <div className="my-5 pageHeightSet">
        <div className="container text-center">
          <img src={successPayment} alt="Success Payment" className="payment" />
          <br />
          <br />
          <button className="btn btn-primary" onClick={getRegisteredEvents}>
            Registered Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
