import { logger } from 'firebase-functions/v1'

export enum EPXLogType {
    LOG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}

export interface IPXLog {
    type: EPXLogType
    content: string
}

export const PXLogger = async (logs: IPXLog[]) => {
    logs.map((log: IPXLog) => {
        switch (log.type) {
            case EPXLogType.ERROR:
                logger.error(log.content)
                break
            case EPXLogType.WARN:
                logger.warn(log.content)
                break
            case EPXLogType.INFO:
                logger.info(log.content)
                break
            case EPXLogType.LOG:
            default:
                logger.log(log.content)
        }
    })
}
