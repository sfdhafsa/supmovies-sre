pipeline {
    agent {
        docker {
            image 'node:26.13.1-alpine3.24'
        }
    }

    stages {
        stage('Backend tests') {
            steps {
                dir('SUPCONTENT/backend') {
                    sh 'npm ci'
                    sh 'npm test'
                }
            }
        }
    }
}
