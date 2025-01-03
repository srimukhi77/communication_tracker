import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Initial Communication Methods
const DEFAULT_COMMUNICATION_METHODS = [
  {
    id: uuidv4(),
    name: "LinkedIn Post",
    description: "Post on LinkedIn",
    sequence: 1,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "LinkedIn Message",
    description: "Send a direct message on LinkedIn",
    sequence: 2,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "Email",
    description: "Send an email",
    sequence: 3,
    isMandatory: true,
  },
  {
    id: uuidv4(),
    name: "Phone Call",
    description: "Make a phone call",
    sequence: 4,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "Other",
    description: "Other communication method",
    sequence: 5,
    isMandatory: false,
  },
];

// Initial State
const initialState = {
  companies: [
    {
      id: "832ac9e4-1b47-4577-80b6-a124f8bb64ec",
      name: "Amazon",
      comments: "Follow up in the next meeting.",
      location: "USA",
      communicationPeriodicity: 7,
      createdAt: new Date("2024-12-05T10:20:15+05:30"),
      lastCommunicationDate: new Date("2024-12-01T05:30:00+05:30"),
      lastCommunicationSequence: 3,
      emails: ["contact@amazon.com"],
      phoneNumbers: ["9876543210"],
      linkedinProfile: "https://linkedin.com/company/amazon",
    },
    {
      id: "a94b37e2-1f26-44d8-947c-57eafce7e564",
      name: "Google",
      comments: "Schedule a discussion on upcoming projects.",
      location: "India",
      communicationPeriodicity: 10,
      createdAt: new Date("2024-12-04T14:35:25+05:30"),
      lastCommunicationDate: new Date("2024-12-02T05:30:00+05:30"),
      lastCommunicationSequence: 2,
      emails: ["info@google.com"],
      phoneNumbers: ["9123456789"],
      linkedinProfile: "https://linkedin.com/company/google",
    },
  ],
  communicationMethods: DEFAULT_COMMUNICATION_METHODS,
  communications: [
    {
      id: "09586a1a-db14-4185-b80d-289dfc4b7377",
      companyId: "55031a64-3964-489b-aca4-5022663ac3db",
      type: "LinkedIn Post",
      date: new Date("2024-12-02"),
      timestamp: new Date("2024-12-02T05:30:00+05:30"),
      createdAt: new Date("2024-12-03T19:58:07+05:30"),
      notes: "visit",
      sequence: 2,
    },
    {
      id: "41a2a0da-3db5-4ce5-9e31-3fd9b7d17fb9",
      companyId: "019a0f37-7f0e-41c8-8bbe-02a4b26bcea2",
      type: "LinkedIn Post",
      date: new Date("2024-11-29"),
      timestamp: new Date("2024-11-29T05:30:00+05:30"),
      createdAt: new Date("2024-12-03T20:01:50+05:30"),
      notes: "good",
      sequence: 2,
    },
  ],
};

// Action Types
const ADD_COMMUNICATION = "ADD_COMMUNICATION";

const ADD_COMPANY = "ADD_COMPANY";
const UPDATE_COMPANY = "UPDATE_COMPANY";
const DELETE_COMPANY = "DELETE_COMPANY";
const UPDATE_COMMUNICATION_METHOD = "UPDATE_COMMUNICATION_METHOD";
const DELETE_COMMUNICATION_METHOD = "DELETE_COMMUNICATION_METHOD";
const ADD_COMMUNICATION_METHOD = "ADD_COMMUNICATION_METHOD";

// Reducer
function communicationReducer(state, action) {
  switch (action.type) {
    case ADD_COMPANY:
      return {
        ...state,
        companies: [
          ...state.companies,
          {
            ...action.payload,
            id: uuidv4(),
            createdAt: new Date(),
            lastCommunicationDate: new Date(),
            lastCommunicationSequence: 0,
          },
        ],
      };
    case UPDATE_COMPANY:
      return {
        ...state,
        companies: state.companies.map((company) =>
          company.id === action.payload.id
            ? { ...company, ...action.payload }
            : company
        ),
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(
          (company) => company.id !== action.payload
        ),
      };
    case UPDATE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.map((method) =>
          method.id === action.payload.id
            ? { ...method, ...action.payload }
            : method
        ),
      };
    case DELETE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.filter(
          (method) => method.id !== action.payload
        ),
      };

    case ADD_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: [
          ...state.communicationMethods,
          {
            ...action.payload,
            id: action.payload.id || uuidv4(),
          },
        ],
      };

    case ADD_COMMUNICATION:
      const sortedMethods = state.communicationMethods.sort(
        (a, b) => a.sequence - b.sequence
      );
      const currentCompany = state.companies.find(
        (c) => c.id === action.payload.companyId
      );

      const nextMethodSequence =
        currentCompany.lastCommunicationSequence === sortedMethods.length
          ? currentCompany.lastCommunicationSequence
          : currentCompany.lastCommunicationSequence + 1;

      return {
        ...state,
        communications: [
          ...state.communications,
          {
            ...action.payload,
            id: uuidv4(),
            createdAt: new Date(),
            sequence: nextMethodSequence,
          },
        ],
        companies: state.companies.map((company) =>
          company.id === action.payload.companyId
            ? {
                ...company,
                lastCommunicationDate: action.payload.timestamp,
                lastCommunicationSequence: nextMethodSequence,
              }
            : company
        ),
      };

    default:
      return state;
  }
}

// Context Creation
const CommunicationContext = createContext();

// Provider Component
export function CommunicationProvider({ children }) {
  const [state, dispatch] = useReducer(communicationReducer, initialState);

  // Action Creators
  const addCompany = useCallback((company) => {
    dispatch({
      type: ADD_COMPANY,
      payload: {
        ...company,
        emails: company.emails || [""],
        phoneNumbers: company.phoneNumbers || [""],
        communicationPeriodicity: company.communicationPeriodicity || 14,
      },
    });
  }, []);

  const addCommunication = useCallback((communicationData) => {
    dispatch({
      type: ADD_COMMUNICATION,
      payload: communicationData,
    });
  }, []);

  const getLastFiveCommunications = useCallback(
    (companyId) => {
      return state.communications
        .filter((comm) => comm.companyId === companyId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    },
    [state.communications]
  );

  const getNextScheduledCommunication = useCallback(
    (companyId) => {
      const company = state.companies.find((c) => c.id === companyId);
      if (!company) return null;

      const sortedMethods = state.communicationMethods.sort(
        (a, b) => a.sequence - b.sequence
      );
      const currentSequence = company.lastCommunicationSequence || 1;
      const nextMethod =
        sortedMethods.find((m) => m.sequence > currentSequence) ||
        sortedMethods[sortedMethods.length - 1];

      const lastCommunication = new Date(
        company.lastCommunicationDate || new Date(0)
      );

      const nextCommunicationDate = new Date(
        lastCommunication.getTime() +
          (company.communicationPeriodicity || 14) * 24 * 60 * 60 * 1000
      );

      return {
        date: nextCommunicationDate,
        type: nextMethod.name,
        sequence: nextMethod.sequence,
      };
    },
    [state.companies, state.communicationMethods]
  );

  const getOverdueCommunications = useCallback(() => {
    const today = new Date();
    return state.companies.filter((company) => {
      if (!company.lastCommunicationDate) return true;
      const daysSinceLastCom =
        (today.getTime() - new Date(company.lastCommunicationDate).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceLastCom > (company.communicationPeriodicity || 14);
    });
  }, [state.companies]);

  const getAllCommunicationsForCompany = useCallback(
    (companyId) => {
      return state.communications
        .filter((comm) => comm.companyId === companyId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    [state.communications]
  );

  const updateCompany = useCallback((company) => {
    dispatch({ type: UPDATE_COMPANY, payload: company });
  }, []);

  const deleteCompany = useCallback((companyId) => {
    dispatch({ type: DELETE_COMPANY, payload: companyId });
  }, []);

  const addCommunicationMethod = useCallback(
    (method) => {
      dispatch({
        type: ADD_COMMUNICATION_METHOD,
        payload: {
          ...method,
          id: method.id || `method_${Date.now()}`,
          sequence: method.sequence || state.communicationMethods.length + 1,
        },
      });
    },
    [state.communicationMethods]
  );

  // Communication Method Actions
  const updateCommunicationMethod = useCallback((method) => {
    dispatch({ type: UPDATE_COMMUNICATION_METHOD, payload: method });
  }, []);

  const deleteCommunicationMethod = useCallback((methodId) => {
    dispatch({ type: DELETE_COMMUNICATION_METHOD, payload: methodId });
  }, []);

  // Helper Functions
  const getCompanyById = useCallback(
    (id) => {
      return state.companies.find((company) => company.id === id);
    },
    [state.companies]
  );

  const overdueCommunicationsCount = useMemo(() => {
    return state.companies.filter((company) => {
      if (!company.lastCommunicationDate) return true;
      const today = new Date();
      const daysSinceLastCom =
        (today.getTime() - new Date(company.lastCommunicationDate).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceLastCom > (company.communicationPeriodicity || 14);
    }).length;
  }, [state.companies]);

  return (
    <CommunicationContext.Provider
      value={{
        state,
        addCommunication,
        getLastFiveCommunications,
        getNextScheduledCommunication,
        getAllCommunicationsForCompany,
        addCompany,
        updateCompany,
        deleteCompany,
        addCommunicationMethod,
        updateCommunicationMethod,
        deleteCommunicationMethod,
        getCompanyById,
        getOverdueCommunications,
        overdueCommunicationsCount,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

// Custom Hook
export function useCommunication() {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error(
      "useCommunication must be used within a CommunicationProvider"
    );
  }
  return context;
}
