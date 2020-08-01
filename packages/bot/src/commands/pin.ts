import {me} from '../constants'
import {checkPermissions} from '../utils'
import type {Collection, Snowflake} from 'discord.js'
import type {Command, TextBasedGuildChannel} from '../types'

const command: Command = {
  name: 'pin',
  description: 'Pins a message.',
  syntax: '[message]',
  usage: `\`message\` (optional)
The ID of the message to pin. Defaults to the last message (excluding the one to execute this command) you sent in this server.`,
  async execute(message, {args}) {
    if (
      message.member?.hasPermission('MANAGE_MESSAGES') === true &&
      message.author.id !== me
    ) {
      await message.reply(
        'This command can only be used by someone with the Manage Messages permission or the bot owner!'
      )
      return
    }

    if (message.guild && !(await checkPermissions(message, 'MANAGE_MESSAGES')))
      return

    const allGuildMessages = (message.guild?.channels.cache.filter(
      c => c.type === 'text' || c.type === 'news'
    ) as Collection<Snowflake, TextBasedGuildChannel> | undefined)
      ?.flatMap(c => c.messages.cache)
      .filter(m => m.author.id === message.author.id)

    const id = (args[0] ??
      (
        allGuildMessages?.keyArray() ??
        message.channel.messages.cache.keyArray()
      ).sort((a, b) => Number(b) - Number(a))[1]) as string | undefined

    if (id === undefined) {
      await message.reply(
        'you have not provided an ID and I went offline since you sent your last message (or you haven’t sent another message)!'
      )
      return
    }

    if (!/^\d{17,19}$/u.test(id)) {
      await message.reply(`${id} isn’t a valid ID!`)
      return
    }

    const msg = message.guild
      ? allGuildMessages!.get(id)
      : message.channel.messages.cache.get(id)
    if (!msg) {
      await message.reply(`the message with ID ${id} couldn’t be found!`)
      return
    }

    await msg.pin()
  }
}
export default command