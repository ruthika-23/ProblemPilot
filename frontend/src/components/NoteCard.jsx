import axios from "axios";

const NoteCard = ({ note, fetchNotes }) => {

  const deleteNote = async () => {

    const confirmDelete = window.confirm(
      "Delete this note?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `https://promblempilot.onrender.com/api/notes/${note._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchNotes();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

      <h2 className="text-xl font-bold mb-3">
        {note.title}
      </h2>

      <p className="text-gray-300 mb-4 whitespace-pre-wrap">
        {note.content}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Updated :
        {" "}
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>

      <div className="flex gap-3">

        <a
          href={`/edit-note/${note._id}`}
          className="bg-blue-600 px-4 py-2 rounded-xl"
        >
          Edit
        </a>

        <button
          onClick={deleteNote}
          className="bg-red-600 px-4 py-2 rounded-xl"
        >
          Delete
        </button>

      </div>

    </div>

  );

};

export default NoteCard;