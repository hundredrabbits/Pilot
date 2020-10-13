# Pilot

[Pilot](http://wiki.xxiivv.com/Pilot) is a **UDP synthesizer** designed to be controlled externally. It was created as a companion application to the livecoding environment [ORCA](https://hundredrabbits.itch.io/orca). 

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/pilot) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Pilot.git
cd Pilot/desktop/
npm install
npm start
```

<img src='https://raw.githubusercontent.com/hundredrabbits/Pilot/master/resources/preview.jpg' width="600"/>

## Commands

Pilot has 16 voices, and 8 effects. Commands can be entered directly with the input bar, or through UDP via the port `49161`. You can send multiple commands at once by using the `;` character. For example, `03C;13E` will play a `C3` and `E3` chord.

### Channel

#### Play

The Play commands allows you to play synth notes.

| Command  | Channel | Octave | Note | Velocity | Length |
| :-       | :-:     | :-:    | :-:  | :-:      | :-:    |
| `04C`    | 0       | 4      | C    | _64_     | _1/16_ |
| `04Cf`   | 0       | 4      | C    | 127      | _1/16_ |
| `04Cff`  | 0       | 4      | C    | 127      | 1bar   |

#### Settings

The Settings commands allow you to change the sound of the synth. The settings command format is a **channel** value between `0-G`, a 3 characters long **name**, followed by four values between `0-G`. The possible waveforms are `si`, `2i`, `4i`, `8i`, `tr`, `2r`, `4r`, `8r`, `sq`, `2q`, `4q` `8q`, `sw`, `2w`, `4w` and `8w`, and for noise `wh`, `pi`, `br`.

| Command     | Channel | Name         | Info |
| :-          | :-      | :-           | :-   |                    
| `0ENV056f`  | 0       | Envelope     | Set **Attack**:0.00, **Decay**:0.33, **Sustain**:0.40 and **Release**:1.00 |
| `1OSCsisq`  | 1       | Oscilloscope | Set **Osc1**:Sine, **Osc2**:Square |

### Global

#### Effects

The Effects are applied to all channels. The effect command format is a 3 characters long **name**, followed by one value between `0-G` for **wet** and **depth**.

| Command     | Channel | Operation  | Info |
| :-          | :-      | :-         | :-   |
| `DISff`     | All     | Distortion | ..   |
| `CHOff`     | All     | Chorus     | ..   |
| `REVff`     | All     | Reverb     | ..   |
| `FEEff`     | All     | Feedback   | ..   |

#### Masters

`TODO` Add the ability to change the mastering effects like compressor and volume. Coming soon!

#### Special

- `bpm140`, sets the BPM to `140`. This command is designed to apply to effects like feedback.
- `renv`, randomizes envelopes.
- `rosc`, randomizes oscillators.
- `refx`, randomizes effects.

## Record

Press **cmd/ctrl+r** to record, and press it again to stop.

## Convert OGG to MP3

Just use ffmpeg.

```
~/Documents/ffmpeg -i last.{ogg,mp3}  
```

<img src='https://raw.githubusercontent.com/hundredrabbits/Pilot/master/resources/device.jpg' width="600"/>

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
