"use client";
import { InitialSurveyState } from "@constants/survey.data.constant";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "@utils/localStorage";
// context/SurveyContext.tsx
import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import {
  surveyReducer,
  SurveyState,
  Action,
} from "reducer/serviceReducer";
// import {
//   surveyReducer,
//   initialState,
//   SurveyState,
//   Action,
// } from "reducers/surveyReducer";

interface SurveyContextProps {
  state: SurveyState;
  dispatch: React.Dispatch<Action>;
}

const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);

const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    surveyReducer,
    InitialSurveyState,
    (initial) => {
      // Load state from localStorage or fallback to initial state
      const persisted = getLocalStorageValue("surveyData");
      return persisted ? JSON.parse(persisted) : initial;
    }
  );

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem("surveyData", JSON.stringify(state));
  }, [state]);

  return (
    <SurveyContext.Provider value={{ state, dispatch }}>
      {children}
    </SurveyContext.Provider>
  );
};

const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  }
  return context;
};

export { SurveyProvider, useSurveyContext };
