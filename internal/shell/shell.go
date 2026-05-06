package shell

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"runtime"

	"github.com/creack/pty"
)

type ShellSession struct {
	cmd    *exec.Cmd
	stdin  io.WriteCloser
	stdout io.ReadCloser
	pty    *os.File
}

func NewShell(shellPath string) (*ShellSession, error) {
	cmd := exec.Command(shellPath)

	//LINUX/MACOS
	if runtime.GOOS != "windows" {
		ptmx, err := pty.Start(cmd)
		if err != nil {
			return nil, err
		}

		return &ShellSession{
			cmd: cmd,
			pty: ptmx,
		}, nil
	}

	//fallback windows
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return nil, err
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}

	cmd.Stderr = cmd.Stdout

	if err := cmd.Start(); err != nil {
		return nil, err
	}

	return &ShellSession{
		cmd:    cmd,
		stdin:  stdin,
		stdout: stdout,
	}, nil
}

func (s *ShellSession) Listen(output func(string), onExit func()) {
	go func() {
		var reader io.Reader

		if s.pty != nil {
			reader = s.pty
		} else {
			reader = s.stdout
		}

		buffer := make([]byte, 4096)

		for {
			n, err := reader.Read(buffer)
			if err != nil {
				onExit()
				return
			}

			chunk := string(buffer[:n])
			output(chunk)
		}
	}()
}

func (s *ShellSession) Write(input string) error {
	if s.pty != nil {
		_, err := s.pty.Write([]byte(input))
		return err
	}

	fmt.Println("RECEIVED:", input)
	_, err := s.stdin.Write([]byte(input))
	return err
}

func (s *ShellSession) Resize(cols, rows uint16) error {
	return pty.Setsize(s.pty, &pty.Winsize{
		Cols: cols,
		Rows: rows,
	})
}
