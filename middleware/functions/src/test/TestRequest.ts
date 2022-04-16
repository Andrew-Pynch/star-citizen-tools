import { DataValidator } from 'data-validation-tools'
import { NetworkCode } from '../util/network'
import { EPXLogType } from '../util/pxlogger'
import { TestSchema } from './TestSchema'

APP.get('/test', async (req: any, res: any) => {
    const logs: IPXLog[] = []
    try {
        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer ')
        ) {
            throw {
                code: NetworkCode.UNAUTHORIZED,
                data: {
                    message: 'Not signed in',
                },
            }
        }

        const userId = req.headers.authorization.split('Bearer ')[1]

        logs.push({
            type: EPXLogType.INFO,
            content: 'Test started by uid: ' + userId,
        })

        const dataIsValid = DataValidator(req.body, TestSchema)
        if (dataIsValid !== true) {
            throw {
                code: NetworkCode.BAD_REQUEST,
                data: {
                    message: dataIsValid,
                },
            }
        }

        //NORMALIZATION

        //business logic
        const result = {
            code: NetworkCode.OK,
            data: {
                name: 'yuh',
            },
        }

        // Result of business logic
        if (result.code !== NetworkCode.OK) {
            throw {
                code: result?.code,
                data: result?.data,
            }
        }

        logs.push({
            type: EPXLogType.INFO,
            content: 'Test success',
        })

        res.status(NetworkCode.OK).send(result.data)

        return
    } catch (e) {
        logs.push({
            type: EPXLogType.ERROR,
            content: 'Test try/catch error: ' + e,
        })

        res.status(e.code ?? NetworkCode.INTERNAL_SERVER_ERROR).send({
            data: e.data ?? { message: e.message },
        })
    }
})
