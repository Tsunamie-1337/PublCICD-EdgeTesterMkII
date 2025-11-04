# My Industrial Edge CI/CD demo Project
### This Project was based on this [following Project](https://github.com/industrial-edge/jenkins-cicd/tree/main). I mostly Updated older Software imports.

### Used components

- Industrial Edge Device V 2.5.1-2
- Industrial Edge Management V 1.14.9
- VM - Debian GNU/Linux 13 (bookworm)
- Docker 28.4.0
- Jenkins 2.516.2

## When switching between Jenkinsfile A and B do the following steps:

### 1.
sudo systemctl edit docker.service
Comment out the lines
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://127.0.0.1:2375

sudo systemctl daemon-reload
sudo systemctl restart docker.service
sudo docker info

### 2.

Enable the docker pipeline Plugin

### 3.

Switch the selceted Jenkinsfile in the configuration of the Jenkins Pipeline

















cd /var/lib/jenkins/workspace/Jankis
sudo rm -rf * .[!.]* ..?*