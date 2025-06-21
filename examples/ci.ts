import { CIBuilder } from '../src/ci'
import { Artifacts } from '../src/gitlab/artifacts'

const builder = CIBuilder({
    stages: [
        'build',
        'test',
        'deploy'
    ],
    file: {
        variables: {
            NODE_IMAGE: 'node:18'
        }
    },
    secret: {
        variables: [
            'DB_PWORD'
        ]
    }

})

builder.jobs(({vars}) => {
    return {
        '.build': {
            stage: 'build',
            image: vars('NODE_IMAGE'),
        },
        'build': {
            extends: [
                '.build'
            ],
            script: [
                'echo "Building the project..."',
                'npm run build'
            ],
            artifacts: Artifacts.create({
                paths: [
                    'dist/'
                ],
                expire_in: '1 hour'
            })
        },
        'test': {
            stage: 'test',
            script: [
                'npm test'
            ]
        },
        'deploy': {
            stage: 'deploy',
            script: [
                'echo "Deploying to production..."'
            ]
        }
    }
})

builder.write(process.cwd() + '/.example.gilab-ci.yml')