import { writeFileSync } from 'fs'
import * as yaml from 'yaml'

type CIBuilderConfig<
Stages extends string[],
FileVariables extends Record<string, any>,
SecretVar extends string,
SecretVariables extends SecretVar[]
> ={
    stages: Stages,
    workflow?: {
        rules:{}[],
    },
    file: {
        variables?: FileVariables
    },
    secret?: {
        variables?: SecretVariables
    }
    
}

type ArrayToUnion<T extends string[]> = T[number]

type Job<Stages extends string[], OwnKey extends string, Extends extends string> = {
    image?: string,
    stage?: ArrayToUnion<Stages>,
    before_script?: string[],
    script?: string[],
    rules?: any[],
    artifacts?: any,
    extends?: Exclude<Extends, OwnKey>[]
}

type VariableKeys<
FileVariables extends Record<string, any>,
SecretVariables extends string[]
> = keyof FileVariables | ArrayToUnion<SecretVariables>

export const CIBuilder = <
Stage extends string,
Stages extends Stage[],
FileVariables extends Record<string, any>,
SecretVar extends string,
SecretVariables extends SecretVar[]
>(
    config: CIBuilderConfig<Stages, FileVariables, SecretVar, SecretVariables>
) => {
    const vars = <Variable extends VariableKeys<FileVariables, SecretVariables>>(variable: Variable) => {
        return `\$${variable as string}`
    }

    let data: any = {}

    const jobs = <JobList extends Record<string, any>>(
        _jobs: (opts: {
            vars: typeof vars
        }) => {
            [K in keyof JobList]: Job<Stages, K & string, keyof JobList & string>
        }
    ) => {
        data = {
            ...data,
            ..._jobs({
                vars
            })
        }
    }

    const build = () => {
        const finalData: any = {
            stages: config.stages,
            ...(config.file.variables ? {
                variables: config.file.variables
            }: {}),
            ...data
        }

        return yaml.stringify(finalData)
    }

    const write = (file?: string) => {
        if (!file) {
            file = `${process.cwd()}/.gitlab-ci.yml`
        }

        writeFileSync(file, build())
    }

    return {
        jobs,
        build,
        write
    }
}