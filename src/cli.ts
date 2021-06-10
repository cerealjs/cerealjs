#! /usr/bin/env node

import yargs from 'yargs'
import { readFileSync } from 'fs'

import { version } from '../package.json'
import { transformMarkdownFiles, defaultOptions, Options } from './index'
import { logger, setLogLevel } from './logger'

const handleArgs = (cliArgs: string[]) : any => {
    const yargsObject = yargs(cliArgs)
        .scriptName('cereal')
        .wrap(yargs.terminalWidth())
        //Show help
        .help('help')
        .alias('help', 'h')
        .showHelpOnFail(false, 'whoops, something went wrong! try running with --help')
        .epilogue('for more information, check out the documentation at https://github.com/cerealjs/cerealjs')
        //Show version option
        .version('v', 'cerealjs version', version ?? 'unable to verify. check your package.json')
        .alias('version', 'v')
        //Allow reading options from a file
        .config('config', 'path to a cerealJs ".cerealrc.json" or ".cerealrc" config file ', function (configPath: string) {
            return JSON.parse(readFileSync(configPath, 'utf-8'))
        })
        .alias('c', 'config')
        .example([
            ['$0 -c="./.cerealrc"', 'importing config file.'],
            ['$0 --inputPath=./src/markdown/ --outputPath=./src/jsxPages/ --config=./.cerealrc.json', 'Full example']
        ])
        //Debug Mode
        .option('logLevel', {
            alias: 'l',
            choices: [1,2,3],
            describe: 'Set the log level. 1=debug mode, 2=default, 3= no logs',
            default: 2,
            type: 'number',
        })
        //cerealJs Options
        .group(['inputPath', 'outputPath', 'frontMatterMode', 'reactHeadContextName', 'reactHeadContextVarName', 'deleteExistingOutputFolder'], 'Config Parameters:')
        .option('inputPath', {
            alias: 'i',
            describe: 'Target folder or file with .md files for cerealJs to parse',
            type: 'string',
        })
        .option('outputPath', {
            alias: 'o',
            describe: 'Output destination folder to write the compiled .jsx files',
            type: 'string',
        })
        .option('deleteExistingOutputFolder', {
            alias: 'del',
            describe: 'Delete existing content in the output folder (outputFolderPath) before writing compiled files',
            type: 'boolean',
        })
        .argv

    //Enable debugger logging ASAP
    setLogLevel(yargsObject['logLevel'] as number)

    logger().debug(`cli args: ${JSON.stringify(yargsObject)}`)

    return yargsObject
}

const convertYargsToCerealOptions = (yargs: any) : Options => {
    const mergedObject:any = {}

    Object.keys(defaultOptions).forEach(key => {
        if (yargs.hasOwnProperty(key)) {
            mergedObject[key] = yargs[key]
        }
    })

    logger().debug(`parsed user options: ${JSON.stringify(mergedObject)}`)

    return mergedObject
}


export const cli = async (args: string[]) => {
    try {

        const yargs = handleArgs(args)
        const userOptions = convertYargsToCerealOptions(yargs)

        await transformMarkdownFiles(userOptions)
    } catch (err) {
        logger().error(`An unknown error occurred! Try using a markdown validator to ensure your mardown files are valid`, err)
    }
}

cli(process.argv)
