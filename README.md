# Custom Terminal

A custom terminal application built with **Golang + Wails + React (.jsx)**, featuring direct integration with the machine shell and future support for a custom shell written in C for managing a Go-based chatbot.

## Objective

The project aims to create a modern desktop terminal interface capable of:

- Running native system shells (only PowerShell initially)
- Displaying real-time output
- Sending commands to active shell processes
- Managing interactive shell sessions
- Providing a modern desktop UI using React - Matrix style XD
- Integrating a future custom shell written in C
- Using that shell as a management interface for a Go chatbot

---

# Tech Stack

## Backend

- Go
- Wails
- PTY (pseudo-terminal)

## Frontend

- React
- JSX
- xterm.js
- xterm-addon-fit

---

# Current Features

- Native shell initialization
- Bidirectional communication between frontend and backend
- Terminal rendering using xterm.js
- Automatic terminal resize handling
- Real-time output streaming
- Interactive command execution

---

# Planned Features

- Custom shell written in C
- Internal command system
- Persistent command history
- Autocomplete support
- Go chatbot integration
- Structured logs
- Improved cross-platform support

---

# Architecture

```text
┌─────────────────────┐
│      React UI       │
│     (xterm.js)      │
└─────────┬───────────┘
          │
          │ Wails Events / Bindings
          │
┌─────────▼───────────┐
│     Go Backend      │
│                     │
│  - PTY management   │
│  - Shell lifecycle  │
│  - Event streaming  │
└─────────┬───────────┘
          │
          │ stdin/stdout
          │
┌─────────▼───────────┐
│    Native Shell     │
│ (PowerShell/Bash)   │
└─────────────────────┘
```

---

# Getting Started

## Requirements

- Go 1.22+
- Node.js
- Wails CLI

Install Wails CLI:

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

---

# Running in Development Mode

```bash
wails dev
```

---

# Building the Application

```bash
wails build
```

---

# Important Technologies

## Wails

Responsible for communication between Go and React without relying on Electron.

## PTY

Used to create and control interactive pseudo-terminals.

## xterm.js

Responsible for rendering the terminal interface on the frontend.

---

# Future Integration with Custom Shell

The project will be expanded to integrate a custom shell written in C focused on:

- Chatbot management
- Internal command execution
- Session control
- Administrative tools

Future example commands:

```bash
bot status
bot start
bot stop
```

---

# Motivation

The project was created from the need for:

- A fully customizable terminal
- Direct integration with Go applications
- Advanced process control

---

# Possible Use Cases

- Local chatbots
- DevOps tools
- Custom IDEs
- Administrative dashboards
- Automation tools
- Development environments
- Local AI assistants

---

# License

MIT