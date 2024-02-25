import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const [selectedNote,setSelectedNote] = useState(null);

  const [notes,setNotes] = useState([]);
  
  

  useEffect(() => {
    const fetchNotes = async () => {
       try {
          const response = await fetch("http://localhost:5000/api/notes")
          const notes = await response.json();
          setNotes(notes);
       } catch (error) {
          console.log(error);
       }
    };
    
    fetchNotes();
  },[]);

  const handleAddNote = async (e) =>  {
    e.preventDefault();
    console.log(title,content);
    try {
    const response = await fetch("http://localhost:5000/api/notes",{
      method: "POST",
      headers: {
       "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        title,
        content
      })  
    })

    const newNote = await response.json();
    setNotes([
      newNote,
      ...notes
    ]);
    setTitle('');
    setContent(''); 
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleRemove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`,{
        method: "DELETE",
      })
      console.log(id);
      const targetId = id;
      const newNotes = notes.filter((note) => note.id !== targetId);
      setNotes(newNotes);
    } catch (error) {
       console.log(error);
    }

  }
  
  const handleEditNote = (note) => {
    console.log(note.id);
    if(note)
       setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);  
    console.log(selectedNote);
  }

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if(!selectedNote){
      return;
    }
    
    try {
    
    const response = await fetch(`http://localhost:5000/api/notes/${selectedNote.id}`,
    {
      method: 'PUT',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({title,content})
    }
    )
    
    const updatedNote = await response.json();
    const updatedNotesList = notes.map((note) => note.id === selectedNote.id ? updatedNote:note)
    

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);      
    } catch (error) {
      console.log(error)
    }  
  }

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }


  return (
     <div className="app-container">
                     <form className="notes-form">
                       <input
                         placeholder="title"
                         value={title}
                         onChange={(e) => setTitle(e.target.value)}
                         required
                       >
                       </input>
                       <textarea
                        placeholder="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                       >
                       </textarea>

                       {selectedNote ? (<div className='edit-buttons'>
                          <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-md hover:shadow-lg' onClick={handleUpdateNote}>Save</button>
                          <button onClick={handleCancel} className='ml-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-md hover:shadow-lg'>Cancel</button>
                       </div>):(<button type="submit" className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-md hover:shadow-lg' onClick={handleAddNote}>
                          Add Note
                        </button>)}

                     </form>
            <div className="notes-grid">
            {
              notes.map((note) => (
                <div className="notes-item" key={note.id} onClick={() => handleEditNote(note)}>
                 <div className="notes-header" key={note.id}>
                       <button className='font-bold' onClick={() => handleRemove(note.id)}>x</button>
                 </div>
                 <h1 className='font-bold text-2xl m-0'>{note.title}</h1>
                 <p>{note.content}</p>
              </div>
              ))
            }

            </div>
     </div>
  )

}