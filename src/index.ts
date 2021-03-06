import { transformMarkdownFilesIntoHtmlFiles, buildHtmlPageFromMarkdownString } from './transformer'
import { getMdFilesFromFolder, writeJsxFiles } from './fileProcessor'

const { performance, PerformanceObserver, PerformanceEntry  } = require("perf_hooks")
import { logger } from './logger'

export interface Options {
    inputPath?: string
    outputPath?: string
    frontMatterMode?: string, 
    reactHeadContextName?: string
    reactHeadContextVarName?: string
    deleteExistingOutputFolder?: boolean
}

export const defaultOptions = {
    inputPath: 'markdown',
    outputPath: 'jsxMarkdown',
    frontMatterMode: 'reacthelmet', 
    reactHeadContextName: 'ReactHeadContext',
    reactHeadContextVarName: 'reactHead',
    deleteExistingOutputFolder: false
}

//TODO: use typescript types
const perfObserver = new PerformanceObserver((items:any) => {
    items.getEntries().forEach((entry:any ) => {
        const trimmedDuration = parseInt(entry.duration)
        if(entry.name == 'cereal') {
            logger().info(`Done in ${trimmedDuration}ms.`)
            return
        }

        logger().debug(`${entry.name} finished in ${trimmedDuration}ms.`)
    })
})

perfObserver.observe({ entryTypes: ["measure"], buffer: true })


/**
 * Transforms a Markdown string to JSX, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {string} `markdownString` Markdown string to convert to a react component that may also include front-matter and html.
 * @param {componentName} `componentName` Name of new react component.
 * @param {Options} User defined options to override default values.
 * @return {Promise<number>} files
 */
 export const transformMarkdownString = async (markdownString: string, componentName: string, options?: Options): Promise<string> => {
    try {
        performance.mark('start-cereal')

        const userOptions = {
            ...defaultOptions,
            ...options,
            frontMatterMode: options?.frontMatterMode?.toLowerCase() ?? defaultOptions.frontMatterMode
        }

        const jsxString = await buildHtmlPageFromMarkdownString(markdownString)

        return jsxString
    } catch (error) {
        return ''
    } finally {
        performance.mark('end-cereal')
        performance.measure('cereal', 'start-cereal', 'end-cereal')
    }
}


/**
 * Transforms Markdown files to JSX files, including any html in the markdown.
 * Also, front-matter will be extracted in js variables in the react component.
 * @param {Options} User defined options to override default values.
 * @return {Promise<number>} files
 */
export const transformMarkdownFiles = async (options?: Options): Promise<number> => {
    try {
        performance.mark('start-cereal')

        const userOptions = {
            ...defaultOptions,
            ...options,
            frontMatterMode: options?.frontMatterMode?.toLowerCase() ?? defaultOptions.frontMatterMode
        }

        const mdFiles = await getMdFilesFromFolder(userOptions.inputPath)
        const htmlFileStrings = await transformMarkdownFilesIntoHtmlFiles(mdFiles)
        await writeJsxFiles(userOptions.outputPath, htmlFileStrings, userOptions.deleteExistingOutputFolder)

        return 0
    } catch (error) {
        return 1
    } finally {
        performance.mark('end-cereal')
        performance.measure('cereal', 'start-cereal', 'end-cereal')
    }
}
