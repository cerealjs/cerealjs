import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { logger } from './logger'

interface File {
    fileName: string
    data: string
}


export const transformMarkdownFilesIntoHtmlFiles = (mdFiles: File[]) : string[] => {
    return []
}

export const buildHtmlPageFromMarkdownString = (markdownString: string) : string => {
    return ''
}
