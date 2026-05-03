import {useState, useEffect, useRef } from 'react';
import { RunCommand } from "../wailsjs/go/main/App";
import './App.css';

function App() {
    const[lines, setLines] = useState([]);
    const[input, setInput] = useState("");
    const[time, setTime] = useState(new Date());

    const banner = `█████╗ ███╗   ███╗ █████╗ ███╗   ██╗██████╗  █████╗ 
██╔══██╗████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔══██╗
███████║██╔████╔██║███████║██╔██╗ ██║██║  ██║███████║
██╔══██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║  ██║██╔══██║
██║  ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║██████╔╝██║  ██║
╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝`;

    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        const chars = "01";
        const height = 40; // quantidade de linhas

        let column = Array.from({ length: height }, () =>
        chars[Math.floor(Math.random() * chars.length)]
        );

        function update() {
        // remove último
        column.pop();

        // adiciona novo no topo
        column.unshift(
            chars[Math.floor(Math.random() * chars.length)]
        );

        el.textContent = column.join("\n");
        }

        const interval = setInterval(update, 80); // velocidade

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                <pre ref={ref} className="matrix-col" />
                <div className='terminal-center'>

                    <pre className="terminal-banner">{banner}</pre>

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
            </div>
            
            <div className="footer">
                <p>MODE: NORMAL</p>
                <p>
                    TIME: {time.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                    })}
                </p>
                <p>DATE: {time.toLocaleDateString()}</p>
            </div>
        </div>
    );
}

export default App
