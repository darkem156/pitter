# Hi! I am Darkem [![Main Pipeline](https://github.com/darkem156/pitter/actions/workflows/pipeline.yml/badge.svg)](https://github.com/darkem156/pitter/actions/workflows/pipeline.yml)

## This is a Twitter based Web Application. It is made with: 
- MySQL
- Express
- Vue
- NodeJS.

### You can see the Deploy [Here](https://app-pitter.herokuapp.com/)

This Projec also implements CI/CD with GitHub Actions. You can see the latest Workflow Runs [Here](https://github.com/darkem156/pitter/actions).

### Here you can Publish anything and Follow everyone
This is still in Development so there is still a lot to be implemented.

### How to run the App Locally?
1. Clone the repository
2. Build the image of the Pitter App with Docker Compose:
~~~
$ docker-compose build  
~~~
3. Run the Pitter and MySQL containers:
~~~
$ docker-compose up
~~~
  This will create the Pitter container on port 3000. Both containers (Pitter and MySQL) will be on pitter_default network

4. Before start using the App, first create the Database with the following command:
~~~
$ cat database/db.sql | docker exec -i mysqldb /usr/bin/mysql -u root --password=password
~~~

### Now You can Start to Use Pitter!!!
