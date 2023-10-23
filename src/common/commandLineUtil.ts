import { argv } from 'node:process';

export class InvalidCommandLineArgsError extends Error {
  constructor(message:string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export function getArgumentObject():Object {
  const result:any = {};
  for(let i = 2; i < argv.length; i++) {
    const argument = argv[i];
    if (argument.startsWith('-')) {
      const fields = argument.split(':');
      const optionName = fields[0].substring(1);
      const optionValue = fields.length > 1 ? fields[1] : null;
      if (result[optionName]) throw new InvalidCommandLineArgsError(`Cannot have more than one value for option ${optionName}.`);
      result[optionName] = optionValue;
    } else {
      if (result.command) throw new InvalidCommandLineArgsError('Cannot have more than one command.');
      result.command = argument;
    }
  }
  return result;
}