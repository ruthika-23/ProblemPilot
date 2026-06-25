import { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard";

const Notes = () => {

  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");


  const fetchNotes = async () => {

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

      setNotes(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  useEffect(() => {

    fetchNotes();

  }, []);


  const addNote = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "https://promblempilot.onrender.com/api/notes",
        {
          title,
          content,
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setTitle("");
      setContent("");

      fetchNotes();

    } catch (error) {

      console.log(error);

    }

  };


  return (

    <div className="min-h-screen bg-gray-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        My Notes 📝
      </h1>

      <form
        onSubmit={addNote}
        className="bg-gray-900 p-6 rounded-2xl mb-10"
      >

        <input
          className="w-full bg-gray-800 p-3 rounded-xl mb-4"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full bg-gray-800 p-3 rounded-xl mb-4"
          rows="5"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          Add Note
        </button>

      </form>


      <div className="grid md:grid-cols-3 gap-6">

        {
          notes.map((note) => (

            <NoteCard
              key={note._id}
              note={note}
              fetchNotes={fetchNotes}
            />

          ))
        }

      </div>

    </div>

  );

};

export default Notes;