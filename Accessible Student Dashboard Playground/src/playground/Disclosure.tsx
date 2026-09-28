import { useId, useState, type ReactNode } from "react";

interface DisclosureProps {
  title: string;
  children: ReactNode;
}

export default function Disclosure({
  title,
  children,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="disclosure">
      <button
        type="button"
        className="disclosure-button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span aria-hidden="true">{isOpen ? "▼" : "▶"}</span>
        {title}
      </button>

      <div id={contentId} hidden={!isOpen} className="disclosure-content">
        {children}
      </div>
    </div>
  );
}