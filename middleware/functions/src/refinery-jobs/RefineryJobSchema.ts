import { EDataType, ISchemaOption } from 'data-validation-tools'

export enum ERefineryLocations {
    ARC_L1 = 'ARC-L1',
    CRU_L1 = 'CRU-L1',
    HUR_L1 = 'HUR-L1',
    HUR_L2 = 'HUR-L2',
    MIC_L1 = 'MIC-L1',
}

export enum ERefineryStatus {
    PLANNED = 'PLANNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export interface IRefineryDuration {
    days: number
    hours: number
    minutes: number
    seconds: number
}

export interface IRefineryJob {
    name: string
    location: ERefineryLocations
    duration: IRefineryDuration
    timeRemaining?: IRefineryDuration
    yield: number
    status?: ERefineryStatus
    createdAt?: number
    jobId?: string
}

export const RefineryJobSchema: ISchemaOption[] = [
    {
        key: 'name ',
        required: true,
        type: EDataType.STRING,
    },
    {
        key: 'location',
        required: true,
        type: EDataType.STRING,
        inArray: ['ARC-L1', 'CRU-L1', 'HUR-L1', 'HUR-L2', 'MIC-L1'],
    },
    {
        key: 'duration',
        required: true,
        type: EDataType.OBJECT,
        schemaOptions: [
            {
                key: 'days',
                required: true,
                type: EDataType.NUMBER,
            },
            {
                key: 'hours',
                required: true,
                type: EDataType.NUMBER,
            },
            {
                key: 'minutes',
                required: true,
                type: EDataType.NUMBER,
            },
        ],
    },
    {
        key: 'yield',
        required: true,
        type: EDataType.NUMBER,
    },
]
