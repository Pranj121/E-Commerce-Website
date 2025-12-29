import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit job
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("jobs").insert([
      {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        description: formData.description,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error posting job ❌");
      console.error(error);
    } else {
      alert("Job posted successfully ✅");
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020817] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white dark:bg-[#020817] border border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Post a Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary (optional)"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            rows="4"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

