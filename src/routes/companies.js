import React, { useState } from "react";
import { useCommunication } from "../context/data";
import "./companies.css";

function CompanyListPage() {
  const { state, updateCompany, deleteCompany } = useCommunication();

  const [editingCompany, setEditingCompany] = useState(null);

  const [companyForm, setCompanyForm] = useState({
    id: "",
    name: "",
    location: "",
    linkedinProfile: "",
    emails: [""],
    phoneNumbers: [""],
    comments: "",
    communicationPeriodicity: 14,
    communicationMethods: [],
  });

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...companyForm.emails];
    newEmails[index] = value;
    setCompanyForm((prev) => ({ ...prev, emails: newEmails }));
  };

  const handleAddEmail = () => {
    setCompanyForm((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handlePhoneChange = (index, value) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Limit the phone number to a length of 10 digits
    if (numericValue.length <= 10) {
      const newPhones = [...companyForm.phoneNumbers];
      newPhones[index] = numericValue;
      setCompanyForm((prev) => ({ ...prev, phoneNumbers: newPhones }));
    }
  };

  const renderPhoneValidationMessage = (index) => {
    const phone = companyForm.phoneNumbers[index];
    if (phone.length > 0 && phone.length !== 10) {
      return (
        <p className="validation-error">Phone number must be 10 digits long.</p>
      );
    }
    return null;
  };
  const isPhoneNumberValid = (phone) => {
    // Check if the phone number contains only digits and is exactly 10 digits long
    return /^[0-9]{10}$/.test(phone);
  };

  const handleAddPhone = () => {
    // Only allow adding phone number if the current phone numbers are valid
    if (companyForm.phoneNumbers.every(isPhoneNumberValid)) {
      setCompanyForm((prev) => ({
        ...prev,
        phoneNumbers: [...prev.phoneNumbers, ""],
      }));
    }
  };

  const isFormValid = () => {
    // Check if all phone numbers are valid (i.e., they are 10 digits and numeric)
    return companyForm.phoneNumbers.every(isPhoneNumberValid);
  };

  const startEditCompany = (company) => {
    setEditingCompany(company.id);
    setCompanyForm({ ...company });
  };

  const handleUpdateCompany = (e) => {
    e.preventDefault();
    updateCompany(companyForm);
    setEditingCompany(null);
  };

  const renderContactDetails = (company) => {
    return (
      <div className="contact-details">
        <div className="contact-section">
          <h4 className="black">Emails</h4>
          {company.emails && company.emails.length > 0 ? (
            <ul>
              {company.emails.map((email, index) => (
                <li key={index}>
                  <span className="email-icon">✉️</span> {email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No email addresses</p>
          )}
        </div>

        <div className="contact-section">
          <h4 className="black">Phone Numbers</h4>
          {company.phoneNumbers && company.phoneNumbers.length > 0 ? (
            <ul>
              {company.phoneNumbers.map((phone, index) => (
                <li key={index}>
                  <span className="phone-icon">📞</span> {phone}
                </li>
              ))}
            </ul>
          ) : (
            <p>No phone numbers</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="company-list-page">
      <h1>Companies Management</h1>

      {state.companies.map((company) => (
        <div key={company.id} className="company-card">
          {editingCompany === company.id ? (
            <form onSubmit={handleUpdateCompany} className="edit-company-form">
              <h4>Company Name</h4>
              <input
                type="text"
                name="name"
                value={companyForm.name}
                onChange={handleCompanyChange}
                placeholder="Company Name"
                required
              />

              <h4>Location</h4>
              <input
                type="text"
                name="location"
                value={companyForm.location}
                onChange={handleCompanyChange}
                placeholder="Location"
              />

              <h4>LinkedIn Profile</h4>
              <input
                type="url"
                name="linkedinProfile"
                value={companyForm.linkedinProfile}
                onChange={handleCompanyChange}
                placeholder="LinkedIn Profile"
              />

              <div className="email-management">
                <h4 className="black">Emails</h4>
                {companyForm.emails.map((email, index) => (
                  <div key={index} className="email-item">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="Email Address"
                    />
                    {companyForm.emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setCompanyForm((prev) => ({
                            ...prev,
                            emails: prev.emails.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddEmail}>
                  Add Email
                </button>
              </div>

              <div className="phone-management">
                <h4 className="black">Phone Numbers</h4>
                {companyForm.phoneNumbers.map((phone, index) => (
                  <div key={index} className="phone-item">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      placeholder="Phone Number"
                    />
                    {companyForm.phoneNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setCompanyForm((prev) => ({
                            ...prev,
                            phoneNumbers: prev.phoneNumbers.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                      >
                        Delete
                      </button>
                    )}
                    {renderPhoneValidationMessage(index)}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPhone}
                  disabled={!isFormValid()} // Disable the button if any phone number is invalid
                >
                  Add Phone
                </button>
              </div>

              <h4>Communication Frequency (days)</h4>
              <input
                type="number"
                name="communicationPeriodicity"
                value={companyForm.communicationPeriodicity}
                onChange={handleCompanyChange}
                placeholder="Communication Frequency (days)"
              />

              <h4>Additional Comments</h4>
              <textarea
                name="comments"
                value={companyForm.comments}
                onChange={handleCompanyChange}
                placeholder="Additional Comments"
              />

              <div className="form-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingCompany(null)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="company-details">
              <h2>{company.name}</h2>
              <p>Location: {company.location}</p>
              <p>LinkedIn: {company.linkedinProfile || "N/A"}</p>
              <p>
                Communication Frequency: {company.communicationPeriodicity} days
              </p>

              {renderContactDetails(company)}

              <div className="company-actions">
                <button onClick={() => startEditCompany(company)}>
                  Edit Company
                </button>
                <button onClick={() => deleteCompany(company.id)}>
                  Delete Company
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompanyListPage;
