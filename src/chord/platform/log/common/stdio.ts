'use strict';


export function printJson(anything: any, prompt: string = '[JSON] =>') {
    console.log(prompt, JSON.stringify(anything, null, 4));
}
