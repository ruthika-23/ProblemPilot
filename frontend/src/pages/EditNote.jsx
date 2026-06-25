import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditNote = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");


  useEffect(() => {

    const getNote = async () => {

      try {

        const res = await axios.get(
          "https://promblempilot.onrender.com/api/notes",
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const note = res.data.find(
          n => n._id === id
        );

        if (note) {

          setTitle(note.title);

          setContent(note.content);

        }

      } catch (error) {

        console.log(error);

      }

    };

    getNote();

  }, [id]);


  const updateNote = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        `https://promblempilot.onrender.com/api/notes/${id}`,
        {
          title,
          content
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      navigate("/notes");

    } catch (error) {

      console.log(error);

    }

  };


  return (

    <div className="min-h-screen bg-gray-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Edit Note
      </h1>

      <form
        onSubmit={updateNote}
        className="bg-gray-900 p-6 rounded-2xl"
      >

        <input
          className="w-full bg-gray-800 p-3 rounded-xl mb-4"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <textarea
          className="w-full bg-gray-800 p-3 rounded-xl mb-4"
          rows="6"
          value={content}
          onChange={(e)=>setContent(e.target.value)}
        />

        <button
          className="bg-green-600 px-6 py-3 rounded-xl"
        >
          Update Note
        </button>

      </form>

    </div>

  );

};

export default EditNote;