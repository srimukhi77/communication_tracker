import React, { useState } from "react";
import { useCommunication } from "../context/data";
import "./userDashboard.css";

const UserDashboard = () => {
  const {
    state,
    addCommunication,
    getLastFiveCommunications,
    getNextScheduledCommunication,
  } = useCommunication();

  console.log(state);

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [communicationModal, setCommunicationModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [communicationForm, setCommunicationForm] = useState({
    type: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);

    const addOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return day + "th";
      switch (day % 10) {
        case 1:
          return day + "st";
        case 2:
          return day + "nd";
        case 3:
          return day + "rd";
        default:
          return day + "th";
      }
    };

    // Split the formatted date
    const [month, day, year] = formattedDate.split(" ");

    return `${addOrdinalSuffix(parseInt(day))} ${month}, ${year}`;
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleCommunicationLog = (e) => {
    e.preventDefault();
    selectedCompanies.forEach((companyId) => {
      addCommunication({
        ...communicationForm,
        companyId,
        timestamp: new Date(communicationForm.date),
      });
    });
    setCommunicationModal(false);
    setSelectedCompanies([]);
  };

  const getCompanyStatus = (company) => {
    const today = new Date();
    const lastCom = new Date(company.lastCommunicationDate);
    const daysSinceLastCom = Math.floor(
      (today - lastCom) / (1000 * 60 * 60 * 24)
    );
    const commPeriod = company.communicationPeriodicity || 14;

    console.log(daysSinceLastCom, commPeriod);

    if (daysSinceLastCom > commPeriod) return "overdue";
    if (daysSinceLastCom == commPeriod) return "due-today";
    return "normal";
  };

  const renderCommunicationTooltip = (communication) => {
    return (
      <div className="communication-tooltip">
        <p>Type: {communication.type}</p>
        <p>Date: {new Date(communication.timestamp).toLocaleDateString()}</p>
        <p>Notes: {communication.notes || "No notes"}</p>
        <p>Sequence: {communication.sequence}</p>
      </div>
    );
  };

  return (
    <div className="user-dashboard">
      <h1>Communication Dashboard</h1>

      <section className="companies-grid">
        {state.companies.map((company) => {
          const lastFiveCommunications = getLastFiveCommunications(company.id);
          const nextScheduledCommunication = getNextScheduledCommunication(
            company.id
          );

          return (
            <div
              key={company.id}
              className={`company-row ${getCompanyStatus(company)}`}
            >
              <input
                type="checkbox"
                checked={selectedCompanies.includes(company.id)}
                onChange={() => handleCompanySelect(company.id)}
              />
              <h3>{company.name}</h3>

              <div className="last-communications">
                <h4>Recent Communications</h4>
                {lastFiveCommunications.map((comm) => (
                  <div
                    key={comm.id}
                    className="communication-item"
                    onMouseEnter={() => setSelectedCommunication(comm)}
                    onMouseLeave={() => setSelectedCommunication(null)}
                  >
                    {comm.type} - {formatDate(comm.timestamp)}
                    {selectedCommunication === comm &&
                      renderCommunicationTooltip(comm)}
                  </div>
                ))}
              </div>

              <div className="next-communication">
                <h4>Next Scheduled Communication</h4>
                {nextScheduledCommunication ? (
                  <div>
                    {nextScheduledCommunication.type} -
                    {formatDate(nextScheduledCommunication.date)}
                  </div>
                ) : (
                  <div>No scheduled communication</div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <button
        onClick={() => setCommunicationModal(true)}
        disabled={selectedCompanies.length === 0}
        className="logComm"
      >
        Log Communication
      </button>

      {communicationModal && (
        <div className="communication-modal">
          <form onSubmit={handleCommunicationLog}>
            <select
              value={communicationForm.type}
              onChange={(e) =>
                setCommunicationForm((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
              required
            >
              <option value="">Select Communication Type</option>
              {state.communicationMethods.map((method) => (
                <option key={method.id} value={method.name}>
                  {method.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={communicationForm.date}
              onChange={(e) =>
                setCommunicationForm((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              required
            />
            <textarea
              placeholder="Communication Notes"
              value={communicationForm.notes}
              onChange={(e) =>
                setCommunicationForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
            <button type="submit" className="logComm">
              Log Communication
            </button>
            <button type="button" onClick={() => setCommunicationModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
