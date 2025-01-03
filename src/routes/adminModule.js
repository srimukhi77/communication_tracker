import React, { useState, useEffect } from "react";
import { useCommunication } from "../context/data";
import "./adminModule.css";

function AdminModule() {
  const {
    state,
    addCompany,
    updateCompany,
    deleteCompany,
    updateCommunicationMethod,
    deleteCommunicationMethod,
    addCommunicationMethod,
  } = useCommunication();

  // Company Management State
  const [companyForm, setCompanyForm] = useState({
    id: "",
    name: "",
    location: "",
    linkedinProfile: "",
    emails: [""],
    phoneNumbers: [""],
    comments: "",
    communicationPeriodicity: 14,
  });

  const [phoneErrors, setPhoneErrors] = useState(""); // Error message for phone number validation
  const [isAddPhoneDisabled, setIsAddPhoneDisabled] = useState(false);
  // Communication Method Management State
  const [methodForm, setMethodForm] = useState({
    id: "",
    name: "",
    description: "",
    sequence: 0,
    isMandatory: false,
  });

  // Edit Mode States
  const [editingCompany, setEditingCompany] = useState(false);
  const [editingMethod, setEditingMethod] = useState(false);

  // Validate phone numbers
  const validatePhoneNumbers = () => {
    const phoneRegex = /^\d{10}$/;
    const newErrors = companyForm.phoneNumbers.map((phone) => {
      if (!phone) return "Phone number is required";
      if (!phoneRegex.test(phone))
        return "Phone number must be exactly 10 digits";
      return "";
    });

    setPhoneErrors(newErrors);
    setIsAddPhoneDisabled(newErrors.some((error) => error !== ""));
    return !newErrors.some((error) => error !== "");
  };

  useEffect(() => {
    const isFormValid =
      companyForm.name &&
      companyForm.location &&
      companyForm.emails.length > 0 &&
      companyForm.phoneNumbers.length > 0 &&
      validatePhoneNumbers();

    setIsAddCompanyDisabled(!isFormValid);
  }, [companyForm]);

  const [isAddCompanyDisabled, setIsAddCompanyDisabled] = useState(true);

  // Company Form Handlers
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
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");

    const newPhones = [...companyForm.phoneNumbers];
    newPhones[index] = digitsOnly;

    setCompanyForm((prev) => ({
      ...prev,
      phoneNumbers: newPhones,
    }));

    // Update validation for this specific phone number
    const newErrors = [...phoneErrors];
    if (!digitsOnly) {
      newErrors[index] = "Phone number is required";
    } else if (digitsOnly.length !== 10) {
      newErrors[index] = "Phone number must be exactly 10 digits";
    } else {
      newErrors[index] = "";
    }
    setPhoneErrors(newErrors);
  };

  const handleAddPhone = () => {
    // Only allow adding new phone if existing ones are valid
    if (!phoneErrors.some((error) => error !== "")) {
      setCompanyForm((prev) => ({
        ...prev,
        phoneNumbers: [...prev.phoneNumbers, ""],
      }));
      setPhoneErrors((prev) => [...prev, ""]);
    }
  };

  const handleAddNewCommunicationMethod = (e) => {
    e.preventDefault();
    if (!methodForm.name) {
      alert("Method name is required");
      return;
    }

    if (editingMethod) {
      updateCommunicationMethod({
        ...methodForm,
      });
      setEditingMethod(false);
    } else {
      addCommunicationMethod({
        name: methodForm.name,
        description: methodForm.description,
        sequence: methodForm.sequence || state.communicationMethods.length + 1,
        isMandatory: methodForm.isMandatory,
      });
    }

    setMethodForm({
      id: "",
      name: "",
      description: "",
      sequence: 0,
      isMandatory: false,
    });
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (editingCompany) {
      updateCompany(companyForm);
      setEditingCompany(false);
    } else {
      addCompany(companyForm);
    }

    setCompanyForm({
      id: "",
      name: "",
      location: "",
      linkedinProfile: "",
      emails: [""],
      phoneNumbers: [""],
      comments: "",
      communicationPeriodicity: 14,
    });
  };

  // Edit Company
  const startEditCompany = (company) => {
    setCompanyForm(company);
    setEditingCompany(true);
  };

  // Communication Method Form Handlers
  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Edit Communication Method
  const startEditMethod = (method) => {
    setMethodForm(method);
    setEditingMethod(true);
  };

  return (
    <div className="admin-module">
      <h1>Admin Module</h1>

      <section className="company-management">
        <h2>{editingCompany ? "Edit Company" : "Add Company"}</h2>
        <form onSubmit={handleAddCompany}>
          <h4>Company Name</h4>
          <input
            type="text"
            name="name"
            value={companyForm.name}
            onChange={handleCompanyChange}
            required
          />

          <h4>Location</h4>
          <input
            type="text"
            name="location"
            value={companyForm.location}
            onChange={handleCompanyChange}
          />

          <h4>LinkedIn Profile</h4>
          <input
            type="url"
            name="linkedinProfile"
            value={companyForm.linkedinProfile}
            onChange={handleCompanyChange}
          />

          {/* Email Management */}
          <div className="email-management">
            <h4 className="black">Emails</h4>
            {companyForm.emails.map((email, index) => (
              <div key={index} className="email-item">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  required={companyForm.emails.length === 1}
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

          {/* Phone Number Management */}
          <div className="phone-management">
            <h4 className="black">Phone Numbers</h4>
            {companyForm.phoneNumbers.map((phone, index) => (
              <div key={index} className="phone-item">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  required={companyForm.phoneNumbers.length === 1}
                  maxLength={10}
                  placeholder="Enter Phone Number"
                />
                {phoneErrors[index] && (
                  <p className="error-message">{phoneErrors[index]}</p>
                )}
                {companyForm.phoneNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyForm((prev) => ({
                        ...prev,
                        phoneNumbers: prev.phoneNumbers.filter(
                          (_, i) => i !== index
                        ),
                      }));
                      setPhoneErrors((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPhone}
              disabled={isAddPhoneDisabled}
            >
              Add Phone
            </button>
          </div>

          <h4>Communication Frequency (days)</h4>
          <input
            type="number"
            name="communicationPeriodicity"
            value={
              companyForm.communicationPeriodicity === 14
                ? ""
                : companyForm.communicationPeriodicity
            }
            onChange={(e) =>
              setCompanyForm((prev) => ({
                ...prev,
                communicationPeriodicity: e.target.value
                  ? parseInt(e.target.value, 10)
                  : 14,
              }))
            }
          />

          <h4>Additional Comments</h4>
          <textarea
            name="comments"
            value={companyForm.comments}
            onChange={handleCompanyChange}
          />
          <button type="submit" disabled={isAddCompanyDisabled}>
            {editingCompany ? "Update Company" : "Add Company"}
          </button>
          {editingCompany && (
            <button type="button" onClick={() => setEditingCompany(false)}>
              Cancel
            </button>
          )}
        </form>

        <div className="company-list">
          <h3>Existing Companies</h3>
          {state.companies.map((company) => (
            <div key={company.id} className="company-item">
              {company.name} - {company.location}
              <div className="company-actions">
                <button onClick={() => startEditCompany(company)}>Edit</button>
                <button onClick={() => deleteCompany(company.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="communication-method-management">
        <h2>
          {editingMethod
            ? "Edit Communication Method"
            : "Add Communication Method"}
        </h2>
        <form onSubmit={handleAddNewCommunicationMethod}>
          <h4>Method Name</h4>
          <input
            type="text"
            name="name"
            value={methodForm.name}
            onChange={handleMethodChange}
            required
          />

          <h4>Description</h4>
          <input
            type="text"
            name="description"
            value={methodForm.description}
            onChange={handleMethodChange}
          />

          <h4>Sequence Order</h4>
          <input
            type="number"
            name="sequence"
            value={methodForm.sequence === 0 ? "" : methodForm.sequence}
            onChange={(e) =>
              setMethodForm((prev) => ({
                ...prev,
                sequence: e.target.value ? parseInt(e.target.value, 10) : 0,
              }))
            }
          />

          <label>
            <input
              type="checkbox"
              name="isMandatory"
              checked={methodForm.isMandatory}
              onChange={handleMethodChange}
            />
            Mandatory Method
          </label>
          <button type="submit">
            {editingMethod ? "Update Method" : "Add Method"}
          </button>
          {editingMethod && (
            <button type="button" onClick={() => setEditingMethod(false)}>
              Cancel
            </button>
          )}
        </form>

        <div className="communication-methods-list">
          <h3>Existing Communication Methods</h3>
          {state.communicationMethods.map((method) => (
            <div key={method.id} className="method-item">
              {method.name} - {method.description}
              (Sequence: {method.sequence},
              {method.isMandatory ? "Mandatory" : "Optional"})
              <div className="method-actions">
                <button onClick={() => startEditMethod(method)}>Edit</button>
                <button onClick={() => deleteCommunicationMethod(method.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminModule;
