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

The Write commands to set synth values are of the format `[0-f][3xA-Z][4x0-Z]`.

### Envelope 

| Command    | Channel | CMD      | Attack  | Decay  | Sustain | Release |
| :-         | :-:     | :-:      | :-:     | :-:    | :-:     | :-:     | 
| `0ENV1234` | 0       | Envelope | *       | *      | *       | *       |

### Osc 

| Command    | Channel | CMD             | Type      |
| :-         | :-:     | :-:             | :-:       | 
| `0OSCTRI8` | 0       | Oscillator Type | Triangle8 |

## Options

### Commands

- `VOL`, set volume.
- `ENV`, set ADSR envelope.
- `OSC`, set Oscillator.
  - `SINE`
  - `SQUR`
  - `TRI8`

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
