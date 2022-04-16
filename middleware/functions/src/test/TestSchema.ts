import { EDataType, ISchemaOption } from 'data-validation-tools'

export interface ITest {
    name: string
}

export const TestSchema: ISchemaOption[] = [
    {
        key: 'name',
        required: true,
        type: EDataType.STRING,
    },
]
