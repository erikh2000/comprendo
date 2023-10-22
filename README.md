# Comprendo

A tool for generating Spanish language learning content using LLM-based inference.

### Setting Up

Sheesh. It's not easy! If you are motivated to do it, let me know, and we might work on it together. But to give you an idea of what's needed:

* The comprendo-service project must be deployed to AWS with some dependencies (S3 bucket, Polly, Lambda, API Gateway, IAM roles) configured.
* You'll need to configure your own OpenAI account and deploy the OpenAI API to AWS.
* When you build the comprendo project, it will complain about missing a missing apiConfig import under a "private" folder. You'll need to create that file and add constants that are specific to your AWS and OpenAI deployments.

Alternatively, you can use the comprendo-service project as a reference and build your own different deployment.

### Contributing

The project isn't open to contributions at this point. But that could change. Contact me if you'd like to collaborate.

### Contacting

You can reach me on LinkedIn. I'll accept connections if you will just mention this project or some other shared interest in your connection request.

https://www.linkedin.com/in/erikhermansen/