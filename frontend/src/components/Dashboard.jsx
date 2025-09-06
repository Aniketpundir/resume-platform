import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import ResumeForm from "./ResumeForm";

export default function Dashboard({ token, user, api }) {
  const [resumes, setResumes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetch = async () => {
    const r = await axios.get(api + "/resume", {
      headers: { Authorization: "Bearer " + token },
    });
    setResumes(r.data);
  };

  useEffect(() => {
    if (token) fetch();
  }, [token]);

  const handleCreate = async (data) => {
    await axios.post(api + "/resume", data, {
      headers: { Authorization: "Bearer " + token },
    });
    fetch();
  };

  const handleUpdate = async (id, data) => {
    await axios.put(api + "/resume/" + id, data, {
      headers: { Authorization: "Bearer " + token },
    });
    setEditing(null);
    fetch();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete resume?")) return;
    await axios.delete(api + "/resume/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
    fetch();
  };

  const handleDownload = (resume) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(resume.title || "Resume", 10, 20);
    doc.setFontSize(12);

    doc.text(`Name: ${resume.personal?.fullName || ""}`, 10, 30);

    // Education
    if (resume.education?.length > 0) {
      doc.text("Education:", 10, 40);
      resume.education.forEach((edu, i) => {
        doc.text(
          `- ${edu.school} (${edu.degree}) ${edu.from} - ${edu.to}`,
          15,
          50 + i * 10
        );
      });
    }

    // Skills
    if (resume.skills?.length > 0) {
      doc.text("Skills: " + resume.skills.join(", "), 10, 80);
    }

    // Experience
    if (resume.experience?.length > 0) {
      doc.text("Experience:", 10, 100);
      resume.experience.forEach((exp, i) => {
        doc.text(
          `- ${exp.company}, ${exp.role} (${exp.from} - ${exp.to})`,
          15,
          110 + i * 10
        );
        if (exp.description) {
          doc.text(`  ${exp.description}`, 20, 115 + i * 10);
        }
      });
    }

    doc.save(`${resume.title || "resume"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">🎓 Dashboard</h1>
        <div>
          <span className="mr-3 font-medium text-gray-700">
            {user?.name || user?.email}
          </span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
            onClick={() => {
              localStorage.removeItem("token");
              location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ➕ Create Resume
          </h2>
          <ResumeForm onSave={handleCreate} />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-purple-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📑 Your Resumes
          </h2>
          {resumes.length === 0 && (
            <div className="text-gray-500">No resumes yet. Create one!</div>
          )}
          <ul>
            {resumes.map((r) => (
              <li
                key={r._id}
                className="border rounded-lg p-3 mb-3 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <strong className="text-lg text-gray-800">{r.title}</strong>
                  <div className="text-sm text-gray-500">
                    {r.personal?.fullName || ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                    onClick={() => setPreview(r)}
                  >
                    View
                  </button>
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition"
                    onClick={() => handleDownload(r)}
                  >
                    Download
                  </button>
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
                    onClick={() => setEditing(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Resume Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              ✏️ Edit Resume
            </h3>
            <ResumeForm
              initial={editing}
              onSave={(data) => handleUpdate(editing._id, data)}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {/* Preview Resume Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <h3 className="text-xl font-bold mb-4">{preview.title}</h3>
            <p>
              <strong>Name:</strong> {preview.personal?.fullName}
            </p>

            <p>
              <strong>Education:</strong>
            </p>
            {preview.education && preview.education.length > 0 ? (
              preview.education.map((edu, i) => (
                <div key={i} className="ml-4 text-sm text-gray-600">
                  {edu.school} ({edu.degree}) {edu.from} - {edu.to}
                </div>
              ))
            ) : (
              <div className="ml-4 text-sm text-gray-500">
                No education details
              </div>
            )}

            <p>
              <strong>Skills:</strong>{" "}
              {Array.isArray(preview.skills)
                ? preview.skills.join(", ")
                : preview.skills}
            </p>

            <p>
              <strong>Experience:</strong>
            </p>
            {preview.experience && preview.experience.length > 0 ? (
              preview.experience.map((exp, i) => (
                <div key={i} className="ml-4 text-sm text-gray-600">
                  {exp.company} - {exp.role} ({exp.from} to {exp.to})
                  <br />
                  <em>{exp.description}</em>
                </div>
              ))
            ) : (
              <div className="ml-4 text-sm text-gray-500">
                No experience details
              </div>
            )}

            <button
              onClick={() => setPreview(null)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
