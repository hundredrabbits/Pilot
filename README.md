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
| `04C`   | 0       | 4      | C    | _64_     | _1/16_ |
| `04Cf`  | 0       | 4      | C    | 127      | _1/16_ |
| `04Cff` | 0       | 4      | C    | 127      | 1bar   |

### Channel

The Channel Routes adjusts mute,pan,solo,volume settings of the specified channel

| Command      | Channel | CMD             | Type                                   |
| :-           | :-:     | :-:             | :-:                                    |
| `C0VOLf`     | 0       | Volume          | `0-z`                                  |
| `C0MUTE1`    | 0       | Mute            | `0-1` Mute/Unmute the channel          |
| `C0SOLO1`    | 0       | Solo            | `0-1` Solo/Unsolo the channel          |
| `C0PANI`     | 0       | Pan             | `0-z` Pan L/R  I is centre             |

### Synth

The synth routes adjust the instrument params on for the channel. The params you can adjust are
different, depending on the instrument. The params can be found [here](./sources/scripts/lib/types/instruments)

To choose the setting to adjust use a path notation. For example, to select the [FMSynth](./sources/scripts/lib/types/instruments/FMSynth.js) oscillator type, use
C0oscillator#type#2 where the '#' character is a path operator, and denotes where the path
ends and the value starts. Here are some more examples, on the FMSynth

| Command      | Channel | CMD             | Type                                   |
| :-           | :-:     | :-:             | :-:                                    |
| `C0harm#3`   | 0       | harmonicity     | `0-f` Notice you can use a short path  |
| `C0env#a#3f` | 0       | Attack Time     | unbounded number, value many chars as needed    |

### Effects

The effects routes let you modify values on channel effects to change the sound. Effects are specified as an array on the channel, and so you must specify the effect you want
to operate on as a 0 index array.

Path notation is also used to select what param to change. The params can be found [here](./sources/scripts/lib/types/effects)

| Command      | Channel | Effect| CMD              | Type                                   |
| :-           | :-:     | :-:   | :-:              | :-:                                    |
| `E01room#5`  | 0       | 1     | freeverb roomSize| `0-f` Notice you can use a short path  |
| `E02wet#3`   | 0       | 2     | Chorus wet       | `0-f` converts between 0-1             |


## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
