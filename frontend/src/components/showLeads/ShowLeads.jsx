import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTrash, FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ShowLeads = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeads();
  }, [page]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/lead/showLeads?page=${page}&limit=5`
      );
      setLeads(res.data.leads);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching leads", err);
    }
  };

  const updateStatus = async (id) => {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/lead/${id}/updateLead`,
        { status: "Contacted" }
      ).then((res)=>{
        if (res.data.success === 1) {
        toast.success(res.data.message);
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === id ? { ...lead, status: res.data.lead.status } : lead
          )
        )}else {
        toast.error(res.data.error);
      }}).catch((err)=>{
        toast.error(err);
      })
  };

  const deleteLead = async (id) => {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/lead/${id}/deleteLead`
      ).then((res)=>{
        if (res.data.success === 1) {
        toast.success(res.data.message);
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
        } else {
        toast.error(res.data.error);
        }
      })
      .catch ((err)=>{
      console.error("Error deleting lead", err);
      toast.error("Failed to delete lead");
     })
  };

  return (
    <div className="p-6">
      <Link
        to="/"
        className="absolute top-4 left-4 bg-white shadow-md rounded-full p-3 
                   hover:bg-gray-100 transition duration-200 flex items-center justify-center"
        title="Go back to Form"
      >
        <FaArrowLeft className="text-blue-600" size={18} />
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-center">Leads</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
      <table className="min-w-full table-auto hidden md:table">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Feedback</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Created At</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6">{lead.name}</td>
              <td className="py-3 px-6">{lead.email}</td>
              <td className="py-3 px-6">{lead.phone}</td>
              <td className="py-3 px-6 truncate max-w-xs">{lead.feedback}</td>
              <td className="py-3 px-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lead.status === "New"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="py-3 px-6">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 flex items-center gap-3 justify-center">
                <button
                  onClick={() => updateStatus(lead._id)}
                  disabled={lead.status === "Contacted"}
                  className={
                    lead.status === "New"
                      ? `text-green-600 hover:text-green-800`
                      : `text-gray-400`
                  }
                  title="Mark as Contacted"
                >
                  <FaCheckCircle size={18} />
                </button>

                <button
                  onClick={() => deleteLead(lead._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Lead"
                >
                  <FaTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-4 md:hidden p-4">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="bg-gray-50 border rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  lead.status === "New"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {lead.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{lead.email}</p>
            <p className="text-sm text-gray-600">{lead.phone}</p>
            <p className="text-sm mt-2">{lead.feedback}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => updateStatus(lead._id)}
                disabled={lead.status === "Contacted"}
                className={`flex items-center gap-1 text-sm ${
                  lead.status === "New"
                    ? "text-green-600 hover:text-green-800"
                    : "text-gray-400"
                }`}
              >
                <FaCheckCircle />
              </button>

              <button
                onClick={() => deleteLead(lead._id)}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

        <div className="flex justify-center items-center py-4 gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`p-2 rounded-full ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaChevronLeft />
          </button>

          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`p-2 rounded-full ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowLeads;
