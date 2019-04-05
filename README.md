# Pilot

[Pilot](http://wiki.xxiivv.com/Pilot) is a **UDP synthetiser** designed to be controlled externally. It was created as a companion application to the livecoding environment [ORCA](https://hundredrabbits.itch.io/orca).

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/pilot) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Pilot.git
cd Pilot/desktop/
npm install
npm start
```

## Commands

Commands can be entered directly with the input bar, or through UDP via the port `49161`. You can send multiple commands at once by using the `;` character. For example, `03C;03E` will play a `C3` and `E3` chord.

### Channel

#### Play

The Play commands allows you to play synth notes.

| Command  | Channel | Octave | Note | Velocity | Length |
| :-       | :-:     | :-:    | :-:  | :-:      | :-:    |
| `04C`    | 0       | 4      | C    | _64_     | _1/16_ |
| `04Cf`   | 0       | 4      | C    | 127      | _1/16_ |
| `04Cff`  | 0       | 4      | C    | 127      | 1bar   |

#### Settings

The Settings commands allow you to change the sound of the synth. The settings command format is a **channel** value between `0-G`, a 3 characters long **name**, followed by four values between `0-G`.

| Command     | Channel | Name       | Info |
| :-          | :-      | :-         | :-   |                    
| `0ENV056f`  | 0       | Envelope   | Set **Attack**:0.00, **Decay**:0.33, **Sustain**:0.40 and **Release**:1.00 |
| `1WAVtria`  | 1       | Waveform   | Set **Waveform**:Triangle       |

### Global

#### Effects

The Effects are applied to all channels. The effect command format is a 3 characters long **name**, followed by one values between `0-G` for **wet** and **depth**.

| Command     | Channel      | Operation  | Info |
| :-          | :-           | :-         | :-   |
| `CHO9f`     | All          | Chorus     | ..   |
| `TRE9f`     | All          | Tremolo    | ..   |
| `BIT9f`     | All          | Bitcrusher | ..   |
| `CHE9f`     | All          | ?          | ..   |
| `DIS9f`     | All          | Distortion | ..   |
| `DEL9f`     | All          | Delay      | ..   |
| `REV9f`     | All          | Reverb     | ..   |
| `FEE9f`     | All          | Feedback   | ..   |

#### Masters

The Masters are applied at the end of the effects. The effect command format is a 3 characters long **name**, followed by one value between `0-G`.

| Command     | Channel      | Operation  | Info |
| :-          | :-           | :-         | :-   |
| `EQUf`      | All          | Equalizer  | ..   | 
| `STEf`      | All          | Stereo     | ..   | 
| `COMf`      | All          | Compressor | ..   | 
| `LIMf`      | All          | Limiter    | ..   | 
| `VOLf`      | All          | Volume     | ..   | 

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
