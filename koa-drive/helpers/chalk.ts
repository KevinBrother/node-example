import { getSystemTime } from '@helpers';
import { AnyType } from '@interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COLOUR = {
    'bold': ['\x1B[1m', '\x1B[22m'],
    'italic': ['\x1B[3m', '\x1B[23m'],
    'underline': ['\x1B[4m', '\x1B[24m'],
    'inverse': ['\x1B[7m', '\x1B[27m'],
    'white': ['\x1B[37m', '\x1B[39m'],
    'grey': ['\x1B[90m', '\x1B[39m'],
    'black': ['\x1B[30m', '\x1B[39m'],
    'blue': ['\x1B[34m', '\x1B[39m'],
    'cyan': ['\x1B[36m', '\x1B[39m'],
    'green': ['\x1B[32m', '\x1B[39m'],
    'magenta': ['\x1B[35m', '\x1B[39m'],
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],
    'whiteBG': ['\x1B[47m', '\x1B[49m'],
    'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG': ['\x1B[40m', '\x1B[49m'],
    'blueBG': ['\x1B[44m', '\x1B[49m'],
    'cyanBG': ['\x1B[46m', '\x1B[49m'],
    'greenBG': ['\x1B[42m', '\x1B[49m'],
    'magentaBG': ['\x1B[45m', '\x1B[49m'],
    'redBG': ['\x1B[41m', '\x1B[49m'],
    'yellowBG': ['\x1B[43m', '\x1B[49m']
};

enum Color {
    white = 'white',
    grey = 'grey',
    black = 'black',
    blue = 'blue',
    cyan = 'cyan',
    green = 'green',
    magenta = 'magenta',
    red = 'red',
    yellow = 'yellow',
    whiteBG = 'whiteBG',
    greyBG = 'greyBG',
    blackBG = 'blackBG',
    blueBG = 'blueBG',
    cyanBG = 'cyanBG',
    greenBG = 'greenBG',
    magentaBG = 'magentaBG',
    redBG = 'redBG',
    yellowBG = 'yellowBG'
}

interface Interval {
    [name: string]: AnyType;
}

interface PrintOptions {
    color?: Color;
    title?: string;
}

export class TerminalPrint {
    public message (message: AnyType | Interval, options?: PrintOptions): void {
        //
    }
    public info (message: AnyType | Interval, options?: PrintOptions): void {
        //
    }
    public warning (message: AnyType): void {
        const time = getSystemTime();
        if (message as string) {
            console.log('\x1B[33m[%s]\x1B[39m - %s -\x1B[33m %s\x1B[39m', 'Koa drive', time, message);
        } else if (message as number) {
            console.log('\x1B[33m[%d]\x1B[39m - %s -\x1B[33m %s\x1B[39m', 'Koa drive', time, message);
        } else {
            console.log('\x1B[33m[%o]\x1B[39m - %s -\x1B[33m %s\x1B[39m', 'Koa drive', time, message);
        }
    }
    public error (message: AnyType): void {
        const time = getSystemTime();
        if (message as string) {
            console.log('\x1B[31m[%s]\x1B[39m - %s -\x1B[31m %s\x1B[39m', 'Koa drive Error', time, message);
        } else if (message as number) {
            console.log('\x1B[31m[%d]\x1B[39m - %s -\x1B[31m %s\x1B[39m', 'Koa drive Error', time, message);
        } else {
            console.log('\x1B[31m[%o]\x1B[39m - %s -\x1B[31m %s\x1B[39m', 'Koa drive Error', time, message);
        }
    }
    public log (message: AnyType): void {
        const time = getSystemTime();
        if (message as string) {
            console.log('\x1B[33m[%s]\x1B[39m - %s -\x1B[32m %s\x1B[39m', 'Koa drive', time, message);
        } else if (message as number) {
            console.log('\x1B[33m[%d]\x1B[39m - %s -\x1B[32m %s\x1B[39m', 'Koa drive', time, message);
        } else {
            console.log('\x1B[33m[%o]\x1B[39m - %s -\x1B[32m %s\x1B[39m', 'Koa drive', time, message);
        }
    }
}

export const Print = new TerminalPrint();
