import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import './Terminal.css';

import "xterm/css/xterm.css";

import { StartShell, SendInput, Resize } from "../wailsjs/go/main/App";
import { EventsOn } from '../wailsjs/runtime/runtime';

export default function XTerminal() {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontFamily: "monospace",
            theme: {
                background: "#000000",
                foreground: "#44d117"
            }
        });

        const fitAddon = new FitAddon();

        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // iniciar shell
        initShell();

        // receber output do Go
        EventsOn("shell:output", (data) => {
            term.write(data);
        });

        // enviar input para Go
        term.onData((data) => {
            SendInput(data);
        });

        // resize
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            term.dispose();
        };
    }, []);

    async function initShell() {
        try {
            await StartShell();

            setTimeout(() => {
                handleResize();
            }, 100);

        } catch (err) {
            console.error("Erro ao iniciar shell:", err);
        }
    }

    function handleResize() {
        const term = xtermRef.current;
        const fitAddon = fitAddonRef.current;

        if (!term || !fitAddon) return;

        fitAddon.fit();

        Resize(term.cols, term.rows);
    }

    return (
        <div
            className="terminal-shell"
            ref={terminalRef}
        />
    );
}