import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Problems = () => {
  const [problems, setProblems] = useState([]);


  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');


  useEffect(() => {
    const fetchProblems = async () => {
      try {                       
        const res = await axios.get(
          "https://promblempilot.onrender.com/api/problems",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setProblems(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProblems();
  }, []);

  const computedFilteredProblems = (() => {
    let result = [...problems];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.problemName.toLowerCase().includes(term) ||
          (p.topic && p.topic.toLowerCase().includes(term))
      );
    }

    if (filter !== 'All') {
      if (['Easy', 'Medium', 'Hard'].includes(filter)) {
        result = result.filter((p) => p.difficulty === filter);
      } else if (['Solved', 'Pending'].includes(filter)) {
        result = result.filter((p) => p.status === filter);
      } else {
        result = result.filter((p) => p.platform === filter);
      }
    }

    return result;
  })();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this problem?')) {
      try {
        await axios.delete(`https://promblempilot.onrender.com/api/problems/${id}`);
        setProblems(problems.filter((p) => p._id !== id));
      } catch (e) {
        alert('Failed to delete');
      }
    }
  };

  const openNotesModal = (problem) => {
    setSelectedProblem(problem);
    setNotesDraft(problem.notes || '');
    setIsNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
    setSelectedProblem(null);
    setNotesDraft('');
  };

  const saveNotes = async (e) => {
    e?.preventDefault?.();
    if (!selectedProblem) return;
    try {
      const res = await axios.put(
        `https://promblempilot.onrender.com/api/problems/${selectedProblem._id}`,
        {
          ...selectedProblem,
          notes: notesDraft,
        }
      );

      setProblems((prev) =>
        prev.map((p) => (p._id === res.data._id ? res.data : p))
      );
      closeNotesModal();
    } catch (error) {
      alert('Failed to update notes');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {isNotesModalOpen && selectedProblem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedProblem.problemName}</h2>
              <button
                onClick={closeNotesModal}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-2xl"
              >
                Close
              </button>
            </div>

            <form onSubmit={saveNotes}>
              <textarea
                value={notesDraft}
                onChange={(ev) => setNotesDraft(ev.target.value)}
                rows={10}
                className="w-full bg-gray-800 border border-gray-700 rounded-3xl px-6 py-4 resize-y"
                placeholder="Write your problem notes..."
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeNotesModal}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold tracking-tight">My Problems</h1>
        <Link 
          to="/add-problem" 
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl font-medium flex items-center gap-3"
        >
          + New Problem
        </Link>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search problems..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Problems</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Solved">Solved</option>
          <option value="Pending">Pending</option>
          {['LeetCode', 'CodeChef', 'HackerRank', 'GeeksforGeeks', 'Codeforces', 'Other'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        {computedFilteredProblems.length > 0 ? (
          computedFilteredProblems.map((problem) => (

            <div key={problem._id} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">

                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-semibold">{problem.problemName}</h3>
                  <span className={`px-4 py-1 text-xs rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
                  <span>{problem.platform}</span>
                  <span>•</span>
                  <span>{problem.status}</span>
                  {problem.topic && <><span>•</span><span>{problem.topic}</span></>}
                </div>
                {problem.notes && <p className="mt-4 text-gray-400 line-clamp-2">{problem.notes}</p>}
              </div>
              
              <div className="flex gap-3">
                {problem.problemLink && (
                  <a 
                    href={problem.problemLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-gray-700 hover:bg-gray-800 rounded-2xl transition flex items-center"
                  >
                    Open Problem
                  </a>
                )}

                <button
                  onClick={() => openNotesModal(problem)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl transition"
                >
                  Notes
                </button>

                <Link 
                  to={`/edit-problem/${problem._id}`} 
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl transition"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(problem._id)}
                  className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">No problems found.</div>
        )}
      </div>
    </div>
  );
};

export default Problems;