#Welcome

Project from the program: Cloud Developer Nanodegree - Udacity. This project is the backend part and works with the UI project: [To do List](https://github.com/flaviofrancisco/todo-list-ui).

# Requirements

- AWS Account;
- Auth0 Account and
- Serverless Framework.

# Environment settings

After clonning this project you need to install the project dependencies

```
$ project_folder_location/ npm install
```

Set up your AWS credentials on the Serverless Framework:

Example from the [Serverless documentation](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).

```
serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Install the Serverless Plugins:

```
serverless plugin install --name serverless-webpack
serverless plugin install --name serverless-reqvalidator-plugin
serverless plugin install --name serverless-aws-documentation
serverless plugin install --name serverless-iam-roles-per-function
serverless plugin install --name serverless-plugin-tracing
```

Once every thing is installed and your credentials are installed you need to update the following files:

## serverless.yml

- Update your AWS region: provider.region;
- Check the environment variables values and update accordingly with your needs.

## [config.ts](https://github.com/flaviofrancisco/todo-list-ui/blob/master/src/config.ts) from the UI project.

```
const apiId = 'your AWS Gateway API Id.'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

// From your Auth0 app settings.
export const authConfig = {  
  domain: 'your domain',            
  clientId: 'your client Id',
  callbackUrl: 'http://localhost:3000/callback'
}
```


