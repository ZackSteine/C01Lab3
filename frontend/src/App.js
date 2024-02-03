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

  const deleteNote = async (entry) => {
    if (!entry || !entry._id) { 
      return;
    }

    try {
        await fetch("http://localhost:4000/deleteNote/" + entry._id, {
            method: "DELETE",
        }).then(async (response) => {
            if (!response.ok) {
                console.log("Server failed:", response.status);
                alert("Server failed.");
            } else {
              deleteNoteState(entry._id);
            }
        });
    } catch (error) {
        console.log("Fetch function failed:", error);
    }
  };

  const deleteAllNotes = async () => {
    try {
      await fetch("http://localhost:4000/deleteAllNotes", {
          method: "DELETE",
      }).then(async (response) => {
          if (!response.ok) {
              console.log("Server failed:", response.status);
              alert("Server failed.")
          } else {
            setNotes([]);
          }
      });
    } catch (error) {
        console.log("Fetch function failed:", error);
    };
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

  const deleteNoteState = (_id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== _id));
  };

  const patchNoteState = (_id, title, content) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note._id === _id ? {...note, title: title, content: content} : note
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