import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    problemName: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    status: 'Pending',
    topic: '',
    problemLink: '',
    notes: '',
    lastRevisedDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(

        `https://promblempilot.onrender.com/api/problems/${id}`,

        {
        headers:{
        Authorization:
        `Bearer ${localStorage.getItem("token")}`
        }
        }

        );
      } catch (e) {
        console.error(e);
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.put(
      `https://promblempilot.onrender.com/api/problems/${id}`,formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
      navigate('/problems');
    } catch (e) {
      alert('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Edit Problem</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-3xl p-10 border border-gray-800 space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block mb-3 text-sm font-medium">Problem Name</label>
            <input
              type="text"
              name="problemName"
              value={formData.problemName}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4"
              required
            />
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium">Platform</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4"
            >
              {['LeetCode', 'CodeChef', 'HackerRank', 'GeeksforGeeks', 'Codeforces', 'Other'].map(
                (p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4"
            >
              <option value="Pending">Pending</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-3 text-sm font-medium">Problem Link</label>
            <input
              type="url"
              name="problemLink"
              value={formData.problemLink}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4"
              placeholder="https://leetcode.com/..."
            />
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium">Last Revised Date</label>
            <input
              type="date"
              name="lastRevisedDate"
              value={formData.lastRevisedDate}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-3 text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-3xl px-6 py-4 resize-y"
              placeholder="Approach, complexities, tips..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 font-semibold rounded-2xl text-lg disabled:opacity-70"
        >
          {loading ? 'Updating...' : 'Update Problem'}
        </button>
      </form>
    </div>
  );
};

export default EditProblem;