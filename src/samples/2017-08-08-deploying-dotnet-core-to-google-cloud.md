---
layout: post
title:  Deploying Dotnet Core to Google Cloud
description: How to deploy dotnet core to google cloud with docker
date:   2017-08-08
tags: dotnet core kestrel ssl 
permalink: /blog/deploying-dotnet-core-to-google-cloud/
active-page: blog
disqus-identifier: f167c446-8e46-4f80-9e57-d7a10c1261ch
banner-image: assets/tech_cloud.jpg
react-component-name: deployingDotNetCoreToGoogleCloud
---

If you're trying to setup .NET Core / ASP.NET 5 on Google Cloud, then this is the article for you! 
As a disclaimer, I'm building everything based on using a mac development environment.

## Free Money!!!

As the time of writing this article, google is giving $300 to play around in the cloud and try out all the toys. Just [go here](https://cloud.google.com/)!

<aside class="pullquote">Free Money!</aside>

## Installing the Google cloud CLI

Now, we just need to setup the google cloud CLI. This is actually pretty nice and will be how you deploy your app. 

You can try to install the CLI here:

[https://cloud.google.com/sdk/downloads](https://cloud.google.com/sdk/downloads)

I, personally, was getting an error when trying to install gcloud CLI and ran this instead and it worked:

```
curl https://dl.google.com/dl/cloudsdk/release/install_google_cloud_sdk.bash | bash
```

## Setup your dotnetcore app 

Assuming you have a basic dotnet core setup you can skip this step. If you don't here's a barebones setup.

1) Install the dotnet core CLI

[https://www.microsoft.com/net/core/preview#macos](https://www.microsoft.com/net/core/preview#macos)

2) Run these to create new kestrel web server

```
dotnet new web
dotnet restore
dotnet publish -c Release
```

This will output a `bin` folder which will be what is on the server.

## Create a docker file

You don't need docker installed or anything for this. If you aren't familiar, a dockerfile is essentially a server installation script. 
Just create a file named `dockerfile` (no extension) and paste this in:


```
#FROM ermish/gcloud_dotnet_core
FROM gcr.io/google-appengine/aspnetcore
ADD ./yourpathtothebinfolder/bin/Release/netcoreapp2.0/publish/ /app
ENV ASPNETCORE_URLS=http://*:${PORT}                     
WORKDIR /app    
ENTRYPOINT [ "dotnet", "api.dll" ]
```

Update `yourpathtothebinfolder` with the appropriate path to the publish in the previous step. The path in this file means you don't need to keep the dockerfile in the same `publish` folder. 

NOTE: Here's where Google's basic tutorial went wrong. The docker image they have is old and didn't support the latest dotnet core version. So I went ahead and built out a new docker image and threw it out there for everyone to use! If you deploy your app and are getting errors, just uncomment the line that points to the image I created (the line starting with `#`) and remove the other `FROM` line pointing to `gcr.io`. 




## Create a google app engine server config

This is a basic script that creates a google app engine based on a dockerfile. Just create a file name `app.yaml` and paste this in:

```
service: my-demo-app
env: flex
runtime: custom
```

## Deploy the app!

Just run this to deploy the app to google cloud!

```
gcloud app deploy --version v1
```

You can rerun this and change the version each time. It will version the app and shift traffic to the new deployment.

## That's it!

<img src="{{ site.url }}/assets/thatsallfolks.jpg" alt="Drawing" style="width: 500px;"/>

Hope you enjoyed the tutorial, and feel free to reach out with any questions!