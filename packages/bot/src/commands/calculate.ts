import {ResultSet, evaluate, simplify} from 'mathjs'
import type {AnyCommand} from '../types'

interface BaseMathResult {
  toString: () => string
}

type MathResult = BaseMathResult | ResultSet<BaseMathResult>

const command: AnyCommand = {
  name: 'calculate',
  aliases: ['c', 'calculator'],
  description: 'Calculates a maths expression.',
  syntax: '<expression>',
  usage: `\`expression\`
The expression to calculate. See https://mathjs.org/docs/expressions/syntax.html for more information.`,
  async execute(message, {input}) {
    const handleError = async (error: unknown): Promise<void> => {
      await message.reply(`\`${error}\``)
    }

    let result: MathResult | undefined
    try {
      // Could be undefined if input is empty
      result = evaluate(input) as MathResult | undefined
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.startsWith('Undefined symbol')
      ) {
        // Attempt to simplify
        try {
          result = simplify(input)
        } catch (error_: unknown) {
          await handleError(error_)
          return
        }
      } else {
        await handleError(error)
        return
      }
    }
    await (result
      ? message.channel.send(
          result instanceof ResultSet
            ? result.entries.length === 1
              ? (result.entries[0] as MathResult).toString()
              : result.entries.map(e => e.toString()).join('\n')
            : result.toString(),
          {code: true}
        )
      : message.reply('please provide an expression to calculate!'))
  }
}
export default command