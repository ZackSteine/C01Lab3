import { useState, useEffect } from 'react';
import './App.css';
import Note from './note';
import Dialog from './Dialog';

function App() {
  // -- Backend-related state --
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState(undefined);

  // -- Dialog props --
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogNote, setDialogNote] = useState(undefined);

  const entry = {
    _id: "5f6e3d9d2e3d2f2f2f2f2f2f",
    title: "This is a note",
    content: "This is the content of the note",
  };

  // -- Database interaction functions --
  useEffect(() => {
    const getNotes = async () => {
      try {
        await fetch("http://localhost:4000/getAllNotes").then(
          async (response) => {
            if (!response.ok) {
              console.log("Server failed:", response.status);
            } else {
              await response.json().then((data) => {
                setNoteState(data.response);
              });
            }
          }
        )
      } catch (error) {
        console.log("Fetch function failed:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotes();
  }, []);

  const editNote = (entry) => {
    setDialogNote(entry);
    setDialogOpen(true);
  };

  const postNote = () => {
    setDialogNote(null);
    setDialogOpen(true);
  };

  const deleteNote = () => {
    console.log("delete note");
  };

  const deleteAllNotes = (entry) => {
    // code here
  };

  const closeDialog = () => {
    setDialogNote(null);
    setDialogOpen(false);
  };

  // -- State modification functions --
  const setNoteState = (data) => {
    setNotes(data);
  };

  const postNoteState = (_id, title, content) => {
    setNotes((prevNotes) => [...prevNotes, { _id, title, content }]); 
  };

  const deleteNoteState = () => {
    // code for modifyin state after DELETE here
  };

  const patchNoteState = (_id, title, content) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note._id == _id ? {...note, title: title, content: content} : note
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={AppStyle.title}>QuirkNotes</h1>
        <h4 style={AppStyle.text}>The best note-taking app ever </h4>

        <div style={AppStyle.notesSection}>
          {loading ? (
              <>Loading...</>
            ) : notes ? (
              notes.map((entry) => {
                return (
                  <div key={entry._id}>
                    <Note entry={entry} editNote={editNote} deleteNote={deleteNote} />
                  </div>
                );
              })
            ) : (
              <div style={AppStyle.notesError}>
                Something has gone horribly wrong! We can't get the notes!
              </div>
            )
          }
        </div>
        <Dialog
          open={dialogOpen}
          initialNote={dialogNote}
          closeDialog={closeDialog}
          postNote={postNoteState}
          patchNote={patchNoteState}
        />
        <button onClick={postNote}>Post Note</button>
        {notes && notes?.length > 0 && (
            <button onClick={deleteAllNotes}>Delete All Notes</button>
          )
        }
      </header>
    </div>
  );
}

const AppStyle = {
  dimBackground: {
    opacity: "20%",
    pointerEvents: "none",
  },
  notesSection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
};

export default App;