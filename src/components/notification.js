import React, { useMemo, useState } from "react";
import { useCommunication } from "../context/data";
import "./notification.css";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  const { getOverdueCommunications } = useCommunication();

  const getOverdueTodayCommunications = () => {
    // New function to get communications due today
    return getOverdueCommunications().filter((company) => {
      const today = new Date();
      const lastCom = new Date(company.lastCommunicationDate);
      const daysSinceLastCom = Math.floor(
        (today - lastCom) / (1000 * 60 * 60 * 24)
      );
      const commPeriod = company.communicationPeriodicity || 14;

      return daysSinceLastCom == commPeriod;
    });
  };

  return (
    <section className="notifications">
      <h2>Notifications</h2>

      <div className="overdue-today-communications">
        <h3>Overdue Today</h3>
        {getOverdueTodayCommunications().map((company) => (
          <div key={company.id} className="overdue-item">
            {company.name} - Communication Due Today
          </div>
        ))}
      </div>

      <div className="overdue-communications">
        <h3>Overdue Communications</h3>
        {getOverdueCommunications().map((company) => (
          <div key={company.id} className="overdue-item">
            {company.name} - Overdue
          </div>
        ))}
      </div>

      <Link to={`/`} className="action-link">
        Follow Up
      </Link>
    </section>
  );
};

export default NotificationsPage;
