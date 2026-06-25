import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    pending: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [recentProblems, setRecentProblems] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://promblempilot.onrender.com/api/problems');
        const problems = res.data;
        
        const solved = problems.filter(p => p.status === 'Solved').length;
        const easy = problems.filter(p => p.difficulty === 'Easy').length;
        const medium = problems.filter(p => p.difficulty === 'Medium').length;
        const hard = problems.filter(p => p.difficulty === 'Hard').length;
        
        setStats({
          total: problems.length,
          solved,
          pending: problems.length - solved,
          easy,
          medium,
          hard
        });
        
        setRecentProblems(problems.slice(0, 5));
      } catch (error) {
        console.error('Error fetching problems', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user?.username}</p>
        </div>
        <Link 
          to="/add-problem" 
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl font-medium flex items-center gap-3"
        >
          + Add New Problem
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
        {[
          { label: 'Total Problems', value: stats.total, color: 'blue' },
          { label: 'Solved', value: stats.solved, color: 'emerald' },
          { label: 'Pending', value: stats.pending, color: 'amber' },
          { label: 'Easy', value: stats.easy, color: 'green' },
          { label: 'Medium', value: stats.medium, color: 'yellow' },
          { label: 'Hard', value: stats.hard, color: 'rose' },
        ].map((stat, index) => (
          <div key={index} className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
            <div className={`text-6xl font-bold mb-1 text-${stat.color}-400`}>{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">Recent Problems</h3>
          {recentProblems.length > 0 ? (
            <div className="space-y-4">
              {recentProblems.map(problem => (
                <div key={problem._id} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-none">
                  <div>
                    <div className="font-medium">{problem.problemName}</div>
                    <div className="text-sm text-gray-500">{problem.platform} • {problem.difficulty}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${problem.status === 'Solved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {problem.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No problems yet. Add some!</p>
          )}
          <Link to="/problems" className="mt-6 inline-block text-blue-400 hover:underline">View all problems →</Link>
        </div>

        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/problems" className="bg-gray-800 hover:bg-gray-700 h-28 rounded-2xl flex flex-col justify-center items-center transition">
              <span className="text-3xl mb-2">📋</span>
              <span>Browse Problems</span>
            </Link>
            <Link to="/add-problem" className="bg-gray-800 hover:bg-gray-700 h-28 rounded-2xl flex flex-col justify-center items-center transition">
              <span className="text-3xl mb-2">✚</span>
              <span>Add Problem</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;