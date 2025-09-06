import React, { useState } from "react";

export default function ResumeForm({ onSave, initial = {}, onCancel }) {
  const [title, setTitle] = useState(initial.title || "");
  const [fullName, setFullName] = useState(initial.personal?.fullName || "");
  const [email, setEmail] = useState(initial.personal?.email || "");
  const [phone, setPhone] = useState(initial.personal?.phone || "");
  const [summary, setSummary] = useState(initial.personal?.summary || "");
  const [skills, setSkills] = useState((initial.skills || []).join(", "));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      personal: { fullName, email, phone, summary },
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    onSave(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-gray-700 font-medium">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Full Name</span>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Phone</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Summary</span>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-400"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Skills (comma separated)</span>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
        />
      </label>

      <div className="flex gap-3">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          type="submit"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
