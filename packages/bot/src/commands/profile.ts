import {MessageEmbed} from 'discord.js'
import {fetchTimeZone} from '../database'
import {startCase, upperFirst} from '../lodash'
import {resolveUser} from '../utils'
import type {
  ClientPresenceStatus,
  ClientPresenceStatusData,
  PresenceStatus,
  User
} from 'discord.js'
import type {Command, GuildMember} from '../types'

declare global {
  namespace Intl {
    interface DateTimeFormatOptions {
      dateStyle?: 'full' | 'long' | 'medium' | 'short'
      timeStyle?: 'full' | 'long' | 'medium' | 'short'
    }
  }
}

const formatBoolean = (boolean: boolean | null): string =>
  boolean === true ? 'Yes' : 'No'
const formatStatus = (status: PresenceStatus): string =>
  status === 'dnd' ? 'Do Not Disturb' : upperFirst(status)

type FormatDate = (date: Date) => string

/** Creates an embed with information about a user. */
const getUserInfo = (user: User, formatDate: FormatDate): MessageEmbed => {
  const avatar = user.displayAvatarURL()
  const {bot, createdAt, id, presence, tag} = user
  const clientStatuses = presence.clientStatus
    ? (Object.entries(presence.clientStatus) as readonly (readonly [
        keyof ClientPresenceStatusData,
        ClientPresenceStatus
      ])[])
    : null

  const embed = new MessageEmbed()
    .setTitle(tag + (bot ? ' (Bot)' : ''))
    .setThumbnail(avatar)
    .addFields(
      {name: 'ID', value: id},
      {
        name: 'Status',
        value: `**${formatStatus(presence.status)}**${
          // if I explicitly use clientStatuses && clientStatuses.length @typescript-eslint/prefer-optional-chain
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- triggers
          clientStatuses?.length
            ? `\n${clientStatuses
                .map(([k, v]) => `${upperFirst(k)}: ${formatStatus(v)}`)
                .join('\n')}`
            : ''
        }`
      },
      {name: 'Joined Discord', value: formatDate(createdAt)},
      {
        name: `Avatar${user.avatar == null ? ' (Default)' : ''}`,
        value: `[Link](${avatar})`
      }
    )

  const flags = user.flags?.toArray()
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- otherwise prefer-optional-chain
  if (flags?.length) {
    embed.addField(
      'Flags',
      flags
        .map(f =>
          startCase(f.toLowerCase())
            .replace('Hypesquad', 'HypeSquad')
            .replace('Bughunter', 'Bug Hunter')
        )
        .join('\n'),
      false
    )
  }

  const {activities} = presence
  if (activities.length) {
    embed.addFields(
      activities.map(a => ({
        name:
          startCase(a.type.toLowerCase()) +
          (a.type === 'LISTENING' ? ' to' : ''),
        value:
          a.type === 'CUSTOM_STATUS'
            ? (a.emoji
                ? `${a.emoji.id == null ? a.emoji.name : `:${a.emoji.name}:`} `
                : '') + a.state!
            : `${a.name}${
                a.state == null
                  ? ''
                  : `
State: ${a.state}`
              }${
                a.details == null
                  ? ''
                  : `
Details: ${a.details}`
              }${
                a.url == null
                  ? ''
                  : `
[URL](${a.url})`
              }${
                Number.isNaN(a.createdAt.getTime())
                  ? ''
                  : `
Start: ${formatDate(a.createdAt)}`
              }${
                a.timestamps?.end
                  ? `
End: ${formatDate(a.timestamps.end)}`
                  : ''
              }${
                a.assets?.largeText == null
                  ? ''
                  : `
Large Text: ${a.assets.largeText}`
              }${
                a.assets?.largeImage == null
                  ? ''
                  : `
[Large Image URL](${a.assets.largeImageURL()!})`
              }${
                a.assets?.smallText == null
                  ? ''
                  : `
Small Text: ${a.assets.smallText}`
              }${
                a.assets?.smallImage == null
                  ? ''
                  : `
[Small Image URL](${a.assets.smallImageURL()!})`
              }`
      }))
    )
  }

  return embed
}

/** Updates an embed with information about a guild member. */
const addMemberInfo = (
  embed: MessageEmbed,
  {
    displayColor,
    displayHexColor,
    joinedAt,
    nickname,
    premiumSince,
    roles,
    voice: {
      channel,
      deaf,
      mute,
      serverDeaf = false,
      serverMute = false,
      streaming
    }
  }: GuildMember,
  formatDate: FormatDate
): void => {
  if (joinedAt) embed.addField('Joined this Server', formatDate(joinedAt))
  if (premiumSince) embed.addField('Boosting this server since', premiumSince)
  if (nickname != null) embed.addField('Nickname', nickname)
  if (roles.cache.size > 1) {
    embed.addField(
      'Roles',
      roles.cache
        .filter(r => r.name !== '@everyone')
        .map(r => r.name)
        .join('\n')
    )
    if (displayColor) embed.addField('Colour', displayHexColor)
  }
  if (channel) {
    embed.addField(
      'Voice',
      `Channel: ${channel.name}
Muted: ${formatBoolean(mute)}${serverMute === true ? ' (server)' : ''}
Deafened: ${formatBoolean(deaf)}${serverDeaf === true ? ' (server)' : ''}
Streaming: ${formatBoolean(streaming)}`
    )
  }
}

const formatDate = (timeZone: string): FormatDate => {
  const format = new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'short',
    timeStyle: 'long',
    timeZone
  })
  return (date): string => {
    const parts = format.formatToParts(date)
    const part = (type: Intl.DateTimeFormatPartTypes): string | undefined =>
      parts.find(p => p.type === type)?.value
    return `${part('day')}/${part('month')}/${part('year')}, ${part(
      'hour'
    )}:${part('minute')} ${part('dayPeriod')!.toLowerCase()} ${
      part('timeZoneName') ?? 'GMT'
    }`
  }
}

const command: Command = {
  name: 'profile',
  aliases: ['pr', 'pro', 'u', 'user'],
  description: 'Gets information on a user.',
  syntax: '[user]',
  usage: `\`user\` (optional)
The user to display information about. If omitted, defaults to you.
You can mention the user or use their tag (for example \`Username#1234\`).`,
  async execute(message, {input}, database) {
    const user = await resolveUser(message, input)
    if (!user) return

    const _formatDate = formatDate(
      await fetchTimeZone(database, message.author)
    )
    const embed = getUserInfo(user, _formatDate)
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL()
      )
      .setTimestamp()

    const member = message.guild?.member(user)
    if (member) addMemberInfo(embed, member, _formatDate)

    await message.channel.send(embed)
  }
}
export default command
