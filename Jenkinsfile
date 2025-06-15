pipeline {
    agent any

    stages {
        stage('Prepare Deployment Files') {
            steps {
                // Checkout the repository containing your Docker Compose and Jenkinsfile.
                checkout scm

                // Use withCredentials to retrieve the secret files and copy them to the workspace.
                withCredentials([
                    file(credentialsId: 'recollective-prod-env-frontend',     variable: 'FRONTEND_ENV_FILE'),
                    file(credentialsId: 'recollective-prod-env-backend',     variable: 'BACKEND_ENV_FILE'),
                    file(credentialsId: 'recollective-prod-env-minio',        variable: 'MINIO_ENV_FILE'),
                    file(credentialsId: 'recollective-prod-env-image-resizer',variable: 'RESIZER_ENV_FILE')
                ]) {
                    // Copy each secret file to the expected .env.* filename
                    sh '''
                      cp $FRONTEND_ENV_FILE          .env.production.frontend
                      cp $BACKEND_ENV_FILE          .env.production.backend
                      cp $MINIO_ENV_FILE             .env.production.minio
                      cp $RESIZER_ENV_FILE           .env.production.image-resizer
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(credentials: ['jenkins-docker']) {
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        script {
                            def prodUser = 'jay'
                            def prodHost = 'host.docker.internal'
                            def remoteDir = '~/mydata/nexus/recollective'

                            // Ensure remote directory exists and is writable
                            sh """
                                ssh -o StrictHostKeyChecking=no ${prodUser}@${prodHost} \\
                                    "mkdir -p ${remoteDir} && chmod -R u+rwx ${remoteDir} && \\
                                    rm -f ${remoteDir}/docker-compose.prod.yml"
                            """

                            // Debug: List remote directory
                            sh """
                                ssh -o StrictHostKeyChecking=no ${prodUser}@${prodHost} \\
                                    "ls -l ${remoteDir}"
                            """

                            // Transfer files
                            sh """
                                scp -v -o StrictHostKeyChecking=no docker-compose.prod.yml ${prodUser}@${prodHost}:${remoteDir}/docker-compose.prod.yml
                                scp -o StrictHostKeyChecking=no .env.production.frontend ${prodUser}@${prodHost}:${remoteDir}/.env.production.frontend
                                scp -o StrictHostKeyChecking=no .env.production.backend ${prodUser}@${prodHost}:${remoteDir}/.env.production.backend
                                scp -o StrictHostKeyChecking=no .env.production.minio ${prodUser}@${prodHost}:${remoteDir}/.env.production.minio
                                scp -o StrictHostKeyChecking=no .env.production.image-resizer ${prodUser}@${prodHost}:${remoteDir}/.env.production.image-resizer
                            """

                            // Deploy with temporary Docker config
                            sh """
                                ssh -o StrictHostKeyChecking=no ${prodUser}@${prodHost} \\
                                    "echo '{\"auths\":{\"docker.goodgermy.com\":{\"auth\":\"'\\\$(echo -n \$DOCKER_USERNAME:\$DOCKER_PASSWORD | base64)'\"}}}' > /tmp/docker-config.json && \\
                                    export DOCKER_CONFIG=/tmp/docker-config && \\
                                    cd ${remoteDir} && \\
                                    export PATH=/opt/homebrew/bin:/usr/local/bin:/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin && \\
                                    docker-compose -f docker-compose.prod.yml pull && \\
                                    docker-compose -f docker-compose.prod.yml up -d --build --force-recreate --remove-orphans && \\
                                    rm /tmp/docker-config.json"
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up all temporary .env files
            sh 'rm -f .env.production.frontend .env.production.backend .env.production.minio .env.production.image-resizer'
        }
    }
}
