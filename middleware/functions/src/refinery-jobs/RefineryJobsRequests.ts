import { DataValidator } from 'data-validation-tools'
import { APP } from '..'
import { getUID, suppressLogs } from '../util/generic'
import { NetworkCode } from '../util/network'
import { EPXLogType, IPXLog, PXLogger } from '../util/pxlogger'
import { IRefineryJob, RefineryJobSchema } from './RefineryJobSchema'
import { addRefineryJob } from './RefineryJobsHelpers'

APP.post('/refinery-jobs', async (req: any, res: any) => {
    const logs: IPXLog[] = []
    try {
        const uid = await getUID(req?.headers?.authorization ?? '')
        if (uid.code !== NetworkCode.OK) {
            throw uid
        }

        const userId = uid.data.uid

        logs.push({
            type: EPXLogType.INFO,
            content: 'AddRefinery started by uid: ' + userId,
        })

        const dataIsValid = DataValidator(req.body, RefineryJobSchema)
        if (dataIsValid !== true) {
            throw {
                code: NetworkCode.BAD_REQUEST,
                data: {
                    message: dataIsValid,
                },
            }
        }

        const normlizedData: IRefineryJob = req.body

        //business logic
        const result = await addRefineryJob(normlizedData)

        // Result of business logic
        if (result.code !== NetworkCode.OK) {
            throw {
                code: result?.code,
                data: result?.data,
            }
        }

        logs.push({
            type: EPXLogType.INFO,
            content: 'Add Refinery success',
        })

        if (!suppressLogs(req.headers)) {
            PXLogger(logs)
        }

        res.status(NetworkCode.OK).send({
            message: '',
            data: {},
        })
    } catch (e) {
        logs.push({
            type: EPXLogType.ERROR,
            content:
                'Add Refinery try/catch error: ' +
                (e?.data?.message ?? e.message),
        })

        if (!suppressLogs(req.headers)) {
            PXLogger(logs)
        }

        res.status(e.code ?? NetworkCode.INTERNAL_SERVER_ERROR).send(
            e.data ?? { message: e.message }
        )
    }
})
