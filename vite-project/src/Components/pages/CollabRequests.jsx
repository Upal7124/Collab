import React, { useEffect, useState } from "react";
console.log("User from localStorage:", localStorage.getItem("user"));

export default function CollabRequests({ onPageChange }) {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.id) {
    setLoading(false);
    return;
  }

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/collab-requests/${storedUser.id}`
      );

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, []);

  const handleAction = async (requestId, action) => {
  try {
    setActionLoading(requestId);

    const res = await fetch(
      `http://localhost:5000/collab-request/${action}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId })
      }
    );

    const data = await res.json();

    if (!data.success) {
      console.error("Action failed");
      return;
    }

    if (action === "accept") {
      onPageChange("schedule", { requestId });
      return;
    }

    // ✅ If rejected → remove from UI
    if (action === "reject") {
      setRequests(prev =>
        prev.filter(r => r.requestId !== requestId)
      );
    }

  } catch (err) {
    console.error("Request action failed:", err);
  } finally {
    setActionLoading(null);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-yellow-600">
        Loading collaboration requests...
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <p className="text-2xl font-bold mb-2">No Requests Yet</p>
          <p className="text-gray-600">
            When someone sends you a collab request, it will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] pt-24 px-6">
      <h1 className="text-3xl font-extrabold text-center mb-10 text-gray-800">
        Collaboration Requests
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {requests.map(req => (
          <div
            key={req.requestId}
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  req.profile_pic
                    ? `http://localhost:5000/uploads/${req.profile_pic}`
                    : "https://i.pravatar.cc/150"
                }
                className="w-14 h-14 rounded-full border-2 border-yellow-400"
                alt={req.name}
              />

              <div>
                <p className="text-lg font-bold">{req.name}</p>
                <p className="text-sm text-gray-600">
                  Wants to collaborate with you
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={actionLoading === req.requestId}
                onClick={() =>
                  handleAction(req.requestId, "reject")
                }
                className="border-none px-4 py-2 rounded-full bg-gray-200 font-semibold disabled:opacity-60"
              >
                Reject
              </button>

              <button
                disabled={actionLoading === req.requestId}
                onClick={() =>
                  handleAction(req.requestId, "accept")
                }
                className="border-none px-4 py-2 rounded-full bg-yellow-500 text-white font-semibold disabled:opacity-60"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
