import {useState, useEffect, useRef } from 'react';
import { StartShell, SendInput, Resize } from "../wailsjs/go/main/App";
import './App.css';
import image from "./assets/images/eu_ascii.jpg";
import '@flaticon/flaticon-uicons/css/all/all.css';
import { EventsOn } from '../wailsjs/runtime/runtime';
import XTerminal from "./Terminal";

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

    const [terminalBuffer, setTerminalBuffer] = useState("");
    const terminalRef = useRef(null);
    const [mode, setMode] = useState("normal"); // normal | shell
    const [ready, setReady] = useState(false);

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

    useEffect(() => {
        EventsOn("shell:output", (data) => {
            setTerminalBuffer(prev => prev + data);
        });
    }, []);

    function handleResize() {
        if (mode !== "shell") return;
        const cols = Math.floor(window.innerWidth / 8);
        const rows = Math.floor(window.innerHeight / 18);

        Resize(cols, rows);
    }

    async function runCommand() {
        if (!input.trim()) return;

        // modo normal
        if (mode === "normal") {
            if (input === "/shell") {
                try {
                    await StartShell();
                    setMode("shell");
                    setReady(true);

                    handleResize();

                } catch (err) {
                    setLines(prev => [...prev, "Error starting shell: " + (err?.message || err)]);
                }

                setInput("");
                return;
            }

            // outros comandos normais
            setLines(prev => [...prev, "> " + input]);
            setInput("");
            return;
        }

        // modo shell (PTY)
        if (mode === "shell") {
            if (!ready) return;

            SendInput(input + "\n");
            setInput("");
        }

        if(input === 'exit'){
            setMode("normal");
            setReady(true);
            setLines(prev => [...prev, "Entering normal mode..."]);
        }
    }

    function handleKey(e){
        if(e.key === "Enter"){
            runCommand();
        }
    }

    return (
        <div className='app'>
            <div className='header'>
                <i class="fi fi-ts-galaxy-star"></i>  AP SHELL v1.0.0
            </div>

            <div className='terminal'>
                <pre ref={ref} className="matrix-col" />
                <div className='terminal-center'>

                    <pre className="terminal-banner">{banner}</pre>

                    {mode === "normal" && lines.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}

                    {mode === "shell" && (
                        <XTerminal />
                    )}

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

                <div className='sidebar'>
                    <div className='sidebar-user'>
                            <p>USER PROFILE</p>

                            <img src={image} alt="selfie" width={200}/>
                    </div>
                    <div className='sidebar-info'>
                        <p>
                            HELP
                        </p>

                        <div>
                            <p>/shell - to enter powershell</p>
                            <p>exit - to finish powershell</p>
                        </div>
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
