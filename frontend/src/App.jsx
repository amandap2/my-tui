import {useState} from 'react';
import { RunCommand } from "../wailsjs/go/main/App";
import './App.css';


function App() {
    const[lines, setLines] = useState([]);
    const[input, setInput] = useState("");

    async function runCommand() {
        if(!input.trim()) return;

        setLines((prev) => [...prev, "> " + input]);

        try{
            const res = await RunCommand(input);
            setLines((prev) => [...prev, res]);
        } catch(err){
            setLines((prev) => [...prev, "Error while executing commmand"]);
        }

        setInput("");
    }

    function handleKey(e){
        if(e.key === "Enter"){
            runCommand();
        }
    }

    return (
        <div className='app'>
            <div className='header'>AP SHELL v1.0.0</div>

            <div className='terminal'>
                {lines.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}

                <div>
                    &gt;
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        autoFocus 
                    />
                </div>

            </div>
            
            <div className="footer">MODE: NORMAL</div>
        </div>
    );
}

export default App
