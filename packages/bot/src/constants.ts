import type {PermissionString} from 'discord.js'

/** Whether this is a development environment. */
export const dev = process.env.NODE_ENV !== 'production'

/** The permissions needed for the bot to work fully. */
export const permissions: PermissionString[] = [
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES'
]

/** The user id of the creator, cherryblossom. */
export const me = '506054261717598210'

/** Emojis. */
export const emojis = {
  left: 'โฌ',
  right: 'โก',
  // delete: '๐',
  tick: 'โ',
  cross: 'โ',
  clock: '๐',
  smirk: '๐',
  thumbsUp: '๐',
  anticlockwise: 'โคด๏ธ',
  clockwise: 'โคต๏ธ'
} as const

export const defaultTimeZone = 'UTC'

export const timeout = dev ? 5000 : 60_000

// #region Angry Noot Noot

export const pinguNouns = [
  'bots?',
  'pingu',
  'communism',
  'communists?',
  'stalin',
  'ussr',
  'union of soviet socialist republics',
  'soviet(?:s)?(?: union)?'
]
export const copulas = ['is', 'are']
export const articles = ['an?', 'the']
export const adverbs = ['very', 'much', 'so', 'too', 'really', 'big(?:gest)?']
export const badAdjectives = [
  'down',
  'not working',
  'offline',
  'stupid',
  'sto{2,}pid',
  'dumb',
  'annoying',
  'bad',
  'worst',
  'frustrating',
  'sucks?',
  'flawed',
  'shit',
  'stinke?y',
  'po{2,}(?:p(?:ie)?)?',
  'crap',
  'fu+ck(?: (?:yo)?u)?'
]
export const negative = ['not?', 'never']
export const goodAdjectives = [
  'good',
  'amazing',
  'great',
  'lovely',
  'fast',
  'awesome'
]

// #endregion
