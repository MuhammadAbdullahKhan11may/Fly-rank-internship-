import { useRef, useState, type KeyboardEvent } from "react";

interface TabItem {
  id: string;
  label: string;
  content: string;
}

const tabs: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: "This is the student dashboard overview.",
  },
  {
    id: "projects",
    label: "Projects",
    content: "This section contains student projects.",
  },
  {
    id: "settings",
    label: "Settings",
    content: "This section contains dashboard settings.",
  },
];

export default function Tabs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    setFocusedIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      focusTab(nextIndex);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previousIndex = (index - 1 + tabs.length) % tabs.length;
      focusTab(previousIndex);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusTab(tabs.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedIndex(index);
    }
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label="Student dashboard sections">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={selectedIndex === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={focusedIndex === index ? 0 : -1}
            onFocus={() => setFocusedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              setFocusedIndex(index);
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={selectedIndex !== index}
          tabIndex={0}
        >
          <p>{tab.content}</p>
        </div>
      ))}
    </div>
  );
}