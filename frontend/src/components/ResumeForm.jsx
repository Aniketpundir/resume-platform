import React, { useState } from "react";

export default function ResumeForm({ initial = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initial.title || "");
  const [personal, setPersonal] = useState(initial.personal || { fullName: "" });
  const [education, setEducation] = useState(
    initial.education?.[0]?.school || ""
  );
  const [skills, setSkills] = useState(
    Array.isArray(initial.skills) ? initial.skills.join(", ") : ""
  );
  const [experience, setExperience] = useState(
    initial.experience?.[0]?.company || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Format data according to backend schema
    const formattedData = {
      title,
      personal,
      education: education
        ? [{ school: education, degree: "", from: "", to: "" }]
        : [],
      skills: skills
        ? skills.split(",").map((s) => s.trim())
        : [],
      experience: experience
        ? [{ company: experience, role: "", from: "", to: "", description: "" }]
        : [],
    };

    onSave(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Resume Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Full Name"
        value={personal.fullName}
        onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Education"
        value={education}
        onChange={(e) => setEducation(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
