import { auth, firestore } from 'firebase-admin'
import { NetworkCode } from './network'

export const suppressLogs = (headers: any) => {
    return (
        headers.hasOwnProperty('x-suppress') && headers['x-suppress'] == 'true'
    )
}

export const getUID = async (authToken: string) => {
    try {
        if (!authToken || !authToken.startsWith('Bearer ')) {
            throw {
                code: NetworkCode.UNAUTHORIZED,
                data: {
                    message: 'Not signed in (missing bearer token)',
                },
            }
        }

        const bearerToken = authToken.split('Bearer ')[1]

        let theUid: any = {}
        if (process?.env?.FUNCTIONS_EMULATOR === 'true') {
            theUid['uid'] = getParsedJwt(bearerToken)?.user_id
        } else {
            theUid = await auth().verifyIdToken(bearerToken)
        }

        if (
            !theUid.hasOwnProperty('uid') ||
            theUid.uid === undefined ||
            theUid.uid === null
        ) {
            throw {
                code: NetworkCode.UNAUTHORIZED,
                data: {
                    message: 'Not signed in (invalid bearer token)',
                },
            }
        }

        return {
            code: NetworkCode.OK,
            data: {
                uid: theUid.uid,
            },
        }
    } catch (e) {
        return {
            code:
                e.code in NetworkCode
                    ? e.code
                    : NetworkCode.INTERNAL_SERVER_ERROR,
            data: e.data ?? { message: e.message },
        }
    }
}

export const getParsedJwt = (token: string) => {
    try {
        var base64Payload = token.split('.')[1]
        var payload = Buffer.from(base64Payload, 'base64')
        return JSON.parse(payload.toString())
    } catch {
        return undefined
    }
}

export const generateSlug = async (
    length: number = 8,
    category: string = ''
) => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    let validSlug = false
    let unique = false

    while (!validSlug || !unique) {
        result = ''
        for (var i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)]
        validSlug = isValidSlug(result)

        //need to check if unique in category
        if (category != '') {
            let snapshot = await firestore()
                .collection(category)
                .where('slug', '==', result)
                .get()
            unique = snapshot.empty
        } else {
            unique = true
        }
    }

    return result
}

export const isValidSlug = (text: string) => {
    const regexExp = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/g
    return regexExp.test(text)
}

export const convertToSlug = (Text: string) => {
    return Text.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .trim()
}
