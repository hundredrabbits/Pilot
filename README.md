# Pilot

Web enabled synth.

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/orca) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Pilot.git
cd Pilot/desktop/
npm install
npm start
```

## Commands

### Play

The Play commands to play synth notes are of the format:

| Command  | Channel | Octave | Note | Velocity | Length |
| :-       | :-:     | :-:    | :-:  | :-:      | :-:    |
| `P04C`   | 0       | 4      | C    | _64_     | _1/16_ |
| `P04Cf`  | 0       | 4      | C    | 127      | _1/16_ |
| `P04Cff` | 0       | 4      | C    | 127      | 1bar   |

### Channel

The Channel commands adjusts mute,pan,solo,volume settings of the specified channel

| Command      | Channel | CMD             | Type                                   |
| :-           | :-:     | :-:             | :-:                                    |
| `C0VOLf`     | 0       | Volume          | `0-z`                                  |
| `C0MUTE1`    | 0       | Mute            | `0-1` Mute/Unmute the channel          |
| `C0SOLO1`    | 0       | Solo            | `0-1` Solo/Unsolo the channel          |
| `C0PANI`     | 0       | Pan             | `0-z` Pan L/R  I is centre            |


## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
