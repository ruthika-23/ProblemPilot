import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    githubUrl: "",
    leetcodeUrl: "",
    profileImage: ""
  });

  const [stats, setStats] = useState({
    totalNotes: 0,
    solvedProblems: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        githubUrl: user.githubUrl || "",
        leetcodeUrl: user.leetcodeUrl || "",
        profileImage: user.profileImage || ""
      });
    }
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const problems = await axios.get(
          "https://promblempilot.onrender.com/api/problems",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const notes = await axios.get(
          "https://promblempilot.onrender.com/api/notes",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStats({
          totalNotes: notes.data.length,
          solvedProblems: problems.data.filter(
            (p) => p.status === "Solved"
          ).length
        });

      } catch (err) {
        console.log(err);
      }
    };

    loadStats();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
    setFormData({

    ...formData,
    profileImage:file
    });
  }
  };

  const handleSubmit = async(e)=>{
  e.preventDefault();
  setLoading(true);
  try{
    const data = new FormData();
    data.append(
      "username",
      formData.username
    );
    data.append(
      "bio",
      formData.bio
    );
    data.append(
      "githubUrl",
      formData.githubUrl
    );
    data.append(
      "leetcodeUrl",
      formData.leetcodeUrl
    );
    if(formData.profileImage){

      data.append(
        "profileImage",
        formData.profileImage
      );

    }
   await updateProfile(data);
    alert(
      "Profile Updated Successfully"
    );
    setEditMode(false);
  }
  catch(error){
    console.log(error);
    alert(
      "Failed To Update Profile"
    );
  }
  finally{

    setLoading(false);
  }
};

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8 text-white">
        My Profile
      </h1>

      <div className="bg-gray-900 rounded-3xl p-10 border border-gray-800 shadow-xl mb-10">

        <div className="flex flex-col items-center text-center">

          <img
            src={
              formData.profileImage instanceof File
                ? URL.createObjectURL(formData.profileImage)
                : formData.profileImage?.startsWith("/uploads")
                  ? `https://promblempilot.onrender.com${formData.profileImage}`
                  : formData.profileImage ||
                    "https://ui-avatars.com/api/?name=User"
            }
            alt="profile"
            className="
              w-32
              h-32
              rounded-full
              border-4
              border-blue-500
              object-cover
            "
        />

          <h2 className="text-3xl font-bold mt-5">
            {formData.username || "User"}
          </h2>

          <p className="text-gray-400">
            {user?.email}
          </p>

        </div>

        {!editMode && (
          <div className="text-center mt-8">

            <p className="text-gray-300 text-lg">
              {formData.bio}
            </p>

            <div className="flex justify-center gap-4 mt-6">

              <a
                href={formData.githubUrl}
                target="_blank"
                className="bg-gray-800 px-6 py-3 rounded-xl"
              >
                Github
              </a>

              <a
                href={formData.leetcodeUrl}
                target="_blank"
                className="bg-gray-800 px-6 py-3 rounded-xl"
              >
                LeetCode
              </a>

            </div>

            <button
              onClick={() => setEditMode(true)}
              className="mt-8 bg-blue-600 hover:bg-blue-700 px-10 py-3 rounded-xl font-semibold"
            >
              Edit Profile
            </button>

          </div>
        )}

        {editMode && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 mt-10 max-w-3xl mx-auto"
          >

            {[
              ["username","Username"],
              ["githubUrl","Github URL"],
              ["leetcodeUrl","LeetCode URL"]
            ].map(([name,label]) => (

              <div key={name}>

                <label className="block mb-2">
                  {label}
                </label>

                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-3"
                />

              </div>

            ))}

            <div>

              <label className="block mb-2">
                Upload Profile Image
              </label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-3"
              />

            </div>

            <div>

              <label className="block mb-2">
                Bio
              </label>

              <textarea
                rows="4"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-3"
              />

            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 py-4 rounded-xl font-semibold"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>

          </form>
        )}

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 justify-items-center">
        {[
          ["📚 Total Notes", stats.totalNotes],
          ["✅ Solved Problems", stats.solvedProblems]
        ].map(([title, value]) => (
          <div
            key={title}
            className="bg-gray-900 p-6 rounded-3xl border border-gray-800 text-center"
          >
            <h3 className="text-gray-400">{title}</h3>
            <p className="text-3xl font-bold mt-3">{value}</p>
          </div>
        ))}
      </div>


      <div className="bg-gray-900 rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6">🏆 Achievements</h2>

        {stats.totalNotes >= 1 && <p>🏆 First Note Created</p>}
        {stats.solvedProblems >= 50 && <p>🏆 50 Problems Solved</p>}

        {stats.totalNotes === 0 && stats.solvedProblems === 0 && (
          <p className="text-gray-400">No achievements unlocked yet.</p>
        )}
      </div>

    </div>
  );
};

export default Profile;
