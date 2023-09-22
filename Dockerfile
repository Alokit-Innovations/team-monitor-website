FROM node:18.13.0
WORKDIR /app

# Declare build-time variables
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_LINKEDIN_CLIENT_ID
ARG LINKEDIN_CLIENT_SECRET
ARG NEXT_PUBLIC_LINKEDIN_REDIRECT_URI
ARG NEXT_PUBLIC_LINKEDIN_STATE
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG BITBUCKET_CLIENT_ID
ARG BITBUCKET_CLIENT_SECRET
ARG BITBUCKET_OAUTH_CLIENT_ID
ARG PROJECT_ID
ARG PRIVATE_KEY_ID
ARG PRIVATE_KEY
ARG CLIENT_EMAIL
ARG CLIENT_ID
ARG AUTH_URI
ARG TOKEN_URI
ARG AUTH_PROVIDER_X509_CERT_URL
ARG CLIENT_X509_CERT_URL
ARG PGSQL_USER
ARG PGSQL_PASSWORD
ARG PGSQL_HOST
ARG PGSQL_PORT
ARG PGSQL_DATABASE
ARG DATABASE_URL
ARG NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY
ARG NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATAPLANE_URL
ARG RUDDERSTACK_SERVER_WRITE_KEY
ARG RUDDERSTACK_SERVER_DATAPLANE_URL
ARG GITLAB_CLIENT_ID
ARG GITLAB_CLIENT_SECRET
ARG CLARITY_ID
ARG SUBSCRIPTION_NAME
ARG TOPIC_NAME
ARG NODE_ENV

COPY . .
RUN npm install

# Set NODE_ENV to development for the build phase
ENV NODE_ENV=development
RUN npm run build

CMD ["npm", "run", "dev"]