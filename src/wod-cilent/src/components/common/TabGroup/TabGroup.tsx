import React, { useState, useMemo } from "react";
import { UniversalProps } from "../types/universal";
import Tab from "./Tab";
import "./TabGroup.css";
import classNames from "classnames";

interface TabMeta extends UniversalProps {
  key: string;
  name: string;
  disabled?: boolean;
}

interface TabContentMap {
  [key: string]: React.ReactNode;
}

export interface TabGroupProps extends UniversalProps {
  tabs: TabMeta[];
  content: TabContentMap;
  initialTabKey?: string;
}

const TabGroup: React.FC<TabGroupProps> = ({ id, tabs, content, initialTabKey }) => {
  const initialActiveTabKey = initialTabKey || tabs[0].key;
  const [activeTabKey, setActiveTabKey] = useState<string>(initialActiveTabKey);

  const updateTab = (key: string) => {
    setActiveTabKey(key);
  };

  const activeTabContent = useMemo(() => content[activeTabKey], [content, activeTabKey]);

  return (
    <div className="tabgroup" id={id}>
      <div className="tabgroup_tab-selection">
        {tabs.map((tab) => (
          <Tab
            id={tab.id}
            key={`tab-${tab.key}`}
            labelText={tab.name}
            isActive={activeTabKey === tab.key}
            onClick={() => updateTab(tab.key)}
            disabled={tab.disabled}
          />
        ))}
      </div>

      <div className="tabgroup_content">{activeTabContent}</div>
    </div>
  );
};

export default TabGroup;