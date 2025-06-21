type CIBuilderConfig<Stages extends string[], Variables extends Record<string, any>> ={
    stages: Stages,
    workflow?: {
        rules:{}[],
    },
    variables: Variables
}

type ArrayToUnion<T extends string[]> = T[number]

type Job<Stages extends string[], OwnKey extends string, Extends extends string> = {
    image?: string,
    stage?: ArrayToUnion<Stages>,
    script?: string[],
    rules: any[],
    artifacts: any,
    extends?: Exclude<Extends, OwnKey>[]
}

export const CIBuilder = <Stage extends string, Stages extends Stage[], Variables extends Record<string, any>>(
    config: CIBuilderConfig<Stages, Variables>
) => {
    const vars = <Variable extends keyof Variables>(variable: Variable) => {
        return `\$${variable as string}`
    }

    const jobs = <JobList extends Record<string, any>>(
        _jobs: (opts: {
            vars: typeof vars
        }) => {
            [K in keyof JobList]: Job<Stages, K & string, keyof JobList & string>
        }
    ) => {
        return _jobs({
            vars
        })
    }

    return {
        jobs
    }
}