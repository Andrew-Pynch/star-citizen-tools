import { firestore } from 'firebase-admin'
import { NetworkCode } from '../util/network'
import { REFINERY_JOBS } from './../collections'
import { IRefineryJob } from './RefineryJobSchema'
export const addRefineryJob = async (data: IRefineryJob) => {
    try {
        const createdAt = Date.now()
        const jobToAdd: IRefineryJob = {
            ...data,
            createdAt,
        }
        const result = await firestore().collection(REFINERY_JOBS).add(jobToAdd)

        const id = result.id

        //set the id on the object we just created
        const finalJob = await firestore()
            .collection(REFINERY_JOBS)
            .doc(id)
            .set({
                jobId: id,
            })

        return {
            code: NetworkCode.OK,
            data: {
                message: 'Add refinery job success',
                newJob: finalJob,
            },
        }
    } catch (e) {
        return {
            code: e.code ?? NetworkCode.INTERNAL_SERVER_ERROR,
            data: e.data ?? { message: e.message },
        }
    }
}
