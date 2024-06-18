import React, { useState } from "react";
import "./MultiTab.css";
import { Props } from "./MultiTabTypes";
import { useAppDispatch } from "../redux/hooks";
import { resetAuthError } from "../redux/slices/App/appSlice";

export const MultiTab: React.FC<Props> = ({ components, heading }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const dispatch = useAppDispatch();

  return (
    <div className="multitab">
      <div className="multitab__heading-container">
        <p className="multitab__heading">{heading}</p>
      </div>
      <div className="multitab__menu">
        {components.map((item, idx) => (
          <button
            type="button"
            className={`multitab__tab ${
              currentTab === idx ? "multitab__tab_active" : ""
            }`}
            key={idx}
            onClick={() => {
              dispatch(resetAuthError());
              setCurrentTab(idx);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="multitab__tab-contents">
        {components[currentTab].component({})}
      </div>
    </div>
  );
};
