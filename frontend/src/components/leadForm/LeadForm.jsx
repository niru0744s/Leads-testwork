import axios from "axios";
import { useState } from "react";
import {toast} from 'react-toastify';
import { FaEnvelope, FaPhone, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    feedback: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
      toast.error("Phone number must be 10 digits")
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/lead/createLead`,formData).then((res)=>{
        if(res.data.success == 1){
          toast.success(res.data.message);
          setFormData({ name: "", email: "", phone: "", feedback: "" });
          setErrors({});
        }else{
          toast.error(res.data.message);
        }
      }).catch((err)=>{
        console.log(err);
        toast.error(err.message);
      })
  };

  return (
    <div className="p-6 relative">
      <Link
        to="/showLeads"
        className="absolute top-4 right-4 bg-white shadow-md rounded-full p-3 
                   hover:bg-gray-100 transition duration-200 flex items-center justify-center"
        title="Go to Leads"
      >
        <p>Leads List </p>
        <FaArrowRight className="text-blue-600" size={18} />
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-center">Lead Form</h2>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        <div className="p-8 flex flex-col justify-center bg-gray-50">
          <p className="text-sm text-gray-500 uppercase font-medium">
            We’re Here To Chapture New lead
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Give Us Your <br />
            <span className="text-blue-600">Leads</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Add potential customer details to keep track of inquiries and follow-ups.
             Make sure to provide accurate contact information and notes for better engagement.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center text-gray-700">
              <FaEnvelope className="text-blue-600 mr-3" />
              <span>Company***@gmail.com</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaPhone className="text-blue-600 mr-3" />
              <span>+123 - 456 - 7890</span>
            </div>
          </div>
        </div>

        <div className="p-8 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="feedback"
              placeholder="Your Feedback"
              value={formData.feedback}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:scale-105 transform transition"
            >
              Submit Form →
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
