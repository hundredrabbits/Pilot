import EffectInterface from './interface.effect.js'

export default function ChannelEffectInterface (pilot, channelId, id, node) {
  EffectInterface.call(this, pilot, id, node)

  this.el.id = `ch${parseInt(channelId).toString(16)}-fx`;

  this.run = function (msg) {
    if (!msg || msg.substr(0, 4).toLowerCase() !== `${parseInt(channelId).toString(16)}${id}`) {
      return
    }

    if (msg.substr(0, 4).toLowerCase() === `${parseInt(channelId).toString(16)}${id}`) {
      this.operate(`${msg.substr(1)}`.substr(3))
    }
  }
}
