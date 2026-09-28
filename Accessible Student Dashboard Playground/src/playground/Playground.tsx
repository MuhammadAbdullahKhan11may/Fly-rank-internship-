import { useState } from "react";
import Modal from "./Modal";
import Tabs from "./Tabs";
import Disclosure from "./Disclosure";

export default function Playground() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="playground">
      <section>
        <h1>Accessible Student Dashboard Playground</h1>
        <p>
          A small React + TypeScript project demonstrating accessible
          interactive components.
        </p>
      </section>

      <section>
        <h2>Accessible Modal</h2>

        <button type="button" onClick={() => setIsModalOpen(true)}>
          Edit Profile
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Profile"
        >
          <label htmlFor="student-name">Name</label>

          <input
            id="student-name"
            type="text"
            defaultValue="Muhammad Abdullah Khan"
          />

          <label htmlFor="student-bio">Bio</label>

          <textarea
            id="student-bio"
            defaultValue="Computer Science student and full-stack developer."
          />
        </Modal>
      </section>

      <section>
        <h2>Dashboard Tabs</h2>
        <Tabs />
      </section>

      <section>
        <h2>Accessibility Information</h2>

        <Disclosure title="What accessibility features are included?">
          <p>
            This playground supports keyboard navigation, semantic ARIA
            attributes, focus management, and accessible interactive controls.
          </p>
        </Disclosure>
      </section>
    </main>
  );
}