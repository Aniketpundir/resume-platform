import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeForm from "./ResumeForm";

export default function Dashboard({ token, user, api }) {
  const [resumes, setResumes] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    const r = await axios.get(api + "/resume", {
      headers: { Authorization: "Bearer " + token },
    });
    setResumes(r.data);
  };

  useEffect(() => {
    if (token) fetch();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 p-6">
      {/* Header */}
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
                <div>
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2 transition"
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
    </div>
  );
}
