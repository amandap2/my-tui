package main

import (
	"context"
	shell "my-tui/internal/shell"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx   context.Context
	shell *shell.ShellSession
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) RunCommand(command string) string {
	return "executed " + command
}

func (a *App) StartShell() error {
	shell, err := shell.NewShell("powershell.exe")
	if err != nil {
		runtime.EventsEmit(a.ctx, "shell:exit")
		return err
	}

	a.shell = shell

	a.shell.Listen(
		func(out string) {
			runtime.EventsEmit(a.ctx, "shell:output", out)
		},
		func() {
			runtime.EventsEmit(a.ctx, "shell:exit")
			a.shell = nil
		},
	)
	return nil
}

func (a *App) SendInput(input string) {
	if a.shell == nil {
		return
	}

	a.shell.Write(input)
}

func (a *App) Resize(cols, rows int) {
	if a.shell == nil {
		return
	}
	a.shell.Resize(uint16(cols), uint16(rows))
}
