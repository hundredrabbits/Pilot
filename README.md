# Pilot

Coming soon..

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/orca) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Pilot.git
cd Pilot/desktop/
npm install
npm start
```

## Commands

### Read

The Read commands to play synth notes are of the format `[0-f][2-8][A-G]`.

| Command | Channel | Octave | Note | Velocity | Length |
| :-      | :-:     | :-:    | :-:  | :-:      | :-:    |
| `04C`   | 0       | 4      | C    | _64_     | _1/16_ |
| `04Cf`  | 0       | 4      | C    | 127      | _1/16_ |
| `04Cff` | 0       | 4      | C    | 127      | 1bar   |

### Write

| Command    | Channel | CMD             | Type                            |
| :-         | :-:     | :-:             | :-:                             | 
| `0OSCTRI8` | 0       | Oscillator Type | `SINE`, `SQUR`, `TRI8`          |
| `0VOLf`    | 0       | Volume          | 0-f                             |
| `0ENV1234` | 0       | Envelope        | Attack, Decay, Sustain, Release | 

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
