# Oxygen

Microservice for all interactions for creating, retrieving, updating, and deleting subscription metadata for customers of Sheen magazine (Subscription Manager)

# Requirements

For development, you will only need Node.js and a node global package (NPM) installed in your
environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer. Also, be
  sure to have `git` available in your PATH, `npm` might need it (You can find git
  [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the
  [official Node.js website](https://nodejs.org/) and the
  [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.5.0

    $ npm --version
    6.14.6

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following
command, just open again the command line and be happy.

    $ npm install npm -g

###

---

# Install

    $ git clone https://github.com/Exodus-Technologies/Oxygen.git
    $ cd Oxygen
    $ npm install

# Configure app

Oxygen utilizes dotenv[https://github.com/motdotla/dotenv] for environment variable configuration.

- NODE_ENV (node environment)
- PORT (application port)
- HOST (hostname for application)
- DEFAULT_CACHE_TTL (ttl for node cache module for requests)
- CLUSTER_NAME (mongo db cluster name)
- DB_NAME (databse name)
- DB_USER (databse user name)
- DB_PASS (databse user password)

# Running the project (development mode)

Oxygen utilizes nodemon [https://www.npmjs.com/package/nodemon] auto-restart of server after
changes and edits.

    $ npm run serve:dev

See `package.json` for description of task.

# Start application (production mode)

    $ npm start

# Deployment (Docker and Amazon Container Service or ECS)

Oxygen utilizes various services provides by AWS:

- Route 53 (DNS)
- EC2 (Load balancer, Target Groups, Security groups)
- ECR (Docker container registry)
- ECS (Container Services that handles autoscaling and destination of "tasks")

See [host](http://subscriptions.services-exodustechnologies.com/subscription-service/probeCheck) for more details and a test drive...
